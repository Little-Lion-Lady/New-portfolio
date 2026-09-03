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

      {/* Wordmark — FitText measures and scales to exactly fill viewport width. */}
      <div
        ref={wordmarkWrapRef}
        className="relative col-start-1 col-span-4 row-start-3 md:col-span-3 dt:!col-span-6 dt:row-start-2"
      >
        <FitText
          className="-ml-[var(--page-gutter)] w-screen self-start font-medium leading-[1.15] lowercase tracking-[-0.12em] text-text-highlight pl-[var(--page-gutter)]"
          heightRatio={0.81}
        >
          get in touch
        </FitText>
      </div>

      {/* Colophon — M-xs → M-md → M-lg. Last line of the footer, sitting under
          the wordmark and flush with the page's right edge, so it reads as the
          wordmark's signature rather than as another column of the grid above
          it. Spans every column at each breakpoint (the wordmark stops at 3 of
          4 on tablet) because justify-end can only reach the right edge if the
          cell does.

          Pulled up so it sits just under the wordmark's descenders. Two things
          separate them and the margin closes both: the grid's own row gap (24px
          from md until dt, none either side of that), and the half-leading in
          the wordmark's line box.

          The leading part is in vw because FitText scales the wordmark to the
          viewport, so it has no fixed size to subtract — measured across four
          widths it holds at ~0.167 × vw, and at leading-[1.15] the half-leading
          is 0.075 of that, i.e. ~1.25vw. A per-breakpoint pixel value would be
          right at three widths and wrong at every width between them. */}
      <div className="col-start-1 col-span-4 row-start-4 -mt-[1.25vw] flex items-center justify-end md:-mt-[calc(1.25vw+var(--spacing-xl))] dt:!-mt-[1.25vw] dt:!col-span-6 dt:row-start-3">
        <p className="b-3xs text-text-tertiary text-right md:b-sm lg:b-xs dt:b-sm">©2026_Maryna_Babych</p>
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
