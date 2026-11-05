/*
  Optimise the image masters under /public and check them against budgets.

      npm run images:optimize           dry run: report what would change
      npm run images:optimize -- --write   apply it
      npm run images:check              fail if any image breaks its budget

  What --write does, and why it stops there:

  - Caps width at twice the widest the image is ever rendered (from the
    measured app/components/image-sizes.ts), and never above `maxWidth`
    (scripts/image-budgets.json). Next never serves a 2x screen more pixels
    than that, so the extra width in a master was never seen. A dark export
    uses its light twin's measurement.
  - JPEG: re-encodes with mozjpeg at q90, 4:4:4 chroma. The masters were
    exported near-lossless (about q100), and visitors only ever receive Next's
    q90 WebP of them, so this costs nothing visible.
  - PNG: lossless recompression only, and only kept when smaller. Almost every PNG here is a UI screenshot
    with a transparent edge, and a lossy encode softens small type. Where a
    lossless PNG still cannot meet its budget it goes in `exceptions` with a
    reason, so the check passes but a new oversized image still fails it.
  - A file is only rewritten when it is resized, or the result is at least
    10% smaller.
  - WebP and anything else are left alone.

  Budgets (source file size): hero images (the case-study hero rails, listed in
  `hero`) 250KB, thumbnails (rendered no wider than `thumbMaxRenderedPx`,
  read from app/components/image-sizes.ts) 70KB, everything else 200KB.

  The site caches optimised images for a year keyed on the path, so a master
  that changes must also change its filename (see docs/images.md).
*/
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public");
const config = JSON.parse(readFileSync(path.resolve("scripts/image-budgets.json"), "utf8"));
const WRITE = process.argv.includes("--write");
const CHECK = process.argv.includes("--check");
const RASTER = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const MIN_SAVING = 0.1;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// Widest rendered size per image, from the measured sizes map.
const sizesSource = readFileSync(path.resolve("app/components/image-sizes.ts"), "utf8");
const renderedMax = new Map();
for (const [, src, value] of sizesSource.matchAll(/^\s*"([^"]+)":\s*"([^"]+)"/gm)) {
  // Slot widths only: skip the breakpoints inside "(min-width: 1024px)".
  renderedMax.set(src, Math.max(...[...value.matchAll(/(?<!width:\s*)\b(\d+)px/g)].map((m) => Number(m[1]))));
}

// A dark export renders exactly where its light twin does, but the measuring
// run only sees the light one.
function rendered(key) {
  for (const k of [key, key.replace("_dark", "_light"), key.replace("_dark", "")]) {
    if (renderedMax.has(k)) return renderedMax.get(k);
  }
  return undefined;
}
function targetWidth(key, width) {
  const r = rendered(key);
  return Math.min(width, config.maxWidth, r === undefined ? Infinity : Math.ceil(r * 2));
}

const hero = new Set(config.hero);
function kindOf(key) {
  if (hero.has(key)) return "hero";
  const r = rendered(key);
  if (r !== undefined && r <= config.thumbMaxRenderedPx) return "thumb";
  return "content";
}

async function optimise(file, meta, width) {
  const ext = path.extname(file).toLowerCase();
  let pipeline = sharp(file);
  if (width < meta.width) pipeline = pipeline.resize({ width });
  if (ext === ".jpg" || ext === ".jpeg") {
    return pipeline.jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();
  }
  if (ext === ".png") {
    return pipeline.png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10, palette: false }).toBuffer();
  }
  return null;
}

const rows = [];
for (const file of walk(ROOT).filter((f) => RASTER.has(path.extname(f).toLowerCase())).sort()) {
  const key = "/" + path.relative(ROOT, file).split(path.sep).join("/");
  const meta = await sharp(file).metadata();
  const before = statSync(file).size;
  let after = before;
  let width = meta.width;
  let action = "keep";

  if (!CHECK) {
    const target = targetWidth(key, meta.width);
    const resized = target < meta.width;
    const out = await optimise(file, meta, target);
    // A resized JPEG is always kept. A resized PNG is kept only if it came out
    // smaller: resampling a flat-colour screenshot adds in-between shades that
    // compress far worse, and a lossless PNG can easily grow 3x that way.
    const isPng = path.extname(file).toLowerCase() === ".png";
    const smaller = out && out.length < before * (1 - MIN_SAVING);
    if (out && (isPng ? smaller : resized || smaller)) {
      after = out.length;
      width = target;
      action = resized ? `resize ${target}w` : "encode";
      if (WRITE) writeFileSync(file, out);
    }
  }

  const kind = kindOf(key);
  const budget = config.budgetsKB[kind] * 1024;
  const problems = [];
  if (width > config.maxWidth) problems.push(`wider than ${config.maxWidth}px`);
  if (after > budget) problems.push(`over ${kind} budget`);
  if (path.extname(file).toLowerCase() === ".gif") problems.push("GIF: use MP4/WebM video");
  const excepted = config.exceptions[key];
  rows.push({ key, kind, before, after, action, problems, excepted });
}

const kb = (n) => `${Math.round(n / 1024)}KB`;
const failing = rows.filter((r) => r.problems.length && !r.excepted);

if (!CHECK) {
  console.log(WRITE ? "Optimised:\n" : "Dry run (nothing written). Pass --write to apply.\n");
  for (const r of rows.filter((r) => r.action !== "keep")) {
    console.log(`  ${r.action.padEnd(13)} ${r.key}  ${kb(r.before)} -> ${kb(r.after)}`);
  }
  const total = (k) => rows.reduce((s, r) => s + r[k], 0);
  console.log(`\nTotal: ${(total("before") / 1048576).toFixed(1)}MB -> ${(total("after") / 1048576).toFixed(1)}MB`);
}

const excepted = rows.filter((r) => r.problems.length && r.excepted);
if (excepted.length) {
  console.log(`\n${excepted.length} over budget but listed in exceptions (scripts/image-budgets.json).`);
}
if (failing.length) {
  console.log(`\n${failing.length} image(s) break the budget:`);
  for (const r of failing) console.log(`  ${r.key}  ${kb(r.after)}  ${r.problems.join(", ")}`);
  if (CHECK) process.exit(1);
} else {
  console.log("\nAll images within budget.");
}
