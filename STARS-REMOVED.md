# Twinkle stars — what is still off, and how to put it back

The stars are back on the About hero, the case-study titles and the footer
wordmark. **Only the home hero's stars remain removed** — deliberately: the hero
cat Lottie now carries its own yellow sparkles, so a star cluster there competes
with them rather than adding to them.

This file records the two home-hero placements so they can be restored without
re-deriving the offsets. Everything else described here is live in the code.

The Lottie sources are all present — `public/home/star1.json` … `star4.json`.

## Still removed

### 1. Home hero headline — 2 stars, `app/components/hero-text.tsx`

Wrapped the `<RevealWords as="h1">` in
`<TitleStars placement="hero" revealDelay={revealDelay} className="relative w-full">`.
It is now a plain `<div className="relative w-full">`.

`TitleStars` no longer has a `placement` prop — it carries one set of offsets,
sized for the About/case-study titles. Restoring the hero pair means adding the
prop back along with these offsets, which are larger because the home headline
runs at a much bigger fluid font size:

```jsx
<Star variant={1} className="absolute -top-[6px] left-[6px] w-9 md:-top-[6px] md:left-[8px] md:w-12 lg:-top-[6px] lg:left-[12px] lg:w-16" />
<Star variant={2} className="absolute -top-[26px] -left-[24px] w-9 md:-top-[34px] md:-left-[32px] md:w-12 lg:-top-[42px] lg:-left-[40px] lg:w-16" />
```

### 2. Home hero, third loose star — `app/page.tsx`

Sat inside the image row under the headline, deliberately **outside**
`<HeroClose>` (a parent animating opacity multiplies its children, and the cat's
late reveal would have held this star back past the word it points at).

```jsx
<SyncedStar
  variant={3}
  revealDelay={0}
  className="pointer-events-none absolute left-[3%] -top-[28px] w-8 md:left-[2%] md:-top-[36px] md:w-11 lg:left-[2%] lg:-top-[44px] lg:w-14"
/>
```

`app/components/synced-star.tsx` was **not** restored — this was its only
consumer. Recover it with
`git checkout 3c40466^ -- app/components/synced-star.tsx`. The hook it depends
on, `useNearestWordDelay` in `app/components/word-sync.ts`, is still there and
still unused, kept for exactly this.

## Live again (no action needed)

| Where | File | Wrapper |
| --- | --- | --- |
| About hero | `app/about/page.tsx` | `<TitleStars className="relative md:pt-xl lg:pt-2xl">` |
| Case-study titles — First Table, Covid Tracer, Basis | `app/components/case-study-hero.tsx` | `<TitleStars>` (shared by all three) |
| Footer wordmark | `app/components/site-footer.tsx` | absolute box on the wordmark cell, `bottom-full` |

The footer's `dt:pt-7xl` was sized around its cluster and was never retuned while
the stars were away, so it is correct again as-is.

## Shared reveal animation (TitleStars)

```
hidden:  { opacity: 0, y: 8, filter: "blur(16px)" }
visible: { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }
transition: { duration: 0.8, ease: EASE, delay }   // EASE from ./motion-timing
initial={reducedMotion ? false : "hidden"}
```

The footer cluster has no reveal — it is statically positioned inside the
wordmark's container-query cell.
