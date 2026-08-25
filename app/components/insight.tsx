import type { ReactNode } from "react";

// Figma "Insight" (node 1144:10770).
// Glass-frame band (same frosted treatment as GlassImage: border-overlay,
// bg-utility-inverses-glass, backdrop-blur) wrapping an opaque content card
// (border-overlay, bg-utility-inverses-white — white in light mode, dark
// Blue/950 in dark mode) that holds the label + body text.
//   label  — "Insight", text-primary-overlay (50%)
//   body   — text-primary, centered
// Card padding px 3xl→8xl→9xl (40/128/160); text B-sm→B-sm→B-md.
// Outer wrapper adds py-md→lg vertical breathing room around the band.
export function Insight({
  label = "Insight",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-md lg:py-lg">
      <div className="w-full rounded-sm border border-border-overlay bg-utility-inverses-glass p-2xs shadow-[0_2px_20px_var(--shadows-shadow-02)] backdrop-blur-[10px] md:p-xs lg:p-sm">
        <div className="flex w-full flex-col items-center gap-lg rounded-xs border border-border-overlay bg-utility-inverses-white px-3xl py-4xl md:gap-md md:px-8xl md:pb-5xl md:pt-4xl lg:gap-xl lg:px-9xl lg:pb-7xl lg:pt-6xl">
          <p className="b-sm text-text-primary-overlay lg:b-md">{label}</p>
          <p className="b-sm text-center text-text-primary lg:b-md">{children}</p>
        </div>
      </div>
    </div>
  );
}
