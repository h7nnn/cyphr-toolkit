const ALLOWED_ORIGINS = new Set(["https://cyphr-toolkit.vercel.app", "http://localhost:3000"]);
export async function onRequest(context) {
  const { request, next } = context;
  const origin = request.headers.get("Origin");
  const headers = cors(origin);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  const res = await next();
  const out = new Response(res.body, res);
  for (const [key, value] of Object.entries(headers)) out.headers.set(key, value);
  return out;
}
function cors(origin) {
  const out = {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) out["Access-Control-Allow-Origin"] = origin;
  return out;
}
