import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { IMAGE_RATIOS } from "./image-ratios";

export type WorkImageData = {
  src: string;
  alt: string;
  quality?: number;
  /**
   * Desktop width override for this one card, leaving every other card in the
   * row alone. `class` must be a literal Tailwind class — the JIT scanner
   * reads source text, so it cannot be built from `px` — and `px` feeds the
   * `sizes` hint so Next still picks a sensibly-sized source. Keep the two in
   * agreement.
   */
  lgWidth?: { class: string; px: number };
};
export type WorkImageSize = "md" | "lg";

// Figma "Image wrapper" (1144:7939) — one variant per platform, and
// "Image carousel" (1080:8017 md / 1080:9040 lg), the flat row both the home
// work section and the case-study heroes use.
//
// Tailwind classes are written as literal strings (not built from interpolated
// values) so the JIT scanner picks up every arbitrary-value token below.

// ─── Image wrapper ───────────────────────────────────────────────────────────

//   Platform   radius
//   mobile     radius-md  16px
//   tablet     radius-lg  20px
//   desktop    radius-xl  24px
//   mini       radius-xs   8px   (fixed at every breakpoint)
//
// The card has no inset frame, no border, no glass fill and no drop shadow any
// more — the photo runs to the card's own edge. What is left is bg-primary
// behind the photo (visible only through transparent PNGs) and a 1px hairline.
//
// Figma's export puts a 10px backdrop blur on the photo layer. It is a no-op
// here — the only thing behind the photo is a flat bg-primary fill, and
// blurring a flat colour returns the same colour — but it is NOT free: on a
// frame with a fractional height Chrome clamps the sampled backdrop and paints
// a light 1px sliver along the bottom edge. So the blur stays out.
//
// The hairline is an INSET RING on a separate overlay element, not a border and
// not a box-shadow on the frame itself: a border would occupy layout space and
// round on a different radius from the clipped photo, and an inset shadow on
// the frame paints beneath its own content, so the photo would cover it.
const FRAME_CLASS = "relative flex flex-col overflow-hidden bg-bg-primary";
const RADIUS_CLASS = "rounded-md md:rounded-lg lg:rounded-xl";
const MINI_RADIUS_CLASS = "rounded-xs";
const RING_CLASS =
  "pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--border-overlay)]";
const INNER_CLASS = "relative w-full flex-1 overflow-hidden rounded-[inherit]";

// The same card as GlassImage, but holding arbitrary content instead of a
// photo — used where the frame wraps something that isn't a next/image (e.g. the
// First Table §04 component recordings on a flat colour fill). Size it with
// `className` (width + aspect-*) exactly as you would a GlassImage.
export function GlassFrame({
  className = "",
  mini = false,
  innerClassName = "",
  radiusClassName,
  children,
}: {
  className?: string;
  /** Figma's Platform=mini variant — fixed 8px radius at every breakpoint. */
  mini?: boolean;
  /** Classes for the inner (clipped, rounded) box — background, layout, etc. */
  innerClassName?: string;
  /**
   * Replaces the default radius ramp for instances Figma overrides (e.g. the
   * §02 Biography cards, which run one step larger on mobile/tablet). Written
   * as a replacement rather than an override so the winner never depends on
   * Tailwind's utility ordering.
   */
  radiusClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`${FRAME_CLASS} ${radiusClassName ?? (mini ? MINI_RADIUS_CLASS : RADIUS_CLASS)} ${className}`}>
      <div className={`${INNER_CLASS} h-full ${innerClassName}`}>{children}</div>
      <div aria-hidden className={RING_CLASS} />
    </div>
  );
}

