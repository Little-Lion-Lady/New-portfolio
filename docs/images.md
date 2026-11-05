# Adding images

How images work on this site, and the checklist for adding or replacing one.
CI enforces the parts it can (`.github/workflows/lighthouse.yml`).

## Export

- **Size:** export at **2x the widest the image ever renders**, never wider
  than 2560px. A case-study card 400px tall needs a file about 800px tall; a
  full-width board (about 1374px wide on desktop) needs about 2750px, capped
  at 2560. Anything bigger is never shown to anyone.
- **Format:** JPEG for photos and anything without transparency. PNG only when
  the image needs transparency (most UI screenshots here do, for their rounded
  corners). Next serves WebP to visitors either way.
- **Quality:** don't sweat it. Run `npm run images:optimize` (below), which
  re-encodes JPEGs at q90 and caps the width.
- **Video:** MP4 (H.264) plus a WebM and a poster frame beside it, same name:

  ```bash
  ffmpeg -i name.mp4 -frames:v 1 -q:v 3 name-poster.jpg
  ffmpeg -i name.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 name.webm
  ```

  `LoopingVideo` picks both up from the MP4's path. Never use GIFs.

## Naming

`[project]-[screen-or-subject]-[context].[ext]`, lowercase, hyphens only.

- `first-table-shipped-map-light.png`, `basis-affinity-map-workshop.png`
- Theme pairs end in `-light` / `-dark`.
- Name it for what it **shows**, not where it sits on the page.
- **A changed image gets a new name.** Optimised images are cached for a year,
  keyed on the path, so overwriting a file in place keeps serving the old one.

## Alt text

`[what it is] + [what it shows that matters to the story]`, written for someone
following the case study without seeing it.

- Good: "A/B test of permission onboarding: separate notification and tracking
  screens (A) against one combined screen (B)"
- Not: "First Table usability research session" (says what, not what it shows)
- No "image of" / "screenshot of". Keep it under 125 characters. No em dashes.
- If a chart carries the point, give the point, not every number.
- Purely decorative: `alt=""`. The marquee rails already hide their duplicate
  set from screen readers.
- Two images on one page should never share an alt.

## Using it in code

- Use `GlassImage` (or `next/image`). A raw `<img>` fails lint, and so does a
  missing `alt`.
- Don't hand-write `sizes`. `GlassImage` reads the measured value from
  `app/components/image-sizes.ts`; pass `sizes` only for a layout the measuring
  run can't see (for example a breakpoint where the image is hidden).
- Carousel images also need their ratio in `app/components/image-ratios.ts`
  (`"width/height"` of the file).

## When an image should load eagerly

Almost never. Images are lazy by default and that is right for everything
below the fold.

- **One** image per page gets `fetchPriority="high"`: the one most likely to be
  the LCP. On a case study that is the first hero card (`priorityFirstOnly` on
  `ImageCarousel` does this). The home page has no image above the fold, so it
  has none.
- Marquee rails load eagerly once they are near the viewport. That is
  deliberate: a card translated out of view never fires lazy loading. Don't
  "fix" it.
- Never use `priority`; it is deprecated in Next 16.

## After adding or replacing images

```bash
npm run images:optimize            # dry run: what would change
npm run images:optimize -- --write # apply
npm run images:blur                # blur placeholders
npm run build && PORT=3010 npm run start   # in another shell, then:
npm run images:sizes               # measured sizes
npm run images:check               # budgets, also run in CI
```

If a case study's lead image changes, update `app/route-images.ts` (sitemap and
JSON-LD) and re-render the link-preview cards with `npm run og:cards`.

## Budgets

Source file size, checked by `npm run images:check`:

| Kind | Budget |
|---|---|
| Hero (listed in `scripts/image-budgets.json`) | 250KB |
| Thumbnail (rendered 300px or narrower) | 70KB |
| Everything else | 200KB |

Some images can't meet these without visible loss (textured artwork, UI
screenshots with transparency). They are listed under `exceptions` in
`scripts/image-budgets.json` with a reason. Add to that list only after the
optimiser has had its go.

## Lighthouse CI

Runs on every pull request against the home page and `/work/first-table`,
loading each with `?nointro` so it measures the page rather than the
first-visit loader.

- The case study must pass: LCP under 2.5s, CLS under 0.1, and the
  responsive-images, modern-formats and offscreen-images audits. Its LCP sits
  around 2.3s, so expect the occasional borderline run on a slow CI machine.
- The home page reports **warnings only**. Every above-the-fold element there
  starts at opacity 0 (the headline reveal), and Chrome records no LCP for
  content first painted invisible, so Lighthouse cannot measure it. The same
  is why CI uses real ("devtools") throttling: with simulated throttling the
  case study shows no LCP either. Changing the reveals to start visible would
  fix both, and is a motion decision, not an image one.
