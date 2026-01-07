export const onRequestGet: PagesFunction<{ NIBBLES_DB: D1Database }> = async ({ env }) => {
  const { results } = await env.NIBBLES_DB
    .prepare(
      `SELECT id, name, location, category, stock_status, added_at, updated_at
       FROM inventory_items
       ORDER BY updated_at DESC`
    )
    .all();

  return json({ ok: true, items: results });
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
