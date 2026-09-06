"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Star } from "./dynamic-visuals";
import { WORD_STAGGER, EASE } from "./motion-timing";

// Matches RevealWords' own blur-in look and curve, timed via `custom` so each
// star arrives with the word it is anchored to.
const STAR_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(16px)" },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: EASE,
      delay,
    },
    transitionEnd: { filter: "none" },
  }),
};

// Star offsets relative to the anchor word's top-right corner. Every caller now
// runs at the case-study/About title size, so there is one set of offsets. The
// home hero used its own, larger-font nudge — those values are recorded in
// STARS-REMOVED.md rather than kept here as an unused branch.
const STARS = {
  one: "absolute -top-[8px] left-[14px] w-9 md:-top-[4px] md:left-[28px] md:w-12 lg:-top-[4px] lg:left-[36px] lg:w-16",
  two: "absolute -top-[22px] -left-[6px] w-9 md:-top-[32px] md:-left-[12px] md:w-12 lg:-top-[40px] lg:-left-[16px] lg:w-16",
} as const;

/*
  Wraps a RevealWords heading and clusters two twinkle stars around the
  top-right corner of its last word on line 1. Anchors to the word's own rect
  rather than the wrapper's corner, so the cluster follows the text as it
  re-wraps across breakpoints (or as the home hero refits its font size).

  Single source of truth for every header's stars — the About hero and the
  case-study titles. The home hero deliberately has none: its cat Lottie
  carries its own sparkles (see STARS-REMOVED.md).
*/
export function TitleStars({
  children,
  className = "relative",
  revealDelay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** The wrapped heading's own reveal delay, so the stars share its timeline. */
  revealDelay?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number; delay: number } | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const measure = () => {
      const heading = box.querySelector("h1, h2");
      if (!heading) return;
      // RevealWords wraps each word in an inline-block span — that style is
      // what identifies a word token. Selecting on it skips both the
      // block-level per-line spans some headings add (the case-study title)
      // and the inline highlight spans nested inside a word (the home hero).
      let words = Array.from(heading.querySelectorAll<HTMLElement>('span[style*="inline-block"]'));
      if (!words.length) {
        words = Array.from(heading.querySelectorAll<HTMLElement>("span")).filter(
          (el) => !el.firstElementChild,
        );
      }
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
      // A line fitted to a target span overrides the module default stagger,
      // so take the one it published rather than assuming WORD_STAGGER.
      const published = parseFloat(heading.getAttribute("data-word-stagger") ?? "");
      const stagger = Number.isFinite(published) ? published : WORD_STAGGER;
      // The cluster is pinned to this word's top-right corner, so it is the
      // nearest word by construction — it just has to share the word's place
      // in the cascade. Each token publishes its own resolved offset, which is
      // the only correct source under a line-grouped reveal (there the offset
      // comes from the token's measured line, not its index); the index maths
      // stays as the fallback for anything that has not published one.
      const ownOffset = parseFloat(lastOnLine1.getAttribute("data-reveal-delay") ?? "");
      const offset = Number.isFinite(ownOffset) ? ownOffset : lastIndex * stagger;
      const delay = revealDelay + offset;
      setAnchor({ top: r.top - boxRect.top, left: r.right - boxRect.left, delay });
    };

    const raf = () => requestAnimationFrame(measure);
    raf();
    document.fonts.ready.then(raf);
    const ro = new ResizeObserver(raf);
    ro.observe(box);
    return () => ro.disconnect();
  }, [revealDelay]);

  return (
    <div ref={boxRef} className={className}>
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
          <Star variant={1} className={STARS.one} />
          <Star variant={2} className={STARS.two} />
        </m.div>
      )}
    </div>
  );
}
