"use client";

import type { CSSProperties } from "react";
import { GlassImage, type WorkImageData, type WorkImageSize } from "./work-image";
import { IMAGE_RATIOS } from "./image-ratios";
import { useNearViewport } from "./use-near-viewport";

// ─── Image carousel ──────────────────────────────────────────────────────────

// A flat, centred row of fixed-size cards — no tilt, no overlap. The row is
// wider than the page at every breakpoint (3 × 660 + 2 × 24 = 2028 against a
// 1648 desktop content width), so `justify-center` lets it bleed symmetrically
// past the page gutter. <body> carries overflow-x: clip, so the bleed never
// produces a horizontal scrollbar.
//
//   breakpoint   card         gap
//   mobile       380 × 260    spacing-xs   8px
//   tablet       480 × 340    spacing-sm  12px
//   desktop      400 tall     spacing-lg  20px   (both sizes)
//
// The gaps were tightened one step (12/16/24) to match the case-study collages
// and the About artwork strip. Marquee speed is unaffected: px/s works out to
// REFERENCE_SET / --image-marquee-duration, which neither the gap nor a row's
// own width appears in — see `naturalScale` below.
//
// Cards are sized by HEIGHT only — the row shares one height per breakpoint and
// each card's width falls out of its photo's own ratio (IMAGE_RATIOS), so
// nothing is cropped and a rail carries portrait and landscape shapes together.
// `size` no longer changes anything: the case-study heroes used to run 500 tall
// on desktop and now match the home rows at 400.
const CARD_CLASS = {
  md: "h-[260px] w-[380px] md:h-[340px] md:w-[480px] lg:h-[400px]",
  lg: "h-[260px] w-[380px] md:h-[340px] md:w-[480px] lg:h-[400px]",
} as const;

// Height-only card: the row shares one height at every
// breakpoint and each card's width falls out of its photo's own ratio, so
// nothing is cropped and the rail carries a mix of portrait and landscape
// shapes the way a contact sheet does. Paired with frameAspectRatio on
// <GlassImage>, which is the existing mechanism for "size the frame to the
// photo" (see its docs above) rather than a new one.
const CARD_HEIGHT_CLASS = {
  md: "h-[260px] w-auto md:h-[340px] lg:h-[400px]",
  lg: "h-[260px] w-auto md:h-[340px] lg:h-[400px]",
} as const;

// Desktop width lives apart from CARD_CLASS so a per-image override REPLACES
// it instead of layering on top of it. Two lg:w-* utilities on one element
// have equal specificity, and which one wins is decided by their order in the
// generated stylesheet, not by their order in the class attribute — so
// appending an override would work or not depending on how Tailwind happened
// to sort the two arbitrary values.
const CARD_LG_WIDTH = "lg:w-[660px]";

// Card heights per breakpoint, matching CARD_HEIGHT_CLASS above.
const CARD_HEIGHTS = { lg: 400, md: 340, base: 260 } as const;

/*
  `sizes` for a height-sized card.

  These cards are sized by HEIGHT and take their width from the photo's own
  ratio, so a single hard-coded `sizes` has to guess — and the old guess (720px
  on desktop) overstated every card. A 1856x1316 photo in the 400px-tall row is
  564px wide, and on a 2x screen that is 1128 device px: Next rounds up to its
  1200 bucket. Claiming 720px instead asks for 1440 and lands on 1920 — a file
  ~3.5x larger than the slot, for no visible gain.

  Deriving the width from the ratio the card is already using removes the guess
  entirely, and stays correct when imagery is swapped.
*/
function ratioSizes(ratio: string): string {
  const [w, h] = ratio.split("/").map(Number);
  if (!w || !h) return "(min-width: 1024px) 720px, (min-width: 768px) 560px, 420px";
  const at = (height: number) => Math.ceil((height * w) / h);
  return `(min-width: 1024px) ${at(CARD_HEIGHTS.lg)}px, (min-width: 768px) ${at(CARD_HEIGHTS.md)}px, ${at(CARD_HEIGHTS.base)}px`;
}

