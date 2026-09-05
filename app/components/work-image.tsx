import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { blurFor } from "./image-blur";
import { sizesFor } from "./image-sizes";

/*
  WebP quality for every photo on the site.

  Was 100. At the widths these cards actually render, q100 costs roughly 2x the
  bytes of q90 (FT3 at 1200px: 301KB vs 165KB) for a difference that does not
  survive a 1:1 pixel comparison — WebP's last few quality points are spent on
  detail the encoder is already keeping. 90 stays well clear of the range where
  small text in a UI screenshot starts to soften.

  Must be listed in `images.qualities` in next.config.ts; anything else 400s.
*/
export const DEFAULT_QUALITY = 90;

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
// (each image sized arbitrarily via `className`) and by <ImageCarousel>, which
// lives in ./image-carousel — it needs an IntersectionObserver to gate its
// loading, so it is a client component and is kept out of this module to stop
// every collage image on the site from becoming one too.
export function GlassImage({
  src,
  darkSrc,
  alt,
  className = "",
  quality = DEFAULT_QUALITY,
  mini = false,
  sizes,
  loading,
  fetchPriority,
  aspectRatio,
  aspectClassName,
  frameAspectRatio,
  frameAspectClassName,
  objectPosition,
  radiusClassName,
  frameStyle,
  ariaHidden = false,
  hairline = true,
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
  /**
   * Overrides the measured default. Leave it off unless this call site renders
   * the image at a width the measurement can't see (a layout only reachable
   * behind an interaction, say) — the generated map in ./image-sizes is built
   * from the real rendered box and stays correct as the layout moves.
   */
  sizes?: string;
  /**
   * Passed straight to next/image. Anything a transform can move outside the
   * viewport needs "eager": lazy loading keys off intersection, and a
   * translated card reports no intersection, so it never starts fetching and
   * shows up as an empty box when the motion brings it back.
   *
   * That is a reason to bypass the per-image gate, not to load at page load.
   * The marquees drive this prop from an IntersectionObserver on the rail's own
   * (un-translated) wrapper — lazy until the rail is a screen away, eager for
   * every card at once after that. See ./use-near-viewport.
   */
  loading?: "eager" | "lazy";
  /**
   * Hints how hard this image should compete for bandwidth. A page here can
   * carry 25+ photos, and a marquee rail releases all of its cards at once (see
   * `loading`), so without a hint the browser opens every connection in the
   * rail at the same weight and the cards actually on screen finish last. Set
   * "high" for the few above the fold and "low" for everything further down the
   * page; the browser then drains them roughly in reading order.
   */
  fetchPriority?: "high" | "low" | "auto";
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
  /**
   * Extra custom properties for the frame. Used by the home rows to hand each
   * card its per-breakpoint --card-scale-* factors; the motion that reads them
   * lives in globals.css under .image-marquee-card.
   */
  frameStyle?: CSSProperties;
  /** Hide from assistive tech (the marquee's duplicated set). */
  ariaHidden?: boolean;
  /**
   * Draws the card's 1px inset hairline. Off for the few exports that already
   * carry their own border or a card edge of their own, where the ring reads
   * as a second, doubled outline.
   */
  hairline?: boolean;
  /** Optional overlay content stacked on top of the image (e.g. a decorative icon). */
  children?: ReactNode;
}) {
  /*
    An explicit `sizes` wins; otherwise fall back to the measured width for
    this photo. Without either, next/image assumes sizes="100vw" and a 262px
    phone frame downloads the 3840px variant on a 2x display.
  */
  const lightSizes = sizes ?? sizesFor(src);
  const darkSizes = sizes ?? (darkSrc ? sizesFor(darkSrc) ?? lightSizes : undefined);

  return (
    <div
      className={`${FRAME_CLASS} ${radiusClassName ?? (mini ? MINI_RADIUS_CLASS : RADIUS_CLASS)}${frameAspectClassName ? ` ${frameAspectClassName}` : ""} ${className}`}
      aria-hidden={ariaHidden || undefined}
      style={
        !frameAspectClassName && frameAspectRatio
          ? { aspectRatio: frameAspectRatio, ...frameStyle }
          : frameStyle
      }
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
          sizes={lightSizes}
          loading={loading}
          fetchPriority={fetchPriority}
          placeholder={blurFor(src) ? "blur" : "empty"}
          blurDataURL={blurFor(src)}
          className={`object-cover${darkSrc ? " dark:hidden" : ""}`}
          style={objectPosition ? { objectPosition } : undefined}
        />
        {darkSrc && (
          <Image
            src={darkSrc}
            alt={alt}
            fill
            quality={quality}
            sizes={darkSizes}
            loading={loading}
            fetchPriority={fetchPriority}
            placeholder={blurFor(darkSrc) ? "blur" : "empty"}
            blurDataURL={blurFor(darkSrc)}
            className="hidden object-cover dark:block"
            style={objectPosition ? { objectPosition } : undefined}
          />
        )}
        {children}
      </div>
      {hairline && <div aria-hidden className={RING_CLASS} />}
    </div>
  );
}
