/*
  Renders the per-route link-preview cards from scripts/og-case-study.html.

      npm run og:cards

  Writes app/<route>/opengraph-image.png (1200x630) plus the matching
  opengraph-image.alt.txt, which Next picks up by file convention and which
  take precedence over the site-wide card named in app/page-metadata.ts.
  The homepage keeps app/opengraph-image.png (source: scripts/og-card.html).

  Uses the repo's own CDP client, so no browser library is needed. Set
  CHROME_PATH if Chrome is not found automatically.
*/
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import { launchChrome } from "./lib/cdp.mjs";

// Lines and photos come straight from each page's own hero, so a card never
// says anything the page does not.
const CARDS = [
  {
    dir: "app/work/first-table",
    line1: "First Table booking app",
    line2: "Case study by Maryna Babych",
    image: "/home/work/first-table/first-table-app-phone-dining-table.jpg",
    alt: "First Table booking app case study by Maryna Babych, with the app open on a phone above a shared table of food",
  },
  {
    dir: "app/work/covid-tracer",
    line1: "NZ COVID Tracer app",
    line2: "Case study by Maryna Babych",
    image: "/home/work/covid-tracer/covid-tracer-title-card-qr-scanner.jpg",
    // Keep the "NZ COVID TRACER" lockup whole; the crop takes the phone's far edge.
    pos: "15% center",
    alt: "NZ COVID Tracer app case study by Maryna Babych, with the app's QR scanner open on a phone",
  },
  {
    dir: "app/work/basis",
    line1: "Basis smart panel app",
    line2: "Case study by Maryna Babych",
    image: "/home/work/basis/basis-app-phone-smart-panel.jpg",
    alt: "Basis smart panel app case study by Maryna Babych, with the app on a phone beside the wall-mounted panel",
  },
  {
    dir: "app/about",
    line1: "About Maryna Babych",
    line2: "Lead Product Designer",
    image: "/home/about/about-maryna-portrait.jpg",
    pos: "center 30%",
    alt: "About Maryna Babych, Lead Product Designer, with a portrait photo",
  },
];

const { client, kill } = await launchChrome({
  port: Number(process.env.CDP_PORT ?? 9335),
  userDataDir: path.join(tmpdir(), "portfolio-og-cards"),
});
const send = (method, params) => client.send(method, params);
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });

const page = pathToFileURL(path.resolve("scripts/og-case-study.html")).href;
for (const card of CARDS) {
  const q = new URLSearchParams({ line1: card.line1, line2: card.line2, image: card.image, pos: card.pos ?? "center" });
  await send("Page.navigate", { url: `${page}?${q}` });
  // Wait for the photo and the font, not a fixed delay.
  for (let i = 0; i < 50; i++) {
    const { result } = await send("Runtime.evaluate", {
      expression: `document.fonts.status === "loaded" && document.getElementById("photo").complete && document.getElementById("photo").naturalWidth > 0`,
      returnByValue: true,
    });
    if (result?.result?.value) break;
    await sleep(100);
  }
  const { result: { data } } = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
  writeFileSync(path.join(card.dir, "opengraph-image.png"), Buffer.from(data, "base64"));
  writeFileSync(path.join(card.dir, "opengraph-image.alt.txt"), card.alt);
  console.log(`wrote ${card.dir}/opengraph-image.png`);
}
kill();