export function ImageCarousel({
  images,
  size = "md",
  marquee = false,
  reverse = false,
  speedScale,
  fetchPriority,
  eager = false,
  hoverScale = false,
  className = "",
}: {
  images: WorkImageData[];
  size?: WorkImageSize;
  /**
   * Loop the row right-to-left forever instead of standing still. The images
   * are rendered twice back-to-back and the track is translated by exactly
   * -50%, which lands the duplicate where the original started — so the seam
   * is invisible and the loop never resets visibly.
   *
   * The gap is a per-card margin-right rather than flex `gap`, because `gap`
   * puts n-1 gaps in a set of n: half of a doubled track would then be
   * `3w + 2.5g` while one set plus its trailing gap is `3w + 3g`, and the loop
   * would jump by half a gap every cycle.
   */
  marquee?: boolean;
  /** Run the loop left-to-right instead. Only meaningful with `marquee`. */
  reverse?: boolean;
  /**
   * Multiplies the loop duration. One "set" of cards passes per cycle, so a row
   * with fewer cards covers less ground in the same time; pass
   * `images.length / 5` (five being the widest home row) to hold every marquee
   * at the same px/s. Defaults to 1 — the home rows' own timing, untouched.
   */
  speedScale?: number;
  /**
   * Bandwidth hint for every card in this row — see <GlassImage>. The rows
   * have to load eagerly (a marquee card translated off-screen never reports
   * an intersection, so lazy loading would leave it blank when the loop brings
   * it back), which means the only way to stop a third-row rail from competing
   * with the one on screen is to rank them. Pass "high" for the first row on a
   * page and "low" for the rest.
   */
  fetchPriority?: "high" | "low" | "auto";
  /**
   * Load this rail's cards immediately instead of waiting for it to approach
   * the viewport. Set it on a rail that is above the fold — a case-study hero,
   * where the cards are the LCP and a round trip spent waiting on an
   * IntersectionObserver callback is a round trip lost. Every rail further down
   * a page should leave it off; see `useNearViewport` for why the gate exists.
   */
  eager?: boolean;
  /**
   * Zoom each photo on hover — see <GlassImage>. Set by the home page's work
   * rows only; the case-study hero rails leave it off, so the effect stays
   * where it was asked for.
   */
  hoverScale?: boolean;
  className?: string;
}) {
  /*
    The rail's own load gate. Cards cannot use native lazy loading — a card
    translated out of the clipped track never reports an intersection — so the
    whole rail switches from lazy to eager together, keyed off the wrapper,
    which is an ordinary un-translated block. Until then the cards stay `lazy`
    and the preload scanner leaves them alone, which is what keeps three
    below-the-fold rails off the wire while the top of the page is painting.
  */
  const [railRef, railNear] = useNearViewport<HTMLDivElement>();
  const loading = eager || railNear ? "eager" : "lazy";

  const card = (image: WorkImageData, key: string, gap: boolean) => {
    // A known intrinsic ratio switches the card from a fixed
    // box to a fixed height. The per-image lgWidth override existed to undo a
    // bad crop, so it is skipped when the real ratio is available.
    const ratio = IMAGE_RATIOS[image.src];
    const margin = gap ? " mr-xs md:mr-sm lg:mr-lg" : "";
    if (ratio) {
      return (
        <GlassImage
          key={key}
          src={image.src}
          alt={image.alt}
          quality={image.quality}
          frameAspectRatio={ratio}
          sizes={ratioSizes(ratio)}
          hoverScale={hoverScale}
          loading={loading}
          fetchPriority={fetchPriority}
          className={`shrink-0 ${CARD_HEIGHT_CLASS[size]}${margin}`}
        />
      );
    }
    return (
      <GlassImage
        key={key}
        src={image.src}
        alt={image.alt}
        quality={image.quality}
        sizes={`(min-width: 1024px) ${image.lgWidth?.px ?? 660}px, (min-width: 768px) 480px, 380px`}
        hoverScale={hoverScale}
        loading={loading}
        fetchPriority={fetchPriority}
        className={`shrink-0 ${CARD_CLASS[size]} ${image.lgWidth?.class ?? CARD_LG_WIDTH}${margin}`}
      />
    );
  };

  // Native-ratio cards make a set narrower than the old
  // 660px-each set, and the marquee duration covers exactly one set — so
  // without this every row would read slower than it does today, and rows
  // would drift apart from each other again. Scale the duration by the set's
  // real width against the reference the base duration was measured on (the
  // home page's five-card desktop row, 3420px), which holds every rail at the
  // same px/s. An explicitly passed speedScale still wins.
  const naturalScale = (() => {
    if (speedScale !== undefined) return undefined;
    const CARD_H = 400;
    const GAP = 20; // spacing-lg at lg — keep in step with `margin` above
    const REFERENCE_SET = 3420;
    let total = 0;
    for (const image of images) {
      const ratio = IMAGE_RATIOS[image.src];
      if (!ratio) return undefined; // mixed row: leave the timing alone
      const [w, h] = ratio.split("/").map(Number);
      if (!w || !h) return undefined;
      total += (CARD_H * w) / h + GAP;
    }
    return total / REFERENCE_SET;
  })();
  const scale = speedScale ?? naturalScale;

  if (!marquee) {
    return (
      <div ref={railRef} className={`flex items-center justify-center gap-xs md:gap-sm lg:gap-lg ${className}`}>
        {images.map((image) => card(image, image.src, false))}
      </div>
    );
  }

  return (
    // Bleed out to the viewport edge by growing past the page's own gutter on
    // both sides. A negative margin does NOT work here: the parent is a
    // `flex-col items-center` column, so the wrapper is a non-stretched flex
    // item whose used width is whatever `w-*` says — negative margins would
    // just shift the box left instead of widening it. Sizing it to
    // `100% + 2 × gutter` and letting `items-center` centre it lands the edges
    // exactly on the viewport, which is also where overflow-hidden then clips.
    <div ref={railRef} className={`w-[calc(100%+var(--page-gutter)*2)] overflow-hidden ${className}`}>
      <div
        className={`image-marquee-track flex w-max items-center${reverse ? " image-marquee-track--reverse" : ""}`}
        style={scale ? ({ "--image-marquee-scale": scale } as CSSProperties) : undefined}
      >
        {images.map((image) => card(image, `a-${image.src}`, true))}
        {/* Duplicate set — decorative only, so it stays out of the a11y tree. */}
        <div aria-hidden className="flex w-max items-center">
          {images.map((image) => card(image, `b-${image.src}`, true))}
        </div>
      </div>
    </div>
  );
}
