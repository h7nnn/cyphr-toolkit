// Scheduled notifications intentionally disabled until rules and notification
// endpoints have caller authentication, per-user storage, and rate limiting.
export default async () => new Response("scheduled alerts disabled", {
  status: 503,
  headers: { "Cache-Control": "no-store" }
});
