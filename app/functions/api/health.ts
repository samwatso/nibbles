// app/functions/api/health.ts
export const onRequestGet: PagesFunction<{ NIBBLES_DB: D1Database }> = async (context) => {
  try {
    const db = context.env.NIBBLES_DB;
    if (!db) {
      return json(
        {
          ok: false,
          error: "Missing D1 binding: NIBBLES_DB. Add it in Cloudflare Pages → Settings → Bindings.",
        },
        500
      );
    }

    // Minimal connectivity check
    const res = await db.prepare("SELECT 1 as one").first<{ one: number }>();

    return json({
      ok: true,
      db: { connected: true, result: res ?? null },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return json(
      {
        ok: false,
        error: "Health check failed",
        details: err instanceof Error ? err.message : String(err),
      },
      500
    );
  }
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
