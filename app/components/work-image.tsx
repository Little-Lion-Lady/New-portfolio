import Image from "next/image";

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

// Card 1 is always tilted +5deg; cards 2–3 tilt tighter on tablet/mobile than
// desktop when there are only 3 images; card 4 (4-image items only) is -6deg.
function getRotateClass(quantity: 3 | 4, index: number) {
  if (quantity === 4) {
    return ["rotate-5", "-rotate-5", "rotate-6", "-rotate-6"][index];
  }
  return ["rotate-5", "-rotate-6 lg:-rotate-5", "rotate-6 lg:rotate-4"][index];
}

// Overlap between cards — 4-image items overlap -80px at every breakpoint;
// 3-image items tighten the overlap on mobile, loosen slightly on desktop.
function getMarginClass(quantity: 3 | 4) {
  return quantity === 4 ? "-mr-[80px]" : "-mr-[40px] md:-mr-[80px] lg:-mr-[72px]";
}

// Glass-frame padding scales with platform: mobile 6px, tablet 8px, desktop 12px.
const PADDING_CLASS = "p-2xs md:p-xs lg:p-sm";

// A single flat glass-frame image — same treatment as WorkImage's card, but no
// rotation/overlap math. Used for case-study media collages where each image
// gets its own arbitrary size via `className`.
export function GlassImage({
  src,
  alt,
  className = "",
  quality = 100,
}: {
  src: string;
  alt: string;
  className?: string;
  quality?: number;
}) {
  return (
    <div
      className={`flex flex-col rounded-sm border border-border-overlay bg-utility-inverses-glass ${PADDING_CLASS} shadow-[0_2px_10px_var(--shadows-shadow-02)] backdrop-blur-[10px] ${className}`}
    >
      <div className="relative h-full w-full flex-1 overflow-hidden rounded-xs border border-border-overlay">
        <Image src={src} alt={alt} fill quality={quality} sizes="100vw" className="object-cover" />
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
    <div
      className={`shrink-0 ${getSizeClass(total, size)} ${tilt ? getRotateClass(total, index) : ""} ${
        isLast ? "" : getMarginClass(total)
      }`}
    >
      <div
        className={`flex h-full w-full flex-col rounded-sm border border-border-overlay bg-utility-inverses-glass ${PADDING_CLASS} shadow-[0_2px_10px_var(--shadows-shadow-02)] backdrop-blur-[10px]`}
      >
        <div className="relative h-full w-full flex-1 overflow-hidden rounded-xs border border-border-overlay">
          <Image src={src} alt={alt} fill quality={quality} sizes="(min-width: 1024px) 560px, (min-width: 768px) 370px, 250px" className="object-cover" />
        </div>
      </div>
    </div>
  );
}
