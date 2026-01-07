type Location = "fridge" | "freezer" | "pantry";
type Category = "fresh" | "chilled" | "meat_fish" | "frozen" | "pantry" | "other";
type StockStatus = "in_stock" | "low" | "out_of_stock";

type PatchBody = Partial<{
  name: string;
  location: Location;
  category: Category;
  stock_status: StockStatus;
}>;

export const onRequestPatch: PagesFunction<{ NIBBLES_DB: D1Database }> = async ({ env, params, request }) => {
  const id = String(params.id || "").trim();
  if (!id) return json({ ok: false, error: "Missing id" }, 400);

  const body = (await request.json().catch(() => ({}))) as PatchBody;

  const updates: string[] = [];
  const binds: unknown[] = [];

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) return json({ ok: false, error: "name cannot be empty" }, 400);
    updates.push("name = ?");
    binds.push(name);
  }

  if (body.location) {
    if (!["fridge", "freezer", "pantry"].includes(body.location)) {
      return json({ ok: false, error: "Invalid location" }, 400);
    }
    updates.push("location = ?");
    binds.push(body.location);
  }

  if (body.category) {
    updates.push("category = ?");
    binds.push(body.category);
  }

  if (body.stock_status) {
    updates.push("stock_status = ?");
    binds.push(body.stock_status);
  }

  if (updates.length === 0) return json({ ok: false, error: "No valid fields to update" }, 400);

  const now = new Date().toISOString();
  updates.push("updated_at = ?");
  binds.push(now);

  binds.push(id);

  await env.NIBBLES_DB
    .prepare(`UPDATE inventory_items SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...binds)
    .run();

  const item = await env.NIBBLES_DB
    .prepare(`SELECT id, name, location, category, stock_status, added_at, updated_at FROM inventory_items WHERE id = ?`)
    .bind(id)
    .first();

  return json({ ok: true, item });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
