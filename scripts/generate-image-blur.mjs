/*
  Generates app/components/image-blur.ts — a tiny base64 LQIP for every photo
  under /public/home.

  Why: <GlassImage> renders next/image with `fill`, and until the photo decodes
  the frame is an empty bg-primary box. On a page that carries 25+ photos that
  reads as a broken layout for the first second. A blur placeholder fills the
  frame with the photo's own colours immediately, so the page looks composed
  while the real bytes land.

  The placeholders are generated at 16px wide (webp, q35) — a few hundred bytes
  each. They live in a server-only module, so only the ones a page actually
  renders are inlined into that page's HTML.

  Regenerate whenever imagery is added or replaced:
      node scripts/generate-image-blur.mjs
*/
import { readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve("public");
const ROOT = path.join(PUBLIC_DIR, "home");
const OUT = path.resolve("app/components/image-blur.ts");
const EXT = new Set([".jpg", ".jpeg", ".png"]);

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(ROOT)
  .filter((f) => EXT.has(path.extname(f).toLowerCase()))
  .sort();

const entries = [];
for (const file of files) {
  const key = "/" + path.relative(PUBLIC_DIR, file).split(path.sep).join("/");
  const buf = await sharp(file)
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 35 })
    .toBuffer();
  entries.push([key, `data:image/webp;base64,${buf.toString("base64")}`]);
}

const body = entries.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n");

writeFileSync(
  OUT,
  `/*
  Blur placeholders (LQIP) for the imagery under /public/home.
  ------------------------------------------------------------
  GENERATED FILE — do not edit by hand.
  Run \`node scripts/generate-image-blur.mjs\` to regenerate.

  Each value is a 16px-wide WebP inlined as a data URI. <GlassImage> looks a
  photo up here and hands it to next/image as \`placeholder="blur"\`, so the
  frame carries the photo's own colours from the very first paint instead of
  sitting empty until the full image decodes.
*/
export const IMAGE_BLUR: Record<string, string> = {
${body}
};

/** Undefined for anything not in the map, which next/image treats as "no placeholder". */
export function blurFor(src: string): string | undefined {
  return IMAGE_BLUR[src];
}
`,
);

const bytes = entries.reduce((a, [, v]) => a + v.length, 0);
console.log(`${entries.length} placeholders, ${(bytes / 1024).toFixed(1)}KB total, avg ${Math.round(bytes / entries.length)}B`);
