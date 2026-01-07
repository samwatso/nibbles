type Action = "delete" | "move" | "mark_out_of_stock";
type Location = "fridge" | "freezer" | "pantry";

export const onRequestPost: PagesFunction<{ NIBBLES_DB: D1Database }> = async ({ env, request }) => {
  const body = (await request.json().catch(() => null)) as
    | null
    | { ids?: string[]; action?: Action; location?: Location };

  const ids = (body?.ids ?? []).map(String).filter(Boolean);
  const action = body?.action;

  if (!ids.length) return json({ ok: false, error: "ids required" }, 400);
  if (!action) return json({ ok: false, error: "action required" }, 400);

  const placeholders = ids.map(() => "?").join(",");

  if (action === "delete") {
    await env.NIBBLES_DB.prepare(`DELETE FROM inventory_items WHERE id IN (${placeholders})`)
      .bind(...ids)
      .run();
    return json({ ok: true });
  }

  const now = new Date().toISOString();

  if (action === "move") {
    const location = body?.location;
    if (!location || !["fridge", "freezer", "pantry"].includes(location)) {
      return json({ ok: false, error: "location required for move" }, 400);
    }

    await env.NIBBLES_DB
      .prepare(
        `UPDATE inventory_items
         SET location = ?, updated_at = ?
         WHERE id IN (${placeholders})`
      )
      .bind(location, now, ...ids)
      .run();

    return json({ ok: true });
  }

  if (action === "mark_out_of_stock") {
    await env.NIBBLES_DB
      .prepare(
        `UPDATE inventory_items
         SET stock_status = 'out_of_stock', updated_at = ?
         WHERE id IN (${placeholders})`
      )
      .bind(now, ...ids)
      .run();

    return json({ ok: true });
  }

  return json({ ok: false, error: "Unknown action" }, 400);
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
