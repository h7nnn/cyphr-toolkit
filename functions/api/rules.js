// Persistent alert rules backed by Cloudflare KV.
// Bind a KV namespace named CYPHR_KV in Pages → Settings → Functions → KV namespace bindings.
export async function onRequest(context) {
  const { request, env } = context;
  const kv = env && env.CYPHR_KV;
  if (!kv) return j({ error: "KV not bound (CYPHR_KV)" }, 501);
  const KEY = "rules";
  try {
    if (request.method === "GET") {
      const rules = JSON.parse((await kv.get(KEY)) || "[]");
      return j({ rules });
    }
    if (request.method === "POST") {
      let b = {};
      try { b = await request.json(); } catch (_) {}
      if (!b.sym) return j({ error: "symbol required" }, 400);
      const rules = JSON.parse((await kv.get(KEY)) || "[]");
      const rule = { id: "r" + Date.now().toString(36), sym: String(b.sym).toUpperCase(), type: b.type || "degree", val: b.val != null ? +b.val : null };
      rules.push(rule);
      await kv.put(KEY, JSON.stringify(rules));
      return j({ ok: true, rule });
    }
    if (request.method === "DELETE") {
      const u = new URL(request.url);
      const id = u.searchParams.get("id");
      let rules = JSON.parse((await kv.get(KEY)) || "[]");
      rules = rules.filter((r) => r.id !== id);
      await kv.put(KEY, JSON.stringify(rules));
      return j({ ok: true });
    }
    return j({ error: "method not allowed" }, 405);
  } catch (e) {
    return j({ error: String(e) }, 500);
  }
}
function j(o, s) {
  return new Response(JSON.stringify(o), { status: s || 200, headers: { "Content-Type": "application/json" } });
}
