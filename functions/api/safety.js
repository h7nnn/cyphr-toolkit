// Contract safety / rug check via GoPlus (free).
const CHAINMAP = { ethereum:"1", eth:"1", bsc:"56", bnb:"56", polygon:"137", arbitrum:"42161", base:"8453", optimism:"10", avalanche:"43114", avax:"43114", fantom:"250", cronos:"25", zksync:"324", linea:"59144", scroll:"534352", pulsechain:"369", blast:"81457", mantle:"5000", opbnb:"204" };

export async function onRequestGet({ request }) {
  const u = new URL(request.url);
  const chain = (u.searchParams.get("chain") || "").toLowerCase();
  const addr = u.searchParams.get("addr") || "";
  if (!addr) return json({ risk: "UNKNOWN", flags: ["no address"] }, 0);
  try {
    let url;
    if (chain === "solana") url = "https://api.goplus.io/api/v1/solana/token_security?contract_addresses=" + addr;
    else {
      const id = CHAINMAP[chain];
      if (!id) return json({ risk: "UNKNOWN", flags: ["chain unsupported"] }, 300);
      url = "https://api.goplus.io/api/v1/token_security/" + id + "?contract_addresses=" + addr.toLowerCase();
    }
    const r = await fetch(url).then((x) => x.json());
    const res = r.result || {};
    const key = Object.keys(res)[0];
    const d = (key && res[key]) || {};
    return json(normalize(d, chain), 300);
  } catch (e) {
    return json({ risk: "UNKNOWN", flags: ["lookup failed"] }, 60);
  }
}

function normalize(d, chain) {
  const honey = d.is_honeypot === "1" || d.cannot_sell_all === "1" || d.transfer_pausable === "1";
  const buyTax = parseFloat(d.buy_tax || 0) * 100;
  const sellTax = parseFloat(d.sell_tax || 0) * 100;
  const mint = d.is_mintable === "1" || d.mintable === "1";
  const openSrc = d.is_open_source === "1";
  let lpLocked = false;
  try { (d.lp_holders || []).forEach((h) => { if (h.is_locked == 1 || (h.tag || "").toLowerCase().indexOf("lock") >= 0) lpLocked = true; }); } catch (e) {}
  const flags = [];
  if (honey) flags.push("honeypot");
  if (buyTax > 10 || sellTax > 10) flags.push("tax " + Math.max(buyTax, sellTax).toFixed(0) + "%");
  if (mint) flags.push("mintable");
  if (!openSrc && chain !== "solana") flags.push("closed source");
  if (!lpLocked && chain !== "solana") flags.push("LP unlocked");
  let risk = "SAFE";
  if (honey || sellTax > 30) risk = "DANGER";
  else if (flags.length >= 2 || buyTax > 10 || sellTax > 10 || mint) risk = "CAUTION";
  return { risk, buyTax: +buyTax.toFixed(1), sellTax: +sellTax.toFixed(1), mint, openSrc, lpLocked, honey, flags };
}
function json(o, ttl) {
  return new Response(JSON.stringify(o), { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=" + ttl } });
}
