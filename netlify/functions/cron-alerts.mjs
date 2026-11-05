// Scheduled monitor — checks Netlify Blobs alert rules every 5 min,
// pushes price-crossing hits to Telegram / Discord.
// Schedule is set in netlify.toml ([functions."cron-alerts"].schedule).
import { getStore } from "@netlify/blobs";
export default async () => {
  const s = getStore("cyphr");
  let rules = [];
  try { rules = (await s.get("rules", { type: "json" })) || []; } catch {}
  const fired = (await s.get("fired", { type: "json" })) || {};
  for (const r of rules) {
    try {
      const t = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=" + r.sym).then((x) => x.json());
      const px = +t.price;
      if (!px) continue;
      let hit = false, msg = "";
      if (r.type === "price_above" && r.val && px > r.val) { hit = true; msg = r.sym + " broke ABOVE " + r.val + " (now " + px + ")"; }
      if (r.type === "price_below" && r.val && px < r.val) { hit = true; msg = r.sym + " broke BELOW " + r.val + " (now " + px + ")"; }
      const fkey = r.id + ":" + r.type + ":" + (r.val || "");
      if (hit && fired[fkey]) continue;
      if (hit) {
        fired[fkey] = Date.now();
        const full = "\uD83D\uDD14 Cyphr alert: " + msg;
        const token = process.env.TG_BOT_TOKEN, chat = process.env.TG_CHAT_ID;
        if (token && chat) await fetch("https://api.telegram.org/bot" + token + "/sendMessage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chat, text: full }) });
        const hook = r.webhook || process.env.DISCORD_WEBHOOK;
        if (hook) await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: full }) });
      } else if (!hit && fired[fkey]) { delete fired[fkey]; }
    } catch {}
  }
  try { await s.setJSON("fired", fired); } catch {}
  return new Response("ok");
};
