export const config = { path: "/api/rules" };
// Persistent alert rules via Netlify Blobs (zero-config persistent store).
import { getStore } from "@netlify/blobs";
const KEY = "rules";
function store() { return getStore("cyphr"); }
export default async (req) => {
  try {
    const s = store();
    if (req.method === "GET") {
      const rules = (await s.get(KEY, { type: "json" })) || [];
      return j({ rules });
    }
    if (req.method === "POST") {
      let b = {};
      try { b = await req.json(); } catch {}
      if (!b.sym) return j({ error: "symbol required" }, 400);
      const rules = (await s.get(KEY, { type: "json" })) || [];
      const rule = { id: "r" + Date.now().toString(36), sym: String(b.sym).toUpperCase(), type: b.type || "degree", val: b.val != null ? +b.val : null, webhook: b.webhook || null };
      rules.push(rule);
      await s.setJSON(KEY, rules);
      return j({ ok: true, rule });
    }
    if (req.method === "DELETE") {
      const u = new URL(req.url);
      const id = u.searchParams.get("id");
      let rules = (await s.get(KEY, { type: "json" })) || [];
      rules = rules.filter((r) => r.id !== id);
      await s.setJSON(KEY, rules);
      return j({ ok: true });
    }
    return j({ error: "method not allowed" }, 405);
  } catch (e) { return j({ error: String(e) }, 500); }
};
function j(o, s) { return new Response(JSON.stringify(o), { status: s || 200, headers: { "Content-Type": "application/json" } }); }
