// CORS + edge cache for all /functions routes
export async function onRequest(context) {
  const { request, next } = context;
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: cors() });
  }
  const res = await next();
  const out = new Response(res.body, res);
  const c = cors();
  for (const k in c) out.headers.set(k, c[k]);
  return out;
}
function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
