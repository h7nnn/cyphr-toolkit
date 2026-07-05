export const config = { path: "/api/alert" };
// POST {channel:"telegram"|"discord", text:"...", webhook?, chatId?}
// Env vars (Netlify UI → Site settings → Environment variables):
//   TG_BOT_TOKEN, TG_CHAT_ID, DISCORD_WEBHOOK
export default async (req) => {
  if (req.method !== "POST") return j({ ok: false, error: "POST only" }, 405);
  let body = {};
  try { body = await req.json(); } catch {}
  const text = (body.text || "").toString().slice(0, 1500);
  if (!text) return j({ ok: false, error: "no text" }, 400);
  try {
    if (body.channel === "discord") {
      const hook = body.webhook || process.env.DISCORD_WEBHOOK;
      if (!hook) return j({ ok: false, error: "no webhook configured" }, 400);
      await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: text }) });
    } else {
      const token = process.env.TG_BOT_TOKEN;
      const chat = body.chatId || process.env.TG_CHAT_ID;
      if (!token || !chat) return j({ ok: false, error: "telegram env not set" }, 400);
      await fetch("https://api.telegram.org/bot" + token + "/sendMessage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML" }) });
    }
    return j({ ok: true });
  } catch (e) { return j({ ok: false, error: String(e) }, 502); }
};
function j(o, s) { return new Response(JSON.stringify(o), { status: s || 200, headers: { "Content-Type": "application/json" } }); }
