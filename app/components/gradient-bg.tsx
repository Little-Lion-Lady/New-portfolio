"use client";

import dynamic from "next/dynamic";

// Code-split: the WebGL gradient (and its @firecms/neat dependency) is fairly
// heavy and can't render anything meaningful during SSR anyway, so it's
// fetched as its own chunk instead of bundled into every page that uses it.
const NeatGradientBg = dynamic(
  () => import("./neat-gradient").then((mod) => mod.NeatGradientBg),
  { ssr: false },
);

export function GradientBg({
  height = "620px",
  fullWidth = false,
  scaleX = 1,
  scaleClassName = "",
}: {
  height?: string;
  fullWidth?: boolean;
  scaleX?: number;
  scaleClassName?: string;
}) {
  return (
    <div className="relative">
    <div
      aria-hidden
      className={`pointer-events-none absolute -left-xl -right-xl -top-xl z-0 pt-lg md:-left-3xl md:-right-3xl md:-top-3xl md:pt-2xl lg:-left-5xl lg:-right-5xl lg:-top-5xl lg:pt-3xl${fullWidth ? "" : " px-lg md:px-2xl lg:px-3xl"}`}
      style={{ height }}
    >
      {/* clip-path rounds match border-radius at each breakpoint so the
          blur-60px child's bleed is clipped to the same rounded rect. */}
      <div className="h-full w-full blur-[12px] opacity-80">
        <div className="h-full w-full overflow-hidden rounded-t-[16px] [clip-path:inset(0_round_16px_16px_0_0)] md:rounded-t-[24px] md:[clip-path:inset(0_round_24px_24px_0_0)] lg:rounded-t-[32px] lg:[clip-path:inset(0_round_32px_32px_0_0)]">
          <div
            className={`h-full w-full blur-[80px] ${scaleClassName}`}
            style={scaleClassName ? undefined : { transform: `scaleX(${scaleX})` }}
          >
            <NeatGradientBg />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
