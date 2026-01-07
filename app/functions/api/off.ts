export const onRequestGet: PagesFunction<{ NIBBLES_DB: D1Database }> = async ({ env, request }) => {
  const url = new URL(request.url);
  const barcode = (url.searchParams.get("barcode") || "").trim();

  if (!barcode) return json({ ok: false, error: "barcode is required" }, 400);

  // 30-day cache
  const cached = await env.NIBBLES_DB
    .prepare(`SELECT barcode, name, brand, quantity, raw_json, updated_at FROM barcode_cache WHERE barcode = ?`)
    .bind(barcode)
    .first<any>();

  if (cached) {
    const ageMs = Date.now() - new Date(cached.updated_at).getTime();
    const maxAgeMs = 30 * 24 * 60 * 60 * 1000;
    if (!Number.isNaN(ageMs) && ageMs < maxAgeMs) {
      return json({ ok: true, product: pickProduct(cached) });
    }
  }

  const offUrl = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;
  const offRes = await fetch(offUrl, { headers: { "user-agent": "nibbles/1.0" } });

  if (!offRes.ok) return json({ ok: false, error: `Open Food Facts error (${offRes.status})` }, 502);

  const offData = await offRes.json() as any;

  const product = offData?.product || null;
  const name = product?.product_name || product?.product_name_en || null;
  const brand = product?.brands || null;
  const quantity = product?.quantity || null;

  const now = new Date().toISOString();
  await env.NIBBLES_DB
    .prepare(
      `INSERT INTO barcode_cache (barcode, name, brand, quantity, raw_json, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(barcode) DO UPDATE SET
         name=excluded.name,
         brand=excluded.brand,
         quantity=excluded.quantity,
         raw_json=excluded.raw_json,
         updated_at=excluded.updated_at`
    )
    .bind(barcode, name, brand, quantity, JSON.stringify(offData), now)
    .run();

  return json({ ok: true, product: { barcode, name, brand, quantity } });
};

function pickProduct(row: any) {
  return { barcode: row.barcode, name: row.name, brand: row.brand, quantity: row.quantity };
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
