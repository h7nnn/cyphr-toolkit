export async function onRequestGet() {
  return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
