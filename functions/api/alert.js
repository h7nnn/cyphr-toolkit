// Temporarily disabled: unauthenticated callers could trigger server-side notifications.
export async function onRequestPost() {
  return new Response(JSON.stringify({
    ok: false,
    error: "notification endpoint disabled pending authentication and rate limiting"
  }), {
    status: 503,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}
