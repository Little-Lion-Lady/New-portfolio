# Twinkle stars — removal map

Branch `no-stars` removes every star Lottie from the site. This file records
exactly where each one sat, so the whole cluster set can be put back without
re-deriving any of the offsets.

The Lottie source files are **kept** — `public/home/star1.json` … `star4.json`
are untouched. Only the components that rendered them are gone.

Fastest full restore: `git revert` the removal commit — verified byte-identical
under `app/` and `public/`. Note it deletes this file too, so copy it out first
if you want to keep the map. To restore piecemeal instead, take the three deleted
components back with `git checkout <base> -- <files>` and re-place them using the
Positions section below; that path is verified too.

Both paths were tested against the pre-removal commit: code-identical, clean
build, and all five clusters render in place.

## Deleted files

| File | What it was |
| --- | --- |
| `app/components/star.tsx` | The Lottie wrapper. Picked `star1–4.json` by `variant`, remapped `#000000`/`#1A171C` → `#FFFFFF` and `#FFFFFF` → `#3744FF` in dark mode, `loop`, `autoplay` off under reduced motion, `aspectRatio: 1/1`. |
| `app/components/title-stars.tsx` | Two-star cluster pinned to the top-right corner of the **last word on line 1** of a heading. Measured the word's rect (re-measured on `document.fonts.ready` + `ResizeObserver`), read that word's `data-reveal-delay` (fallback `index * data-word-stagger`) so each star arrived with its word. |
| `app/components/synced-star.tsx` | Single loose star that timed itself to the nearest `RevealWords` word via `useNearestWordDelay`, and applied that hook's `clearance` as `marginTop`. |

`useNearestWordDelay` in `app/components/word-sync.ts` is now unused but was
**left in place** — `useHeadlineHandoff` next to it is still used by `hero-close.tsx`.
`Star` was also dropped from the `next/dynamic` re-exports in `app/components/dynamic-visuals.tsx`.

## Shared reveal animation (both wrappers)

```
hidden:  { opacity: 0, y: 8, filter: "blur(16px)" }
visible: { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }
transition: { duration: 0.8, ease: EASE, delay }   // EASE from ./motion-timing
initial={reducedMotion ? false : "hidden"}
```

## Positions

### 1. Home hero headline — 2 stars, `app/components/hero-text.tsx:146`

Wrapper `<TitleStars placement="hero" revealDelay={revealDelay} className="relative w-full">`
around the `<RevealWords as="h1">`. Now a plain `<div className="relative w-full">`.

TitleStars pinned the pair inside a positioned box at the measured corner, then
offset each star from it:

```jsx
<m.div className="pointer-events-none absolute" style={{ top: anchor.top, left: anchor.left }}>
  <Star variant={1} className="absolute -top-[6px] left-[6px] w-9 md:-top-[6px] md:left-[8px] md:w-12 lg:-top-[6px] lg:left-[12px] lg:w-16" />
  <Star variant={2} className="absolute -top-[26px] -left-[24px] w-9 md:-top-[34px] md:-left-[32px] md:w-12 lg:-top-[42px] lg:-left-[40px] lg:w-16" />
</m.div>
```

### 2. Home hero, third loose star — `app/page.tsx:55`

Sat inside the image row under the headline, deliberately **outside** `<HeroClose>`
(a parent animating opacity multiplies its children, and the cat's late reveal
would have held this star back past the word it points at).

```jsx
<SyncedStar
  variant={3}
  revealDelay={0}
  className="pointer-events-none absolute left-[3%] -top-[28px] w-8 md:left-[2%] md:-top-[36px] md:w-11 lg:left-[2%] lg:-top-[44px] lg:w-14"
/>
```

### 3. About hero — 2 stars, `app/about/page.tsx:68`

Wrapper `<TitleStars className="relative md:pt-xl lg:pt-2xl">` around the
"Who am I?" heading. Now a plain `<div>` with the same classes — the
`md:pt-xl lg:pt-2xl` is hero spacing, not star clearance, so it stays.

### 4. Case-study titles — 2 stars each, `app/components/case-study-hero.tsx:138`

Wrapper `<TitleStars>` (default `className="relative"`) around the two-line
`<h1 className="case-hero-title">`. Now `<div className="relative">`.

Both #3 and #4 used the `title` placement offsets, in the same positioned box:

```jsx
<Star variant={1} className="absolute -top-[8px] left-[14px] w-9 md:-top-[4px] md:left-[28px] md:w-12 lg:-top-[4px] lg:left-[36px] lg:w-16" />
<Star variant={2} className="absolute -top-[22px] -left-[6px] w-9 md:-top-[32px] md:-left-[12px] md:w-12 lg:-top-[40px] lg:-left-[16px] lg:w-16" />
```

### 5. Footer wordmark — 2 stars, `app/components/site-footer.tsx:90`

Hung off the top edge of the "get in touch" wordmark cell (`bottom-full`), not
the footer's. No reveal animation — statically positioned inside the wordmark's
container-query cell.

```jsx
<div className="pointer-events-none absolute bottom-full right-0 h-[min(54px,15.7434cqw)] w-[min(54px,15.7434cqw)] -translate-x-[8%] translate-y-[8%] md:h-[78px] md:w-[94px] lg:h-[104px] lg:w-[114px]">
  <Star
    variant={4}
    className="absolute right-[48.148%] top-[11.111%] w-[51.852%] md:right-[48.936%] md:top-0 md:w-[51.064%] lg:!right-[43.86%] lg:!w-[56.14%]"
  />
  <Star
    variant={4}
    className="absolute right-0 top-[48.148%] w-[51.852%] md:top-[38.462%] md:w-[51.064%] lg:!top-[38.462%] lg:!w-[56.14%]"
  />
</div>
```

Box sizing notes worth keeping if this comes back: the box needs explicit
dimensions for `bottom-full` to have a height to work from (the stars inside are
absolute, so it has no size of its own); each size is the lower-left star's
offset plus a star's width; `min(54px, 15.7434cqw)` pins the switchover at the
343px cell of a 375 viewport so only narrower widths scale; every inner offset is
a percentage of the box so the cluster shrinks as a whole.

**Footer padding was left as-is.** `dt:pt-7xl` on the `<footer>` grid was sized
partly to give this cluster somewhere to live (104px tall, nudged 8px down, inside
96px of padding with nothing to spare). It is now larger than the stars-free layout
strictly needs — tighten it if you want, but that is a separate visual decision and
undoing it is what would break a restore.
