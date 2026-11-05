export const config = { path: "/api/gems" };
export default async () => {
  const out = [];
  try {
    const [boosts, latest] = await Promise.all([
      fetch("https://api.dexscreener.com/token-boosts/top/v1").then((r) => r.json()).catch(() => []),
      fetch("https://api.dexscreener.com/token-boosts/latest/v1").then((r) => r.json()).catch(() => []),
    ]);
    const seen = {}, addrs = [];
    [].concat(boosts || [], latest || []).forEach((b) => {
      if (b && b.tokenAddress && b.chainId) {
        const k = b.chainId + ":" + b.tokenAddress;
        if (!seen[k]) { seen[k] = 1; addrs.push(b.tokenAddress); }
      }
    });
    const pairs = [];
    for (let i = 0; i < addrs.length && i < 60; i += 30) {
      const batch = addrs.slice(i, i + 30).join(",");
      const d = await fetch("https://api.dexscreener.com/latest/dex/tokens/" + batch).then((r) => r.json()).catch(() => ({}));
      if (d && d.pairs) pairs.push(...d.pairs);
    }
    const byTok = {};
    pairs.forEach((p) => {
      const k = (p.chainId || "") + ":" + (p.baseToken && p.baseToken.address);
      const liq = (p.liquidity && p.liquidity.usd) || 0;
      if (!byTok[k] || liq > byTok[k]._liq) { p._liq = liq; byTok[k] = p; }
    });
    Object.keys(byTok).forEach((k) => { const g = score(byTok[k]); if (g) out.push(g); });
    out.sort((a, b) => b.gemScore - a.gemScore);
  } catch {}
  return json({ gems: out.slice(0, 12), ts: Date.now() }, 120);
};
function score(p) {
  try {
    const liq = (p.liquidity && p.liquidity.usd) || 0;
    const vol = (p.volume && p.volume.h24) || 0;
    const ch24 = (p.priceChange && p.priceChange.h24) || 0;
    const ch6 = (p.priceChange && p.priceChange.h6) || 0;
    const price = +p.priceUsd || 0;
    const fdv = p.fdv || 0;
    const age = p.pairCreatedAt ? (Date.now() - p.pairCreatedAt) / 3600000 : 9999;
    const tx = (p.txns && p.txns.h24) || {};
    const buys = tx.buys || 0, sells = tx.sells || 0;
    if (!price || liq < 5000) return null;
    let s = 0;
    s += Math.min(25, liq / 4000);
    const vlr = liq ? vol / liq : 0; s += Math.min(25, vlr * 8);
    s += Math.max(-10, Math.min(20, ch24 / 5));
    s += Math.max(-5, Math.min(10, ch6 / 3));
    if (age < 2) s -= 10; else if (age < 24) s += 8; else if (age < 168) s += 12; else if (age < 720) s += 6;
    const br = sells ? buys / sells : buys ? 2 : 1; s += Math.max(-8, Math.min(12, (br - 1) * 8));
    if (fdv && fdv > 50000000) s -= 8; if (fdv && fdv < 2000000 && liq > 20000) s += 6;
    s = Math.max(0, Math.min(100, Math.round(s + 30)));
    const volize = Math.abs(ch6) || Math.abs(ch24) / 3 || 10;
    const stopPct = Math.max(0.12, Math.min(0.35, (volize / 100) * 1.5));
    const sl = price * (1 - stopPct), risk = price - sl;
    const flags = [];
    if (liq < 20000) flags.push("low liquidity");
    if (age < 2) flags.push("very new");
    if (fdv > 50000000) flags.push("high FDV");
    if (sells > buys) flags.push("sell pressure");
    return {
      sym: (p.baseToken && p.baseToken.symbol) || "?", name: (p.baseToken && p.baseToken.name) || "",
      chain: p.chainId, addr: (p.baseToken && p.baseToken.address) || "", dex: p.dexId, url: p.url, price, entry: price, sl,
      tp1: price + risk * 1.5, tp2: price + risk * 3, tp3: price + risk * 5,
      stopPct: +(stopPct * 100).toFixed(1), liq: Math.round(liq), vol24: Math.round(vol),
      ch24: +ch24.toFixed(1), ch6: +ch6.toFixed(1), ageH: +age.toFixed(1),
      buys, sells, fdv: Math.round(fdv), gemScore: s, flags,
    };
  } catch { return null; }
}
function json(o, ttl) { return new Response(JSON.stringify(o), { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=" + ttl } }); }
