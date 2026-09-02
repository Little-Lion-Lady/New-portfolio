/*
  Records every image's REAL rendered box width, by loading the site in headless
  Chrome over CDP and measuring the DOM at four viewports (1728 / 1120 / 900 /
  390px, all at 2x). Feeds scripts/generate-image-sizes.mjs.

  The case-study collages size their images with flex ratios, so an image's
  rendered width is not readable from the markup — it has to be measured.

  Usage — the production server must already be running on :3010
  (`npm run build && PORT=3010 npm run start`):

      npm run images:sizes

  Runs on the repo's own Node (20+) — the CDP client in ./lib/cdp.mjs speaks
  WebSocket directly over a TCP socket, so no global WebSocket and no extra
  dependency is needed.

  Chrome is located automatically (macOS and common Linux paths). Set
  CHROME_PATH to override.
*/
import { setTimeout as sleep } from "node:timers/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { launchChrome } from "./lib/cdp.mjs";

const PORT = Number(process.env.CDP_PORT ?? 9334);
const PAGES = ["/", "/about", "/work/basis", "/work/covid-tracer", "/work/first-table"];
const WIDTHS = [{ n: "xl", w: 1728 }, { n: "lg", w: 1120 }, { n: "md", w: 900 }, { n: "sm", w: 390 }];

const ORIGIN = process.env.SITE_ORIGIN ?? "http://localhost:3010";

// Fail loudly up front. Without this the script measures a stack of error
// pages and quietly writes a sizes map with every image missing, which is far
// worse than not running at all.
try {
  const res = await fetch(ORIGIN, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
} catch (err) {
  console.error(
    `Cannot reach the site at ${ORIGIN} (${err.message}).\n` +
      "Start the production build first:\n" +
      "  npm run build && PORT=3010 npm run start\n" +
      "Then re-run. Override the origin with SITE_ORIGIN if it is elsewhere.",
  );
  process.exit(1);
}

const { client, kill } = await launchChrome({
  port: PORT,
  userDataDir: path.join(tmpdir(), "portfolio-measure-image-boxes"),
});
const send = (method, params) => client.send(method, params);

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
    await send("Page.navigate", { url: `${ORIGIN}${p}` });
    await sleep(3000);
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: 1200, deviceScaleFactor: 2, mobile: false });
    await sleep(800);
    const res = await send("Runtime.evaluate", { expression: EXPR, returnByValue: true });
    const val = res.result?.result?.value;
    if (!val) {
      console.error(`No images measured for ${p} at ${n} — aborting rather than writing a partial map.`);
      console.error(JSON.stringify(res).slice(0, 300));
      kill();
      process.exit(1);
    }
    const rows = JSON.parse(val);
    if (rows[0] && rows[0].vw !== w) console.error(`WARN ${p} ${n}: innerWidth=${rows[0].vw} expected ${w}`);
    for (const row of rows) {
      out[row.src] ??= { sizes: row.sizes, boxes: {} };
      out[row.src].boxes[n] = Math.max(out[row.src].boxes[n] ?? 0, row.box);
    }
  }
}
kill();
console.log(JSON.stringify(out, null, 1));
