"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Star } from "./dynamic-visuals";
import { WORD_STAGGER, EASE } from "./motion-timing";
import { useHeroIntroSkip } from "./hero-seen";

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

// Star offsets relative to the anchor word's top-right corner. The home hero
// runs at a much larger fluid font size than the case-study/About titles, so
// each placement carries its own nudge; everything else about the cluster —
// timing, anchoring, motion — is shared. The hero pair sits up and left of that
// corner, by a step that grows with the breakpoint (8 / 10 / 12px).
const PLACEMENTS = {
  title: {
    one: "absolute -top-[8px] left-[14px] w-9 md:-top-[4px] md:left-[28px] md:w-12 lg:-top-[4px] lg:left-[36px] lg:w-16",
    two: "absolute -top-[22px] -left-[6px] w-9 md:-top-[32px] md:-left-[12px] md:w-12 lg:-top-[40px] lg:-left-[16px] lg:w-16",
  },
  hero: {
    one: "absolute -top-[6px] left-[6px] w-9 md:-top-[6px] md:left-[8px] md:w-12 lg:-top-[6px] lg:left-[12px] lg:w-16",
    two: "absolute -top-[26px] -left-[24px] w-9 md:-top-[34px] md:-left-[32px] md:w-12 lg:-top-[42px] lg:-left-[40px] lg:w-16",
  },
} as const;

/*
  Wraps a RevealWords heading and clusters two twinkle stars around the
  top-right corner of its last word on line 1. Anchors to the word's own rect
  rather than the wrapper's corner, so the cluster follows the text as it
  re-wraps across breakpoints (or as the home hero refits its font size).

  Single source of truth for every header's stars — the home hero, the About
  hero and both case-study titles.
*/
export function TitleStars({
  children,
  placement = "title",
  className = "relative",
  revealDelay = 0,
  intro = false,
}: {
  children: ReactNode;
  /** Star offsets to use — "hero" for the fluid home headline, "title" otherwise. */
  placement?: keyof typeof PLACEMENTS;
  className?: string;
  /** The wrapped heading's own reveal delay, so the stars share its timeline. */
  revealDelay?: number;
  /** See Reveal's `intro` — skip the entrance if it already played this session. */
  intro?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number; delay: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const skipIntro = useHeroIntroSkip(intro);

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
      // in the cascade. Derived from WORD_STAGGER and the heading's own delay
      // rather than written down, so retuning either keeps the stars in step.
      const delay = revealDelay + lastIndex * stagger;
      setAnchor({ top: r.top - boxRect.top, left: r.right - boxRect.left, delay });
    };

    const raf = () => requestAnimationFrame(measure);
    raf();
    document.fonts.ready.then(raf);
    const ro = new ResizeObserver(raf);
    ro.observe(box);
    return () => ro.disconnect();
  }, [revealDelay]);

  const stars = PLACEMENTS[placement];

  return (
    <div ref={boxRef} className={className}>
      {children}
      {anchor && (
        <m.div
          className="pointer-events-none absolute"
          style={{ top: anchor.top, left: anchor.left }}
          initial={reducedMotion || skipIntro ? false : "hidden"}
          animate="visible"
          custom={skipIntro ? 0 : anchor.delay}
          variants={STAR_VARIANTS}
        >
          <Star variant={1} className={stars.one} />
          <Star variant={2} className={stars.two} />
        </m.div>
      )}
    </div>
  );
}
