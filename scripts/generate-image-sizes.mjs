/*
  Generates app/components/image-sizes.ts — a measured `sizes` attribute for
  every photo on the site.

  Why this is measured rather than written by hand: the case-study collages lay
  their images out with flex ratios (`md:flex-[2.7304]`), so an image's rendered
  width is not readable from its own markup. Left unspecified, next/image falls
  back to sizes="100vw", and a 262px phone frame on a 2x display then downloads
  the 3840px variant — roughly 35x the pixels it can show. That, more than
  anything else, is what made the case-study pages slow.

  Feed it the JSON from scripts/measure-image-boxes.mjs, which drives headless
  Chrome over CDP and records each image's real box width at four viewports:

      node scripts/measure-image-boxes.mjs > /tmp/boxes.json   # needs the site running on :3010
      node scripts/generate-image-sizes.mjs /tmp/boxes.json

  Re-run both whenever a layout changes.
*/
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const input = process.argv[2];
if (!input) {
  console.error("usage: node scripts/generate-image-sizes.mjs <boxes.json>");
  process.exit(1);
}

const measured = JSON.parse(readFileSync(input, "utf8"));
const OUT = path.resolve("app/components/image-sizes.ts");

// Tailwind's md/lg breakpoints. `sm` is everything below md.
const entries = [];
for (const [src, { boxes }] of Object.entries(measured)) {
  // The widest the image is ever asked to be at or above each breakpoint —
  // a few layouts are WIDER at tablet than desktop (BS4 is 820 at md, 441 at
  // lg), so taking a max rather than the single reading keeps every viewport
  // in the range served, never under-served.
  const lg = Math.max(boxes.xl ?? 0, boxes.lg ?? 0);
  const md = Math.max(boxes.md ?? 0, 0);
  const sm = Math.max(boxes.sm ?? 0, 0);
  if (!lg && !md && !sm) continue;
  // Round up to a whole px and add 1% of slack, so a sub-pixel layout shift
  // can never land the browser one bucket short.
  const pad = (n) => Math.ceil(n * 1.01);
  entries.push([src, `(min-width: 1024px) ${pad(lg || md || sm)}px, (min-width: 768px) ${pad(md || lg || sm)}px, ${pad(sm || md || lg)}px`]);
}
entries.sort(([a], [b]) => a.localeCompare(b));

const body = entries.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n");

writeFileSync(
  OUT,
  `/*
  Measured \`sizes\` for the site's imagery.
  ----------------------------------------
  GENERATED FILE — do not edit by hand.
  See scripts/generate-image-sizes.mjs for how to regenerate.

  Each value is built from the image's REAL rendered box width, recorded in a
  headless browser at 1728 / 1120 / 900 / 390px viewports. <GlassImage> falls
  back to this when a call site passes no \`sizes\` of its own; an explicit
  \`sizes\` prop still wins.

  Values are a per-breakpoint MAX across every page an image appears on, so the
  map can only ever over-serve a given slot, never under-serve it.
*/
export const IMAGE_SIZES: Record<string, string> = {
${body}
};

/** Undefined for anything unmeasured, which leaves next/image on its own default. */
export function sizesFor(src: string): string | undefined {
  return IMAGE_SIZES[src];
}
`,
);
console.log(`${entries.length} sizes written to ${path.relative(process.cwd(), OUT)}`);
