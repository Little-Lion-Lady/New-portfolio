"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Star } from "./dynamic-visuals";

// Matches RevealWords' own blur-in look, timed via `custom` so the stars
// settle right as the last word of line 1 finishes animating in.
const STAR_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(16px)" },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay,
    },
    transitionEnd: { filter: "none" },
  }),
};

/*
  Wraps a RevealWords heading and clusters two twinkle stars around the
  top-right corner of its last word on line 1 — the same treatment the home
  hero uses. Anchors to the word's own rect rather than the wrapper's corner,
  so the cluster follows the text as it re-wraps across breakpoints.
*/
export function TitleStars({ children }: { children: ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number; delay: number } | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const measure = () => {
      const heading = box.querySelector("h1, h2");
      if (!heading) return;
      // RevealWords wraps each word in an inline-block span. A heading may also
      // wrap each *line* in its own block-level span (the case-study title
      // does), and those stretch to the full container width — so walk down to
      // the leaf spans, which are always the words themselves.
      const words = Array.from(heading.querySelectorAll("span")).filter(
        (el) => !el.firstElementChild,
      );
      if (!words.length) return;

      const boxRect = box.getBoundingClientRect();
      const firstTop = words[0].getBoundingClientRect().top;
      let lastOnLine1 = words[0];
      let lastIndex = 0;
      words.forEach((word, i) => {
        if (Math.abs(word.getBoundingClientRect().top - firstTop) < 1) {
          lastOnLine1 = word;
          lastIndex = i;
        }
      });
      const r = lastOnLine1.getBoundingClientRect();
      // RevealWords staggers each word by 0.06s; the stars come in while that
      // word is still fading up rather than waiting for it to land.
      const delay = lastIndex * 0.06 + 0.2;
      setAnchor({ top: r.top - boxRect.top, left: r.right - boxRect.left, delay });
    };

    const raf = () => requestAnimationFrame(measure);
    raf();
    document.fonts.ready.then(raf);
    const ro = new ResizeObserver(raf);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="relative">
      {children}
      {anchor && (
        <m.div
          className="pointer-events-none absolute"
          style={{ top: anchor.top, left: anchor.left }}
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          custom={anchor.delay}
          variants={STAR_VARIANTS}
        >
          <Star
            variant={1}
            className="absolute -top-[8px] left-[14px] w-9 md:-top-[4px] md:left-[28px] md:w-12 lg:-top-[4px] lg:left-[36px] lg:w-16"
          />
          <Star
            variant={2}
            className="absolute -top-[22px] -left-[6px] w-9 md:-top-[32px] md:-left-[12px] md:w-12 lg:-top-[40px] lg:-left-[16px] lg:w-16"
          />
        </m.div>
      )}
    </div>
  );
}
