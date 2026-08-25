import Image from "next/image";
import type { ReactNode } from "react";

export type WorkImageData = { src: string; alt: string; quality?: number };
export type WorkImageSize = "md" | "lg";

// Figma "ImageCarousel" component (node 1080:8018) — fixed card dimensions per
// breakpoint × image count × size, not a flexible/equal-division layout.
// Tailwind classes are written as literal strings (not built from interpolated
// values) so the JIT scanner picks up every arbitrary-value token below.

function getSizeClass(quantity: 3 | 4, size: WorkImageSize) {
  if (quantity === 4) {
    return size === "lg"
      ? "size-[220px] md:h-[380px] md:w-[320px] lg:size-[440px]"
      : "size-[220px] md:h-[380px] md:w-[320px] lg:h-[400px] lg:w-[420px]";
  }
  return size === "lg"
    ? "size-[250px] md:size-[370px] lg:h-[500px] lg:w-[560px]"
    : "size-[250px] md:size-[370px] lg:h-[400px] lg:w-[560px]";
}

// Card 1 is always tilted +2deg; cards 2–3 tilt tighter on tablet/mobile than
// desktop when there are only 3 images; card 4 (4-image items only) is -3deg.
function getRotateClass(quantity: 3 | 4, index: number) {
  if (quantity === 4) {
    return ["rotate-2", "-rotate-2", "rotate-3", "-rotate-3"][index];
  }
  return ["rotate-2", "-rotate-3 lg:-rotate-2", "rotate-3 lg:rotate-2"][index];
}

// Overlap between cards — 4-image items overlap -80px at every breakpoint;
// 3-image items tighten the overlap on mobile, loosen slightly on desktop.
function getMarginClass(quantity: 3 | 4) {
  return quantity === 4 ? "-mr-[80px]" : "-mr-[40px] md:-mr-[80px] lg:-mr-[72px]";
}

// Figma "Image wrapper" (1144:7939), one variant per platform. Frame thickness
// is the component's padding; the outer/inner radii are a fixed pair per
// variant (inner is always one step down so the corners stay concentric).
//
//   Platform      thickness            radius (outer / inner)
//   mobile        spacing-3xs   4px    radius-sm 12 / radius-xs  8
//   tablet        spacing-2xs   6px    radius-md 16 / radius-sm 12
//   desktop       spacing-2xs   6px    radius-md 16 / radius-sm 12
//   mini          spacing-3xs   4px    radius-sm 12 / radius-xs  8
//
// Mobile and mini now resolve to the same 4 / 12 / 8 numbers; they stay
// separate because `mini` applies at every breakpoint, not just below md.
const PADDING_CLASS = "p-3xs md:p-2xs";
const RADIUS_CLASS = "rounded-sm md:rounded-md";
const INNER_RADIUS_CLASS = "rounded-xs md:rounded-sm";

// Platform=mini — the compact frame used by the case-study footer nav.
const MINI_PADDING_CLASS = "p-3xs";
const MINI_RADIUS_CLASS = "rounded-sm";
const MINI_INNER_RADIUS_CLASS = "rounded-xs";

// The frosted card chrome shared by GlassImage and GlassFrame. Radius is
// applied separately so the mini variant can swap the whole pair at once.
// Shadow is Figma's 0 2px 10px shadow-02 — every Image wrapper variant
// (desktop and mini alike) uses the same 10px blur.
const FRAME_CLASS =
  "flex flex-col border border-border-overlay bg-utility-inverses-glass backdrop-blur-[10px] shadow-[0_2px_10px_var(--shadows-shadow-02)]";

// The same glass card as GlassImage, but holding arbitrary content instead of a
// photo — used where the frame wraps something that isn't a next/image (e.g. the
// First Table §04 component recordings on a flat colour fill). Size it with
// `className` (width + aspect-*) exactly as you would a GlassImage.
export function GlassFrame({
  className = "",
  mini = false,
  padding,
  innerClassName = "",
  children,
}: {
  className?: string;
  /** Figma's Platform=mini variant — 4px frame, 12/8 radii. */
  mini?: boolean;
  /** Override the variant's frame thickness. Radius still follows `mini`. */
  padding?: string;
  /** Classes for the inner (clipped, rounded) box — background, layout, etc. */
  innerClassName?: string;
  children?: ReactNode;
}) {
  const pad = padding ?? (mini ? MINI_PADDING_CLASS : PADDING_CLASS);
  const radius = mini ? MINI_RADIUS_CLASS : RADIUS_CLASS;
  const innerRadius = mini ? MINI_INNER_RADIUS_CLASS : INNER_RADIUS_CLASS;
  return (
    <div className={`${FRAME_CLASS} ${radius} ${pad} ${className}`}>
      <div className={`relative h-full w-full flex-1 overflow-hidden ${innerRadius} ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}

// A single flat glass-frame image — same treatment as WorkImage's card, but no
// rotation/overlap math. Used for case-study media collages where each image
// gets its own arbitrary size via `className`.
export function GlassImage({
  src,
  darkSrc,
  alt,
  className = "",
  quality = 100,
  mini = false,
  padding,
  sizes = "100vw",
  aspectRatio,
  frameAspectRatio,
  objectPosition,
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
  /** Figma's Platform=mini variant — 4px frame, 12/8 radii. */
  mini?: boolean;
  /** Override the variant's frame thickness. Radius still follows `mini`. */
  padding?: string;
  sizes?: string;
  /**
   * Source photo's true W/H ratio (e.g. "260/460"). When set, the inner
   * frame is sized to match the photo exactly instead of stretching to fill
   * the outer box — outer height then follows from padding + this ratio, so
   * object-cover never crops the image. Omit for the default "crop to fill
   * the given box" behaviour (carousels, collages designed around a crop).
   */
  aspectRatio?: string;
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
  /** object-position for the cropped photo (e.g. "left", "top"). Defaults to center. */
  objectPosition?: string;
  /** Optional overlay content stacked on top of the image (e.g. a decorative icon). */
  children?: ReactNode;
}) {
  const pad = padding ?? (mini ? MINI_PADDING_CLASS : PADDING_CLASS);
  const radius = mini ? MINI_RADIUS_CLASS : RADIUS_CLASS;
  const innerRadius = mini ? MINI_INNER_RADIUS_CLASS : INNER_RADIUS_CLASS;
  return (
    <div
      className={`${FRAME_CLASS} ${radius} ${pad} ${className}`}
      style={frameAspectRatio ? { aspectRatio: frameAspectRatio } : undefined}
    >
      <div
        className={`${aspectRatio ? "relative w-full overflow-hidden" : "relative h-full w-full flex-1 overflow-hidden"} ${innerRadius}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          fill
          quality={quality}
          sizes={sizes}
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
            className="hidden object-cover dark:block"
            style={objectPosition ? { objectPosition } : undefined}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export function WorkImage({
  src,
  alt,
  index,
  total,
  size = "md",
  tilt = true,
  quality = 100,
}: {
  src: string;
  alt: string;
  index: number;
  total: 3 | 4;
  size?: WorkImageSize;
  tilt?: boolean;
  quality?: number;
}) {
  const isLast = index === total - 1;
  return (
    <div className={`shrink-0 ${isLast ? "" : getMarginClass(total)}`}>
      <div className={`${getSizeClass(total, size)} ${tilt ? getRotateClass(total, index) : ""}`}>
        <GlassImage
          src={src}
          alt={alt}
          quality={quality}
          sizes="(min-width: 1024px) 560px, (min-width: 768px) 370px, 250px"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
