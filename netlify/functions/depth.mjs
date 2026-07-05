export const config = { path: "/api/depth" };
export default async (req) => {
  const u = new URL(req.url);
  const sym = (u.searchParams.get("symbol") || "BTCUSDT").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const limit = Math.min(100, parseInt(u.searchParams.get("limit")) || 50);
  try {
    const r = await fetch("https://api.binance.com/api/v3/depth?symbol=" + sym + "&limit=" + limit);
    const body = await r.text();
    return new Response(body, { status: r.status, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3" } });
  } catch { return new Response(JSON.stringify({ error: "fetch failed" }), { status: 502, headers: { "Content-Type": "application/json" } }); }
};
