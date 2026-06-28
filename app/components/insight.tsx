import type { ReactNode } from "react";

// Figma "Insight" (393:7174). A centered bg-highlight callout band.
//   label  — "Insight", text-primary-overlay (50%)
//   body   — text-primary, centered
// Band padding px 3xl→6xl→9xl (40/80/160), py 4xl→5xl→(80/96); text B-sm→B-md.
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
      <div className="flex w-full flex-col items-center gap-lg bg-bg-highlight px-3xl py-4xl md:px-6xl md:py-5xl lg:gap-xl lg:px-9xl lg:pb-7xl lg:pt-6xl">
        <p className="b-sm text-text-primary-overlay lg:b-md">{label}</p>
        <p className="b-sm text-center text-text-primary lg:b-md">{children}</p>
      </div>
    </div>
  );
}
