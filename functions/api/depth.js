export async function onRequestGet({ request }) {
  const u = new URL(request.url);
  const sym = (u.searchParams.get("symbol") || "BTCUSDT").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const limit = Math.min(100, parseInt(u.searchParams.get("limit")) || 50);
  try {
    const r = await fetch("https://api.binance.com/api/v3/depth?symbol=" + sym + "&limit=" + limit, { cf: { cacheTtl: 3, cacheEverything: true } });
    const body = await r.text();
    return new Response(body, { status: r.status, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "fetch failed" }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
}
