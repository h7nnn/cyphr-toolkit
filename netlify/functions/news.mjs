export const config = { path: "/api/news" };
const FEEDS = [
  ["CoinDesk", "https://www.coindesk.com/arc/outboundfeeds/rss/"],
  ["Cointelegraph", "https://cointelegraph.com/rss"],
  ["The Block", "https://www.theblock.co/rss.xml"],
  ["Decrypt", "https://decrypt.co/feed"],
];
export default async () => {
  const all = [];
  await Promise.all(FEEDS.map(async ([source, url]) => {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "CyphrEdge/1.0" } });
      const xml = await r.text();
      const items = xml.split(/<item[ >]/i).slice(1, 9);
      for (const it of items) {
        const title = clean(pick(it, "title"));
        const link = clean(pick(it, "link"));
        const date = pick(it, "pubDate").trim();
        if (title) all.push({ source, title, link, date });
      }
    } catch {}
  }));
  all.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  return json({ items: all.slice(0, 40), ts: Date.now() }, 90);
};
function pick(block, tag) { const m = block.match(new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)</" + tag + ">", "i")); return m ? m[1] : ""; }
function clean(s) { return s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim(); }
function json(obj, ttl) { return new Response(JSON.stringify(obj), { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=" + ttl } }); }