// A single card holding a photo. Used directly by case-study media collages
// (each image sized arbitrarily via `className`) and by ImageCarousel below.
export function GlassImage({
  src,
  darkSrc,
  alt,
  className = "",
  quality = 100,
  mini = false,
  sizes = "100vw",
  loading,
  aspectRatio,
  aspectClassName,
  frameAspectRatio,
  frameAspectClassName,
  objectPosition,
  radiusClassName,
  children,
}: {
  src: string;
  /**
   * Optional dark-theme export of the same shot. When set, both files are
   * rendered into the one frame and the `dark:` variant (see globals.css)
   * swaps them with the theme — the frame chrome, sizing and ratio stay
   * shared, so only the photo changes. Omit where only one export exists.
   */
  darkSrc?: string;
  alt: string;
  className?: string;
  quality?: number;
  /** Figma's Platform=mini variant — fixed 8px radius at every breakpoint. */
  mini?: boolean;
  sizes?: string;
  /**
   * Passed straight to next/image. Set "eager" for anything that a transform
   * can move outside the viewport — lazy loading keys off intersection, and a
   * translated card reports no intersection, so it never starts fetching and
   * shows up as an empty box when the motion brings it back.
   */
  loading?: "eager" | "lazy";
  /**
   * Source photo's true W/H ratio (e.g. "260/460"). When set, the inner
   * frame is sized to match the photo exactly instead of stretching to fill
   * the outer box — outer height then follows from padding + this ratio, so
   * object-cover never crops the image. Omit for the default "crop to fill
   * the given box" behaviour (carousels, collages designed around a crop).
   */
  aspectRatio?: string;
  /**
   * Responsive form of `aspectRatio` — Tailwind aspect-* classes rather than a
   * single inline value, for photos Figma sizes differently per breakpoint
   * (e.g. "aspect-[361/240] md:aspect-[904/828] lg:aspect-[814/500]"). Takes
   * precedence over `aspectRatio`; pass one or the other, not both.
   */
  aspectClassName?: string;
  /**
   * Same idea as `aspectRatio`, but applied to the outer (padded) frame
   * instead of the inner photo box. Use this — paired with a `flex-[ratio]`
   * className instead of a fixed width — for a "justified row" of images
   * that must all share one height with no cropping: flex-basis:0 +
   * flex-grow proportional to each image's own ratio, with the shared
   * aspect-ratio on every flex item, makes the browser resolve one common
   * row height and correct, undistorted widths for every image at once.
   * (Ignores a few px of ratio skew from the frame's own padding — visually
   * negligible, and the only way to keep the row's height-matching intact.)
   */
  frameAspectRatio?: string;
  /**
   * Responsive form of `frameAspectRatio`, for frames Figma sizes differently
   * per breakpoint. Takes precedence over `frameAspectRatio`.
   */
  frameAspectClassName?: string;
  /** object-position for the cropped photo (e.g. "left", "top"). Defaults to center. */
  objectPosition?: string;
  /** Replaces the default radius ramp — see GlassFrame's own `radiusClassName`. */
  radiusClassName?: string;
  /** Optional overlay content stacked on top of the image (e.g. a decorative icon). */
  children?: ReactNode;
}) {
  return (
    <div
      className={`${FRAME_CLASS} ${radiusClassName ?? (mini ? MINI_RADIUS_CLASS : RADIUS_CLASS)}${frameAspectClassName ? ` ${frameAspectClassName}` : ""} ${className}`}
      style={!frameAspectClassName && frameAspectRatio ? { aspectRatio: frameAspectRatio } : undefined}
    >
      <div
        className={`${INNER_CLASS}${aspectClassName ? ` ${aspectClassName}` : aspectRatio ? "" : " h-full"}`}
        style={!aspectClassName && aspectRatio ? { aspectRatio } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          fill
          quality={quality}
          sizes={sizes}
          loading={loading}
          className={`object-cover${darkSrc ? " dark:hidden" : ""}`}
          style={objectPosition ? { objectPosition } : undefined}
        />
        {darkSrc && (
          <Image
            src={darkSrc}
            alt={alt}
            fill
            quality={quality}
            sizes={sizes}
            loading={loading}
            className="hidden object-cover dark:block"
            style={objectPosition ? { objectPosition } : undefined}
          />
        )}
        {children}
      </div>
      <div aria-hidden className={RING_CLASS} />
    </div>
  );
}

// ─── Image carousel ──────────────────────────────────────────────────────────

// A flat, centred row of fixed-size cards — no tilt, no overlap. The row is
// wider than the page at every breakpoint (3 × 660 + 2 × 24 = 2028 against a
// 1648 desktop content width), so `justify-center` lets it bleed symmetrically
// past the page gutter. <body> carries overflow-x: clip, so the bleed never
// produces a horizontal scrollbar.
//
//   breakpoint   card         gap
//   mobile       380 × 260    spacing-sm  12px
//   tablet       480 × 340    spacing-md  16px
//   desktop      400 tall     spacing-xl  24px   (both sizes)
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

export function ImageCarousel({
  images,
  size = "md",
  marquee = false,
  reverse = false,
  speedScale,
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
  className?: string;
}) {
  const card = (image: WorkImageData, key: string, gap: boolean) => {
    // A known intrinsic ratio switches the card from a fixed
    // box to a fixed height. The per-image lgWidth override existed to undo a
    // bad crop, so it is skipped when the real ratio is available.
    const ratio = IMAGE_RATIOS[image.src];
    const margin = gap ? " mr-sm md:mr-md lg:mr-xl" : "";
    if (ratio) {
      return (
        <GlassImage
          key={key}
          src={image.src}
          alt={image.alt}
          quality={image.quality}
          frameAspectRatio={ratio}
          sizes="(min-width: 1024px) 720px, (min-width: 768px) 560px, 420px"
          loading="eager"
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
        loading="eager"
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
    const GAP = 24; // spacing-xl at lg
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
      <div className={`flex items-center justify-center gap-sm md:gap-md lg:gap-xl ${className}`}>
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
    <div className={`w-[calc(100%+var(--page-gutter)*2)] overflow-hidden ${className}`}>
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
