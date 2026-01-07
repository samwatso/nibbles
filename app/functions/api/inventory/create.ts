type Location = "fridge" | "freezer" | "pantry";
type Category = "fresh" | "chilled" | "meat_fish" | "frozen" | "pantry" | "other";
type StockStatus = "in_stock" | "low" | "out_of_stock";

export const onRequestPost: PagesFunction<{ NIBBLES_DB: D1Database }> = async ({ request, env }) => {
  const body = (await request.json().catch(() => ({}))) as Partial<{
    name: string;
    location: Location;
    category: Category;
    stock_status: StockStatus;
  }>;

  const name = (body.name ?? "").trim();
  const location = body.location;
  const category = body.category ?? "other";
  const stock_status = body.stock_status ?? "in_stock";

  if (!name) return json({ ok: false, error: "name is required" }, 400);
  if (!location || !["fridge", "freezer", "pantry"].includes(location)) {
    return json({ ok: false, error: "location must be fridge/freezer/pantry" }, 400);
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  await env.NIBBLES_DB
    .prepare(
      `INSERT INTO inventory_items (id, name, location, category, stock_status, added_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, name, location, category, stock_status, now, now)
    .run();

  return json(
    {
      ok: true,
      item: { id, name, location, category, stock_status, added_at: now, updated_at: now },
    },
    201
  );
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
