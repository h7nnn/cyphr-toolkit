export async function onRequestGet({ request }) {
  const u = new URL(request.url);
  const sym = (u.searchParams.get("symbol") || "BTCUSDT").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const out = { symbol: sym, fundingRate: null, markPrice: null, openInterest: null, longShort: null, ts: Date.now() };
  await Promise.all([
    g("https://fapi.binance.com/fapi/v1/premiumIndex?symbol=" + sym, (d) => { out.fundingRate = +d.lastFundingRate; out.markPrice = +d.markPrice; }),
    g("https://fapi.binance.com/fapi/v1/openInterest?symbol=" + sym, (d) => { out.openInterest = +d.openInterest; }),
    g("https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=" + sym + "&period=5m&limit=1", (d) => { if (Array.isArray(d) && d.length) out.longShort = +d[0].longShortRatio; }),
  ].map((p) => p.catch(() => {})));
  return json(out, 15);
}
async function g(url, map) {
  const r = await fetch(url, { cf: { cacheTtl: 12, cacheEverything: true } });
  map(await r.json());
}
function json(o, ttl) {
  return new Response(JSON.stringify(o), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=" + ttl },
  });
}
