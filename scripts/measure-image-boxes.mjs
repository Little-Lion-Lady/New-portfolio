/*
  Records every image's REAL rendered box width, by loading the site in headless
  Chrome over CDP and measuring the DOM at four viewports (1728 / 1120 / 900 /
  390px, all at 2x). Feeds scripts/generate-image-sizes.mjs.

  The case-study collages size their images with flex ratios, so an image's
  rendered width is not readable from the markup — it has to be measured.

  Usage — the production server must already be running on :3010
  (`npm run build && PORT=3010 npm run start`):

      npm run images:sizes

  Needs a Node with a global WebSocket (21+); the site itself still builds on
  20. Run it with `nvm use 25` if `npm run images:sizes` reports WebSocket
  undefined.
*/
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9334;
const PAGES = ["/", "/about", "/work/basis", "/work/covid-tracer", "/work/first-table"];
const WIDTHS = [{ n: "xl", w: 1728 }, { n: "lg", w: 1120 }, { n: "md", w: 900 }, { n: "sm", w: 390 }];

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, "--headless=new", "--no-first-run",
  "--user-data-dir=/tmp/cdp-measure2", "--disable-gpu", "about:blank",
], { stdio: "ignore" });
await sleep(3000);

const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const page = list.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method, params })); return new Promise((r) => pending.set(i, r)); };

await send("Page.enable");
await send("Runtime.enable");

const EXPR = `(() => {
  const st=document.createElement('style');
  st.textContent='*{opacity:1!important;animation:none!important;transition:none!important}';
  document.head.append(st);
  return JSON.stringify([...document.querySelectorAll('img')].map(i=>{
    const b=i.getBoundingClientRect();
    const raw=i.getAttribute('src')||'';
    const url=decodeURIComponent((raw.split('url=')[1]||'').split('&')[0]) || raw;
    return {src:url, box:Math.round(b.width), sizes:i.sizes||'', vw:innerWidth};
  }).filter(r=>r.box>0));
})()`;

const out = {};
for (const { n, w } of WIDTHS) {
  for (const p of PAGES) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: 1200, deviceScaleFactor: 2, mobile: false });
    await send("Page.navigate", { url: `http://localhost:3010${p}` });
    await sleep(3000);
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: 1200, deviceScaleFactor: 2, mobile: false });
    await sleep(800);
    const res = await send("Runtime.evaluate", { expression: EXPR, returnByValue: true });
    const val = res.result?.result?.value;
    if (!val) { console.error("no value", p, n, JSON.stringify(res).slice(0, 300)); continue; }
    const rows = JSON.parse(val);
    if (rows[0] && rows[0].vw !== w) console.error(`WARN ${p} ${n}: innerWidth=${rows[0].vw} expected ${w}`);
    for (const row of rows) {
      out[row.src] ??= { sizes: row.sizes, boxes: {} };
      out[row.src].boxes[n] = Math.max(out[row.src].boxes[n] ?? 0, row.box);
    }
  }
}
chrome.kill();
console.log(JSON.stringify(out, null, 1));
