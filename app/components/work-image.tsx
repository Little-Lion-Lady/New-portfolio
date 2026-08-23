import Image from "next/image";
import type { ReactNode } from "react";
import { TiltIn } from "./tilt-in";

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

// Reveal start offset for card `index` of `total` — full swing on every card,
// split at the cluster's midpoint. Cards in the left half start clockwise of
// their resting tilt (positive) so they turn anti-clockwise into place; cards
// in the right half start anti-clockwise and turn clockwise. With an odd
// count the middle card goes with the left half.
function getTiltOffset(index: number, total: number, max = 8) {
  return index < total / 2 ? max : -max;
}

// Glass-frame padding scales with platform: mobile 6px, tablet 8px, desktop 12px.
const PADDING_CLASS = "p-2xs md:p-xs lg:p-sm";

// The frosted card chrome shared by GlassImage and GlassFrame.
const FRAME_CLASS =
  "flex flex-col rounded-sm border border-border-overlay bg-utility-inverses-glass backdrop-blur-[10px] shadow-[0_2px_10px_var(--shadows-shadow-02)]";

// The same glass card as GlassImage, but holding arbitrary content instead of a
// photo — used where the frame wraps something that isn't a next/image (e.g. the
// First Table §04 component recordings on a flat colour fill). Size it with
// `className` (width + aspect-*) exactly as you would a GlassImage.
export function GlassFrame({
  className = "",
  padding = PADDING_CLASS,
  innerClassName = "",
  children,
}: {
  className?: string;
  /** Override the default responsive padding (e.g. a fixed "p-3xs" mini frame). */
  padding?: string;
  /** Classes for the inner (clipped, rounded) box — background, layout, etc. */
  innerClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`${FRAME_CLASS} ${padding} ${className}`}>
      <div className={`relative h-full w-full flex-1 overflow-hidden rounded-xs ${innerClassName}`}>
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
  alt,
  className = "",
  quality = 100,
  padding = PADDING_CLASS,
  sizes = "100vw",
  aspectRatio,
  frameAspectRatio,
  objectPosition,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  quality?: number;
  /** Override the default responsive padding (e.g. a fixed "p-3xs" mini frame). */
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
  return (
    <div
      className={`${FRAME_CLASS} ${padding} ${className}`}
      style={frameAspectRatio ? { aspectRatio: frameAspectRatio } : undefined}
    >
      <div
        className={aspectRatio ? "relative w-full overflow-hidden rounded-xs" : "relative h-full w-full flex-1 overflow-hidden rounded-xs"}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          fill
          quality={quality}
          sizes={sizes}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
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
    <TiltIn
      offset={tilt ? getTiltOffset(index, total) : 0}
      className={`shrink-0 ${isLast ? "" : getMarginClass(total)}`}
    >
      <div className={`${getSizeClass(total, size)} ${tilt ? getRotateClass(total, index) : ""}`}>
        <GlassImage
          src={src}
          alt={alt}
          quality={quality}
          sizes="(min-width: 1024px) 560px, (min-width: 768px) 370px, 250px"
          className="h-full w-full"
        />
      </div>
    </TiltIn>
  );
}
