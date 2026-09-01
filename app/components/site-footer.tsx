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
  const outerRef = useRef<HTMLDivElement>(null);
  const wordmarkWrapRef = useRef<HTMLDivElement>(null);
  const [starAnchor, setStarAnchor] = useState<{ top: number; left: number } | null>(null);

  // The stars ignore the page's right padding and run to the viewport edge, so
  // they live outside <footer> — the footer's overflow-x-clip has to stay (it
  // keeps the full-bleed wordmark from causing horizontal scroll) and would
  // otherwise cut them at the padding edge. Anchored to clientWidth (which
  // excludes any scrollbar) so they reach the edge without creating scroll.
  // Vertically they still track the real <span>, whose top moves as FitText
  // rescales the wordmark per breakpoint.
  useEffect(() => {
    const outer = outerRef.current;
    const wrap = wordmarkWrapRef.current;
    if (!outer || !wrap) return;

    const measure = () => {
      const span = wrap.querySelector("span");
      if (!span) return;
      const outerRect = outer.getBoundingClientRect();
      const r = span.getBoundingClientRect();
      setStarAnchor({
        top: r.top - outerRect.top,
        left: document.documentElement.clientWidth - outerRect.left,
      });
    };

    const raf = () => requestAnimationFrame(measure);
    raf();
    const ro = new ResizeObserver(raf);
    ro.observe(outer);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="relative w-full">
    <footer className="grid w-full grid-cols-4 gap-x-lg overflow-x-clip pt-4xl pb-4xs md:gap-y-xl md:pt-4xl md:pb-2xl lg:pt-4xl lg:pb-2xl dt:grid-cols-6 dt:gap-y-0 dt:pt-0 dt:pb-4xl">
      {/* Socials — vertical on mobile, horizontal md+ */}
      <div className="col-start-1 col-span-3 row-start-1 flex flex-col items-start gap-xl md:col-span-2 md:flex-row md:items-center md:gap-6xl md:pt-md dt:pb-2xl dt:!pt-5xl">
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
        <p className="b-2xs text-text-tertiary pb-3xs md:pb-0 md:b-sm lg:b-xs dt:b-sm">©2026_Maryna_Babych</p>
      </div>

      {/* Wordmark — FitText measures and scales to exactly fill viewport width. */}
      <div
        ref={wordmarkWrapRef}
        className="relative col-start-1 col-span-4 row-start-4 md:col-span-3 dt:!col-span-6 dt:row-start-3"
      >
        <FitText
          className="-ml-[var(--page-gutter)] w-screen self-start font-medium leading-[1.15] lowercase tracking-[-0.12em] text-text-highlight pl-[var(--page-gutter)]"
          heightRatio={0.81}
        >
          get in touch
        </FitText>
      </div>
    </footer>

    {/* Clustered at the viewport's right edge, overflowing the page padding.
        Sits outside <footer> so its overflow-x-clip can't cut them; the
        wrapper is zero-width, so right-0 pins a star flush to that edge. */}
    {starAnchor && (
      <div
        className="pointer-events-none absolute"
        style={{ top: starAnchor.top, left: starAnchor.left }}
      >
        <Star
          variant={4}
          className="absolute -top-[24px] right-[26px] w-7 md:-top-[30px] md:right-[46px] md:w-12 lg:!-top-[24px] lg:!right-[50px] lg:!w-16"
        />
        <Star
          variant={4}
          className="absolute -top-[4px] right-0 w-7 md:-top-[2px] md:w-12 lg:!top-[16px] lg:!w-16"
        />
      </div>
    )}
    </div>
  );
}
