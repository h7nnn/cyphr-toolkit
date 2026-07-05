export async function onRequestGet({ request }) {
  const u = new URL(request.url);
  const symbol = (u.searchParams.get("symbol") || "BTCUSDT").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const interval = (u.searchParams.get("interval") || "4h").replace(/[^a-zA-Z0-9]/g, "");
  const limit = Math.min(1000, parseInt(u.searchParams.get("limit")) || 500);
  const api = "https://api.binance.com/api/v3/klines?symbol=" + symbol + "&interval=" + interval + "&limit=" + limit;
  try {
    const r = await fetch(api, { cf: { cacheTtl: 20, cacheEverything: true } });
    const data = await r.text();
    return new Response(data, {
      status: r.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=20" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "fetch failed" }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
}
