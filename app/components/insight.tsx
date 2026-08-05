import type { ReactNode } from "react";

// Figma "Insight" (393:7174 desktop / 393:16010 tablet / 393:16037 mobile).
// Glass-frame band (translucent white, border-secondary, shadow) wrapping an
// opaque white content card (border-overlay) that holds the label + body text.
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
      <div className="w-full rounded-sm border border-border-secondary bg-utility-white-50 p-2xs shadow-[0_2px_20px_var(--shadows-shadow-02)] md:p-xs lg:p-sm">
        <div className="flex w-full flex-col items-center gap-lg rounded-xs border border-border-overlay bg-bg-white px-3xl py-4xl md:gap-md md:px-8xl md:pb-5xl md:pt-4xl lg:gap-xl lg:px-9xl lg:pb-7xl lg:pt-6xl">
          <p className="b-sm text-text-primary-overlay lg:b-md">{label}</p>
          <p className="b-sm text-center text-text-primary lg:b-md">{children}</p>
        </div>
      </div>
    </div>
  );
}
