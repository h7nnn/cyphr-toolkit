export const config = { path: "/api/alert" };
// Temporarily disabled until caller authentication and rate limiting are implemented.
export default async () => new Response(JSON.stringify({
  ok: false,
  error: "notification endpoint disabled pending authentication and rate limiting"
}), {
  status: 503,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
});
