// POST {channel:"telegram"|"discord", text:"...", webhook?, chatId?}
// Env vars (Pages → Settings → Environment variables): TG_BOT_TOKEN, TG_CHAT_ID, DISCORD_WEBHOOK
export async function onRequestPost({ request, env }) {
  let body = {};
  try { body = await request.json(); } catch (_) {}
  const text = (body.text || "").toString().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, 1500);
  const channel = body.channel === "discord" ? "discord" : body.channel === "telegram" ? "telegram" : "";
  if (!channel) return j({ ok: false, error: "unsupported channel" }, 400);
  if (!text) return j({ ok: false, error: "no text" }, 400);
  try {
    if (body.channel === "discord") {
      const hook = env && env.DISCORD_WEBHOOK;
      if (!hook) return j({ ok: false, error: "no webhook configured" }, 400);
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
    } else {
      const token = env && env.TG_BOT_TOKEN;
      const chat = env && env.TG_CHAT_ID;
      if (!token || !chat) return j({ ok: false, error: "telegram env not set" }, 400);
      await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML" }),
      });
    }
    return j({ ok: true });
  } catch (e) {
    return j({ ok: false, error: "notification delivery failed" }, 502);
  }
}
function j(o, s) {
  return new Response(JSON.stringify(o), { status: s || 200, headers: { "Content-Type": "application/json" } });
}
