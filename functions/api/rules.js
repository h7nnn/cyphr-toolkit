// Temporarily disabled: the former global rules store allowed unauthenticated reads and writes.
export async function onRequest() {
  return new Response(JSON.stringify({
    ok: false,
    error: "rules endpoint disabled pending authentication and per-user storage"
  }), {
    status: 503,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}
