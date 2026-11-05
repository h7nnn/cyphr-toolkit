export const config = { path: "/api/rules" };
// Temporarily disabled until per-user authorization and storage isolation are implemented.
export default async () => new Response(JSON.stringify({
  ok: false,
  error: "rules endpoint disabled pending authentication and per-user storage"
}), {
  status: 503,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
});
