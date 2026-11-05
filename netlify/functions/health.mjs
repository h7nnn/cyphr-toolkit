export const config = { path: "/api/health" };
export default async () => new Response(JSON.stringify({ ok: true, host: "netlify", ts: Date.now() }), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
