"use client";

/*
  useNearestWordDelay
  ───────────────────
  Returns the reveal delay of the <RevealWords> word token nearest to `ref`,
  so an element sitting beside the text can arrive with the word it points at
  rather than on a hand-copied timeline.

  The delay has to be derived rather than written down: it is a product of the
  word's index, WORD_STAGGER and the heading's own revealDelay, and every one
  of those has moved while tuning the hero. A literal goes stale silently — the
  star still animates, just against the wrong word.

  Re-measures on resize and after fonts load, because the nearest word changes
  when the text re-wraps (and the home hero also refits its font size).
*/

import { useEffect, useState, type RefObject } from "react";
import { WORD_STAGGER } from "./reveal";

// RevealWords wraps each token in an inline-block span; that style is what
// identifies a word. Skips both block-level per-line spans and the inline
// highlight spans nested inside a token.
export function wordTokens(heading: Element): HTMLElement[] {
  const inline = Array.from(heading.querySelectorAll<HTMLElement>('span[style*="inline-block"]'));
  if (inline.length) return inline;
  return Array.from(heading.querySelectorAll<HTMLElement>("span")).filter((el) => !el.firstElementChild);
}

/** Squared distance from a point to the nearest edge of a rect (0 if inside). */
function distanceTo(rect: DOMRect, x: number, y: number) {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return dx * dx + dy * dy;
}

export function useNearestWordDelay(
  ref: RefObject<HTMLElement | null>,
  { headingSelector = "h1", revealDelay = 0 }: { headingSelector?: string; revealDelay?: number } = {},
) {
  const [delay, setDelay] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      const heading = document.querySelector(headingSelector);
      if (!el || !heading) return;
      const words = wordTokens(heading);
      if (!words.length) return;

      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      let best = 0;
      let bestDist = Infinity;
      words.forEach((word, i) => {
        const d = distanceTo(word.getBoundingClientRect(), cx, cy);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setDelay(revealDelay + best * WORD_STAGGER);
    };

    const raf = () => requestAnimationFrame(measure);
    raf();
    document.fonts.ready.then(raf);
    const ro = new ResizeObserver(raf);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [ref, headingSelector, revealDelay]);

  return delay;
}
