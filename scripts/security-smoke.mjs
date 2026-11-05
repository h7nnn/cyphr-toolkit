import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const read = (p) => readFile(new URL("../" + p, import.meta.url), "utf8");
const [gi, hd, ui, alert, rules, proxy, netlifyProxy, toml] = await Promise.all([
  read(".gitignore"),
  read("_headers"),
  read("index.html"),
  read("functions/api/alert.js"),
  read("functions/api/rules.js"),
  read("functions/api/proxy.js"),
  read("netlify/functions/proxy.mjs"),
  read("netlify.toml")
]);

assert.ok(gi.includes("\n.env\n") && gi.includes("\n.vercel/\n"));
assert.ok(!hd.includes("Access-Control-Allow-Origin: *"));
assert.ok(ui.includes("function escapeHTML("));
assert.ok(ui.includes("${escapeHTML(h.inp)}") && ui.includes("${escapeHTML(w.s)}"));
assert.ok(alert.includes("status: 503") && rules.includes("status: 503"));
for (const s of [proxy, netlifyProxy]) {
  assert.ok(s.includes('t.protocol !== "https:"'));
  assert.ok(s.includes("t.username || t.password || t.port"));
  assert.ok(s.includes("2_000_000"));
}
assert.ok(!toml.includes('schedule = "*/5 * * * *"'));
console.log("CYPHR security smoke checks passed.");
