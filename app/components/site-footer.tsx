"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { CyclingWord } from "./cycling-word";
import { FitText } from "./fit-text";
import { Star } from "./dynamic-visuals";

const CYCLING_WORDS = ["love", "hate", "AI", "coffee", "mischief", "claude", "care", "passion"];

// Figma "Footer" component — a responsive grid.
//   desktop 6-col/3-row: socials(c1-2,r1) · made-with-love(c5,r1) · colophon(c1-2,r2) · wordmark(c1-6,r3)
//   tablet  4-col/4-row: socials(r1) · made-with-love(r2) · colophon(r3) · wordmark(r4)
//   mobile  4-col/4-row: same stacking as tablet, socials stack vertically
// Wordmark "get in touch" uses discrete sizes per breakpoint (60 / 170 / 314 px),
// per rebuild-prompt #6 (match each frame, don't interpolate). Clipped to avoid scroll.
export function SiteFooter() {
  const wordmarkWrapRef = useRef<HTMLDivElement>(null);
  const [starAnchor, setStarAnchor] = useState<{ top: number; left: number } | null>(null);

  // FitText scales to fill the viewport width regardless of this wrapper's
  // own grid column span (it clips against the footer's right edge, not its
  // own container) — so the wrapper's box never reliably matches the actual
  // rendered text. Anchor the stars to the real <span> instead of a %
  // position, so they land on "touch" itself at every breakpoint.
  useEffect(() => {
    const wrap = wordmarkWrapRef.current;
    if (!wrap) return;

    const measure = () => {
      const span = wrap.querySelector("span");
      if (!span) return;
      const wrapRect = wrap.getBoundingClientRect();
      const r = span.getBoundingClientRect();
      setStarAnchor({ top: r.top - wrapRect.top, left: r.right - wrapRect.left });
    };

    const raf = () => requestAnimationFrame(measure);
    raf();
    const ro = new ResizeObserver(raf);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return (
    <footer className="grid w-full grid-cols-4 gap-x-lg overflow-x-clip pt-2xl pb-4xs md:gap-y-xl md:pt-3xl md:pb-2xl dt:grid-cols-6 dt:gap-y-0 dt:pt-0 dt:pb-0">
      {/* Socials — vertical on mobile, horizontal md+ */}
      <div className="col-start-1 col-span-3 row-start-1 flex flex-col items-start gap-2xl md:col-span-2 md:flex-row md:items-center md:gap-6xl md:pt-md dt:pb-2xl dt:!pt-5xl">
        <Button variant="link" label="LinkedIn" href="https://www.linkedin.com/in/marynababych/" target="_blank" rel="noopener noreferrer" />
        <Button variant="link" label="Email" href="mailto:maryna.babych@gmail.com" target="_blank" rel="noopener noreferrer" />
      </div>

      {/* Made with love */}
      <div className="col-start-1 col-span-3 row-start-2 flex items-center pt-2xl pb-2xl md:col-span-2 md:pt-4xl md:pb-lg dt:!col-start-5 dt:col-span-2 dt:row-start-1 dt:items-start dt:!pt-3xl dt:overflow-hidden">
        <p className="whitespace-nowrap text-[32px] leading-[48px] text-text-tertiary md:text-[44px] md:leading-[1.1]">
          Made with <CyclingWord words={CYCLING_WORDS} className="text-text-primary-highlight" />
        </p>
      </div>

      {/* Colophon — M-xs → M-md → M-lg */}
      <div className="col-start-1 col-span-4 row-start-3 flex items-center md:col-span-3 md:-mb-lg dt:col-span-2 dt:row-start-2 dt:pt-4xl dt:!-mb-2xl">
        <p className="b-3xs text-text-tertiary pb-3xs md:pb-0 md:b-2xs dt:b-sm">©2026_Maryna_Babych</p>
      </div>

      {/* Wordmark — FitText measures and scales to exactly fill viewport width. */}
      <div
        ref={wordmarkWrapRef}
        className="relative col-start-1 col-span-4 row-start-4 md:col-span-3 dt:!col-span-6 dt:row-start-3"
      >
        {/* Clustered around the top-right corner of "touch" itself */}
        {starAnchor && (
          <div
            className="pointer-events-none absolute"
            style={{ top: starAnchor.top, left: starAnchor.left }}
          >
            {/* footer has overflow-x-clip and "touch" already fills flush to
                its right edge, so both stars sit left of the anchor point —
                any positive offset here gets clipped and vanishes. */}
            <Star
              variant={4}
              className="absolute -top-[24px] -left-[30px] w-6 md:-top-[30px] md:-left-[68px] md:w-7 dt:!-top-[20px] dt:!-left-[140px] dt:!w-20"
            />
            <Star
              variant={4}
              className="absolute -top-[4px] -left-[20px] w-6 md:-top-[2px] md:-left-[50px] md:w-7 dt:!top-[12px] dt:!-left-[120px] dt:!w-20"
            />
          </div>
        )}
        <FitText
          className="-ml-md w-screen self-start font-medium leading-[1.15] lowercase tracking-[-0.12em] text-text-highlight pl-md md:-ml-xl md:pl-xl dt:-ml-5xl dt:pl-5xl"
          heightRatio={0.81}
        >
          get in touch
        </FitText>
      </div>
    </footer>
  );
}
