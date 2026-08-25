"use client";

import dynamic from "next/dynamic";
import { m, useReducedMotion } from "framer-motion";

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
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative">
    <div
      aria-hidden
      // Horizontal bleed lives in .gradient-bleed (globals.css) — it steps from
      // content-edge on mobile out to the viewport edge at lg, cancelling the
      // page's own --page-gutter to get there.
      className={`gradient-bleed pointer-events-none absolute -top-xl z-0 pt-lg md:-top-3xl md:pt-2xl lg:-top-5xl lg:pt-3xl${fullWidth ? "" : " px-lg md:px-2xl lg:px-3xl"}`}
      style={{ height }}
    >
      {/* clip-path rounds match border-radius at each breakpoint so the
          blur-60px child's bleed is clipped to the same rounded rect. */}
      {/* Fades up to its resting 0.8 opacity on mount, in step with the title
          reveal, so the WebGL canvas doesn't pop in when its chunk lands. */}
      <m.div
        className="h-full w-full blur-[12px]"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="h-full w-full overflow-hidden rounded-t-[16px] [clip-path:inset(0_round_16px_16px_0_0)] md:rounded-t-[24px] md:[clip-path:inset(0_round_24px_24px_0_0)] lg:rounded-t-[32px] lg:[clip-path:inset(0_round_32px_32px_0_0)]">
          <div
            className={`h-full w-full blur-[80px] ${scaleClassName}`}
            style={scaleClassName ? undefined : { transform: `scaleX(${scaleX})` }}
          >
            <NeatGradientBg />
          </div>
        </div>
      </m.div>
    </div>
    </div>
  );
}
