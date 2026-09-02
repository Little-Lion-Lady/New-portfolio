"use client";

/*
  useNearestWordDelay / useHeadlineHandoff
  ───────────────────────────────────────
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
import { LINE_SETTLE, LINE_STAGGER } from "./motion-timing";

// RevealWords wraps each token in an inline-block span; that style is what
// identifies a word. Skips both block-level per-line spans and the inline
// highlight spans nested inside a token.
export function wordTokens(heading: Element): HTMLElement[] {
  const inline = Array.from(heading.querySelectorAll<HTMLElement>('span[style*="inline-block"]'));
  if (inline.length) return inline;
  return Array.from(heading.querySelectorAll<HTMLElement>("span")).filter((el) => !el.firstElementChild);
}

/** Minimum gap to leave between the heading's box and an element beside it. */
const CLEARANCE_GAP = 8;

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
  // Vertical push needed to keep the element clear of the heading's box. The
  // star's own offset is a fixed step above the row below the text, but the
  // headline's height is not fixed — it refits its font size and re-wraps — so
  // on a tall wrap the last line's descenders reach it. Measured rather than
  // nudged, because the number that clears it changes with the viewport.
  const [clearance, setClearance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      const heading = document.querySelector(headingSelector);
      if (!el || !heading) return;
      const words = wordTokens(heading);
      if (!words.length) return;
      // A line fitted to a target span overrides the module default, so take
      // the stagger it published rather than assuming WORD_STAGGER.
      const published = parseFloat(heading.getAttribute("data-word-stagger") ?? "");
      const stagger = Number.isFinite(published) ? published : WORD_STAGGER;

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

      // Subtract the push already applied so this measures the element's
      // natural position — otherwise each pass would measure its own output
      // and the value would walk down the page.
      setClearance((applied) => {
        const naturalTop = r.top - applied;
        const needed = heading.getBoundingClientRect().bottom + CLEARANCE_GAP - naturalTop;
        const next = Math.max(0, Math.round(needed));
        return Math.abs(next - applied) < 1 ? applied : next;
      });

      // Positioning is settled above whatever the cascade is doing. The delay
      // is not: a line-grouped headline publishes 0 for every token until it
      // has measured where the copy breaks, and timing against that placeholder
      // fires this star at 0s — before the headline it is meant to arrive with
      // has started. data-lines="0" is that pending state; wait it out. An
      // absent attribute means the headline is not line-grouped, so the token
      // indices are already right.
      const grouped = heading.getAttribute("data-lines");
      if (grouped !== null && !(parseInt(grouped, 10) > 0)) return;

      // Prefer the offset the token published: under a line-grouped reveal the
      // delay comes from the token's measured line rather than its index, so
      // index x stagger would put the star out of step with the word it sits
      // beside. Falls back to the index maths when nothing was published.
      const ownOffset = parseFloat(words[best].getAttribute("data-reveal-delay") ?? "");
      setDelay(revealDelay + (Number.isFinite(ownOffset) ? ownOffset : best * stagger));
    };

    const raf = () => requestAnimationFrame(measure);
    raf();
    document.fonts.ready.then(raf);
    const ro = new ResizeObserver(raf);
    ro.observe(document.body);

    // The gate above waits on data-lines; this is what wakes it when the
    // headline finally publishes one. A re-wrap changes it again, and the
    // nearest word moves with it, so this stays subscribed.
    const heading = document.querySelector(headingSelector);
    const mo = new MutationObserver(raf);
    if (heading) mo.observe(heading, { attributes: true, attributeFilter: ["data-lines"] });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [ref, headingSelector, revealDelay]);

  return { delay, clearance };
}

/**
 * When a line-grouped headline reads as arrived, in seconds from page load —
 * the moment for whatever follows it to start, with no dead beat in between.
 *
 * It cannot be a constant. The hero fits its type to its box and the browser
 * decides where the copy breaks, so the headline runs five lines at 1440px and
 * twelve at 375px: 1.4s against 2.45s. A number tuned to one of those is a
 * pause at the other, or an overlap.
 *
 * So it is read back from the headline itself. RevealWords publishes the line
 * count it measured as `data-lines` — absent until the grouping resolves, which
 * is the signal to keep waiting rather than time against the zeroes the tokens
 * carry before then. An attribute MutationObserver catches it landing, and a
 * re-wrap that changes the count updates the answer.
 *
 * Returns null until the headline has published, so a caller can hold. After
 * `timeout` ms it gives up and answers from `fallbackLines` instead: better a
 * slightly wrong handover than an element that waits forever on a headline
 * that never reported (see Reveal's `hold`).
 */
export function useHeadlineHandoff({
  headingSelector = "h1",
  revealDelay = 0,
  fallbackLines = 5,
  timeout = 1000,
}: {
  headingSelector?: string;
  /** The headline's own reveal delay, which its published offsets exclude. */
  revealDelay?: number;
  /** Line count to assume if the headline never publishes one. */
  fallbackLines?: number;
  timeout?: number;
} = {}) {
  const [lines, setLines] = useState<number | null>(null);

  useEffect(() => {
    // Armed before anything can bail out. A caller may be holding an element
    // hidden on a null answer, so every path out of here has to end in one —
    // including the one where the heading is missing entirely.
    const id = window.setTimeout(() => setLines((prev) => prev ?? fallbackLines), timeout);

    const heading = document.querySelector(headingSelector);
    if (!heading) return () => window.clearTimeout(id);

    const read = () => {
      const published = parseInt(heading.getAttribute("data-lines") ?? "", 10);
      if (Number.isFinite(published) && published > 0) setLines(published);
    };

    read();
    const mo = new MutationObserver(read);
    mo.observe(heading, { attributes: true, attributeFilter: ["data-lines"] });

    return () => {
      mo.disconnect();
      window.clearTimeout(id);
    };
  }, [headingSelector, fallbackLines, timeout]);

  return lines === null ? null : revealDelay + (lines - 1) * LINE_STAGGER + LINE_SETTLE;
}
