/*
  Regenerates app/components/animations.ts from the Lottie sources.

      npm run animations

  The markup is checked in as a TypeScript module rather than read from disk
  at runtime. A Server Component COULD readFileSync these at build time, but
  that leans on Next's file tracing to carry the .svg into the deployed
  bundle; a module import is something the bundler cannot get wrong, keeps
  the build reproducible, and makes the generated output reviewable in a diff.
*/
import fs from "node:fs";
import path from "node:path";
import { convert } from "./lottie-to-svg.mjs";

/*
  The After Effects exports these are generated FROM. They live here, tracked,
  rather than in public/ (where they were being served to visitors who never
  needed them) or design-sources/ (which is gitignored, so a fresh clone could
  not regenerate). A checked-in generated file is only trustworthy if its input
  is checked in beside it.
*/
const SRC = "scripts/lottie-src";
const OUT = "app/components/animations.ts";

const items = [
  { key: "heroCat", file: "hero-cat.json", name: "hero-cat" },
  { key: "aboutCat", file: "about-cat.json", name: "about-cat" },
  { key: "meCat", file: "me-cat.json", name: "me-cat" },
  { key: "star1", file: "star1.json", name: "star1" },
  { key: "star2", file: "star2.json", name: "star2" },
  { key: "star3", file: "star3.json", name: "star3" },
  { key: "star4", file: "star4.json", name: "star4" },
];

const parts = [];
let failed = false;
for (const { key, file, name } of items) {
  const doc = JSON.parse(fs.readFileSync(path.join(SRC, file), "utf8"));
  const { svg, unsupported, colours } = convert(doc, { name });
  if (unsupported.length) {
    console.error(`  ${file}: UNSUPPORTED ${unsupported.join(", ")}`);
    failed = true;
  }
  console.log(`  ${name.padEnd(10)} ${(Buffer.byteLength(svg) / 1024).toFixed(1)}KB  colours: ${colours.join(" ")}`);
  parts.push(`export const ${key} = ${JSON.stringify(svg)};`);
}
if (failed) process.exit(1);

fs.writeFileSync(
  OUT,
  `/*\n  GENERATED FILE — do not edit by hand.\n\n  Run \`npm run animations\` after changing anything in public/home/*.json.\n  Produced by scripts/generate-animations.mjs via scripts/lottie-to-svg.mjs;\n  the reasoning for the conversion lives in that file's header.\n\n  Each export is a complete, self-animating SVG. Colours are exposed as\n  --lc-RRGGBB custom properties so the dark theme can re-map them from\n  globals.css instead of rewriting animation data at runtime.\n*/\n\n` +
    parts.join("\n\n") +
    "\n\nexport const stars = [star1, star2, star3, star4] as const;\n",
);
console.log(`wrote ${OUT}`);
