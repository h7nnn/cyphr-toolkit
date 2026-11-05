export async function onRequestGet({ request }) {
  const u = new URL(request.url);
  const sym = (u.searchParams.get("symbol") || "BTCUSDT").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const base = sym.replace(/USDT$/, "");
  const tasks = {
    binance: g("https://api.binance.com/api/v3/ticker/bookTicker?symbol=" + sym, (d) => mid(+d.bidPrice, +d.askPrice)),
    bybit: g("https://api.bybit.com/v5/market/tickers?category=spot&symbol=" + sym, (d) => +d.result.list[0].lastPrice),
    okx: g("https://www.okx.com/api/v5/market/ticker?instId=" + base + "-USDT", (d) => +d.data[0].last),
    coinbase: g("https://api.coinbase.com/v2/prices/" + base + "-USD/spot", (d) => +d.data.amount),
  };
  const out = {};
  await Promise.all(
    Object.keys(tasks).map(async (k) => {
      try { out[k] = await tasks[k]; } catch (_) { out[k] = null; }
    })
  );
  const px = Object.values(out).filter((v) => v != null && !isNaN(v));
  const avg = px.length ? px.reduce((a, b) => a + b, 0) / px.length : null;
  const spread = px.length > 1 && avg ? ((Math.max.apply(null, px) - Math.min.apply(null, px)) / avg) * 100 : 0;
  return json({ symbol: sym, exchanges: out, avg, spreadPct: +spread.toFixed(3), ts: Date.now() }, 8);
}
async function g(url, map) {
  const r = await fetch(url, { cf: { cacheTtl: 6, cacheEverything: true } });
  return map(await r.json());
}
function mid(b, a) { return (b + a) / 2; }
function json(o, ttl) {
  return new Response(JSON.stringify(o), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=" + ttl },
  });
}
