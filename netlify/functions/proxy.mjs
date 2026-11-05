export const config = { path: "/api/proxy" };
const ALLOW = [
  "api.binance.com","api1.binance.com","api2.binance.com","data-api.binance.vision","fapi.binance.com",
  "www.coindesk.com","cointelegraph.com","www.theblock.co","decrypt.co",
  "api.bybit.com","www.okx.com","api.coinbase.com","api.dexscreener.com","api.goplus.io","www.deribit.com",
];
export default async (req) => {
  const u = new URL(req.url);
  const target = u.searchParams.get("url");
  if (!target) return new Response("missing url", { status: 400 });
  let t;
  try { t = new URL(target); } catch { return new Response("bad url", { status: 400 }); }
  if (t.protocol !== "https:" || t.username || t.password || t.port || !ALLOW.includes(t.hostname)) return new Response("host not allowed", { status: 403 });
  try {
    const r = await fetch(t.toString(), { headers: { "User-Agent": "CyphrEdge/1.0" } });
    const body = await r.text();
    if (body.length > 2_000_000) return new Response("upstream response too large", { status: 502 });
    return new Response(body, { status: r.status, headers: { "Content-Type": r.headers.get("Content-Type") || "text/plain", "Cache-Control": "public, max-age=30" } });
  } catch { return new Response("fetch failed", { status: 502 }); }
};
