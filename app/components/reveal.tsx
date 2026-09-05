"use client";

/*
  Reveal + RevealWords
  ────────────────────
  Reveal        — fades a single element in from y:16px over 910ms on a
                  gentle-onset curve. Pass `index` to stagger items in a
                  group by 90ms each. See the Timing block below.

  RevealWords   — same animation applied word-by-word. Walks children,
                  splits string nodes into individual words (keeping trailing
                  whitespace), and treats every element node (e.g. a highlight
                  <span>) as a single indivisible token. Each token is wrapped
                  in an m.span with display:inline-block.

  Both components:
  - Respect prefers-reduced-motion — instant fade.
  - Animate identically in every browser. See the note on the removed Firefox
    variant set below before reintroducing any per-browser branch here.
  - Gate on <SectionReveal> context when nested inside one; outside any
    SectionReveal the context default is `true` so the in-view trigger fires
    normally.
*/

import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { m, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useSectionReveal } from "./section-reveal-context";
import {
  EASE,
  DURATION,
  STAGGER,
  WORD_DURATION,
  WORD_STAGGER,
  LINE_DURATION,
  LINE_STAGGER,
  Y,
  BLUR_BLOCK,
  BLUR_TEXT,
} from "./motion-timing";

// Re-exported for the client components that already import them from here.
export { EASE, DURATION, STAGGER, WORD_STAGGER } from "./motion-timing";

// Published by every <Reveal> to its subtree so nested animations (e.g. the
// per-card rotation in <TiltIn>) can fire on the same trigger and the same
// delay as the fade, instead of running their own in-view observer.
type RevealTriggerValue = { active: boolean; delay: number };
const RevealTriggerContext = createContext<RevealTriggerValue | null>(null);

export function useRevealTrigger() {
  return useContext(RevealTriggerContext);
}

// Firefox once had its own variant set — opacity + y, no blur — selected by a
// UA sniff behind useSyncExternalStore. It could never work, because the
// snapshot that decides it is not the snapshot Framer Motion mounts from:
//
//   hydrated load  — the server snapshot (`false`) is what renders, so Framer
//                    builds its initial values from the BLUR variants and the
//                    painted blur(10px) animates out. Firefox blurred.
//   client-side nav — the components mount fresh, the very first render already
//                    has the client snapshot (`true`), so Framer mounts from
//                    filter:blur(0px). Firefox did not blur.
//
// Same browser, same page, opposite result depending only on how you arrived —
// which is exactly how it was reported ("sometimes the blur reveal doesn't
// trigger"). Firefox 155 paints the blur reveal without measurable jank, so
// the special case is gone rather than repaired: one variant set, one result.

// Has this component committed on the client yet? `immediate` reveals need one
// render in the hidden state before they animate, which is what the old
// useState(false) + setState-in-effect pair bought. useSyncExternalStore's
// server snapshot is false and its client snapshot is true, so the value flips
// across hydration with no extra state.
function subscribeNoop() {
  return () => {};
}
function getMountedSnapshot() {
  return true;
}
function getMountedServerSnapshot() {
  return false;
}
export function useHasMounted() {
  return useSyncExternalStore(subscribeNoop, getMountedSnapshot, getMountedServerSnapshot);
}

// Every "visible" state below animates filter TO blur(0px) and then, via
// transitionEnd, snaps it to `none` once the transition settles. A resting
// filter value of blur(0px) (rather than no filter at all) forces the
// browser to clip this element's subtree to its own box — overriding any
// descendant's overflow:visible — which silently cuts off box-shadows that
// bleed past its edges (e.g. GlassImage cards). transitionEnd removes the
// filter after animating through it, so the entrance blur is unaffected but
// nothing is left clipping shadows at rest.
// Shared in-view gate. `amount: "some"` fires on any sliver of the element
// (the old 0.2 meant a tall block had to be a fifth on screen before it even
// started, so reveals felt like they were chasing the scroll), and the positive
// bottom margin expands the observer root downwards so a reveal begins just
// before the element crosses into view rather than after.
export const IN_VIEW = { once: true, amount: "some", margin: "0px 0px 10% 0px" } as const;



// How many frames the line grouping will wait for the layout to stop moving
// before it measures anyway. A refit normally settles within one or two; this
// only exists so a layout that never stops changing (an animating ancestor,
// say) cannot hold the headline at opacity 0 indefinitely.
const MAX_SETTLE_FRAMES = 30;

type BlockCustom = {
  i?: number;
  delay?: number;
  duration?: number;
  /** Override the shared EASE for this reveal only. See EASE_SETTLE. */
  ease?: [number, number, number, number];
  /**
   * Entrance blur radius in px, overriding BLUR_BLOCK. For subject matter a
   * wide radius destroys rather than softens - see BLUR_HERO_CLOSE.
   */
  blurPx?: number;
};

const variants: Variants = {
  hidden: (custom: BlockCustom = {}) => ({
    opacity: 0,
    y: Y,
    filter: custom.blurPx === undefined ? BLUR_BLOCK : `blur(${custom.blurPx}px)`,
  }),
  visible: (custom: BlockCustom = {}) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: custom.duration ?? DURATION,
      ease: custom.ease ?? EASE,
      delay: (custom.i ?? 0) * STAGGER + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
};

const variantsNoY: Variants = {
  hidden: (custom: BlockCustom = {}) => ({
    opacity: 0,
    filter: custom.blurPx === undefined ? BLUR_BLOCK : `blur(${custom.blurPx}px)`,
  }),
  visible: (custom: BlockCustom = {}) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: custom.duration ?? DURATION,
      ease: custom.ease ?? EASE,
      delay: (custom.i ?? 0) * STAGGER + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
};

// Word-level reveal: blur-only, no y movement.
type WordCustom = { i?: number; delay?: number; duration?: number; stagger?: number };

const wordVariants: Variants = {
  hidden: { opacity: 0, filter: BLUR_TEXT },
  visible: (custom: WordCustom = {}) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: custom.duration ?? WORD_DURATION,
      ease: EASE,
      delay: (custom.i ?? 0) * (custom.stagger ?? WORD_STAGGER) + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
};

// Line-level reveal: the same blur-in as a word, but every token on a wrapped
// line shares one delay, so the line resolves as a single object. The line
// index is measured from the laid-out DOM (see RevealWords' `byLine`) — the
// copy is fluid and the browser decides where it breaks, so lines cannot be
// authored.
const lineVariants: Variants = {
  hidden: { opacity: 0, filter: BLUR_TEXT },
  visible: (custom: WordCustom = {}) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: custom.duration ?? LINE_DURATION,
      ease: EASE,
      delay: (custom.i ?? 0) * (custom.stagger ?? LINE_STAGGER) + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
};

// For prefers-reduced-motion — instant, no animation.
const reducedVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(0px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.01 }, transitionEnd: { filter: "none" } },
};

const blurVariants: Variants = {
  hidden: { filter: BLUR_BLOCK, opacity: 0 },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    transition: { duration: DURATION, ease: EASE },
    transitionEnd: { filter: "none" },
  },
};

type Tag = "div" | "p" | "span" | "li" | "h1" | "h2" | "h3";

// ─── Reveal ──────────────────────────────────────────────────────────────────

export function Reveal({
  children,
  index = 0,
  delay = 0,
  as = "div",
  blur = false,
  noY = false,
  duration,
  ease,
  blurPx,
  immediate = false,
  hold = false,
  noSafetyFloor = false,
  className,
  style,
}: {
  children: ReactNode;
  index?: number;
  delay?: number;
  as?: Tag;
  blur?: boolean;
  noY?: boolean;
  /** Override the shared block duration for this reveal only, in seconds. */
  duration?: number;
  /**
   * Override the shared EASE for this reveal only. For a reveal that has
   * neither a stagger nor sibling movement to cover how hard EASE front-loads
   * — see EASE_SETTLE in motion-timing.ts.
   */
  ease?: [number, number, number, number];
  /** Entrance blur radius in px, overriding BLUR_BLOCK. See BLUR_HERO_CLOSE. */
  blurPx?: number;
  immediate?: boolean;
  /**
   * Stay hidden regardless of the trigger. For a caller that derives its own
   * delay and does not have it yet: starting on a placeholder and swapping the
   * real one in mid-flight restarts the transition, which is visible. Whoever
   * sets this owns getting it back to false — pair it with a timeout rather
   * than a promise that might not resolve, especially alongside
   * `noSafetyFloor`, or the element never appears.
   */
  hold?: boolean;
  /**
   * Opt out of the CSS safety floor (see .reveal-safety in globals.css).
   * The floor animates filter/transform, and an element running such an
   * animation becomes a backdrop root even while the computed values are
   * `none` — which silently kills `backdrop-filter` on every descendant. Set
   * this on a reveal that wraps frosted-glass chrome. Only reach for it on a
   * reveal that plays on mount (`immediate`) rather than on scroll, since it
   * gives up the blank-page insurance the floor exists to provide.
   */
  noSafetyFloor?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, IN_VIEW);
  const reducedMotion = useReducedMotion();
  const { active, immediate: ctxImmediate } = useSectionReveal();
  // `immediate` (prop or inherited from an immediate SectionReveal) reveals on
  // mount and ignores the in-view gate, so all content appears at once on load.
  const isImmediate = immediate || ctxImmediate;
  const mounted = useHasMounted();
  const shouldAnimate = !hold && (isImmediate ? mounted : active && inView);

  const Component = m[as] as typeof m.div;

  // Same delay the variants above apply, shared with the subtree so nested
  // animations start in step with this fade.
  const trigger = useMemo(
    () => ({ active: shouldAnimate, delay: index * STAGGER + delay }),
    [shouldAnimate, index, delay],
  );

  return (
    <Component
      ref={ref as unknown as React.RefObject<HTMLDivElement>}
      className={
        noSafetyFloor ? className : className ? `reveal-safety ${className}` : "reveal-safety"
      }
      style={style}
      custom={{ i: index, delay, duration, ease, blurPx }}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={reducedMotion ? reducedVariants : blur ? blurVariants : noY ? variantsNoY : variants}
    >
      <RevealTriggerContext.Provider value={trigger}>{children}</RevealTriggerContext.Provider>
    </Component>
  );
}

// ─── RevealWords ─────────────────────────────────────────────────────────────

export function RevealWords({
  children,
  as = "p",
  className,
  style,
  startIndex = 0,
  delay = 0,
  span,
  immediate = false,
  byLine = false,
  startLine = 0,
  ready = true,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  startIndex?: number;
  delay?: number;
  /**
   * Seconds from the first word starting to the last word settling. Given one,
   * the stagger is derived from the actual token count to hit it, so the line
   * still wraps on time if the copy changes. The per-word duration is always
   * WORD_DURATION — a span sets the pace of the cascade, never how long an
   * individual word takes. Omitted, the span follows from the word count.
   */
  span?: number;
  immediate?: boolean;
  /**
   * Reveal a wrapped line at a time instead of a word at a time. Tokenisation
   * is unchanged — every word is still its own span, so wrapping, the
   * highlight spans and the star sync all behave as before — but the tokens
   * are grouped by their measured `offsetTop` and every token on a line shares
   * that line's delay. Used by the hero headlines, whose type is fitted to its
   * box at runtime: nothing here knows where the copy breaks until it is laid
   * out, so the lines have to be measured rather than authored.
   *
   * The cascade waits for the measurement and then freezes it, so a later
   * refit cannot re-group lines mid-animation.
   */
  byLine?: boolean;
  /**
   * Hold the line grouping until the caller says its layout is final. For a
   * headline that sizes itself after mount: the fit lands in an effect, which
   * is after the frames this would otherwise measure in, and the grouping is
   * frozen as soon as the cascade starts — so a measurement taken before the
   * fit is the one that sticks. Stability heuristics do not catch it (two
   * frames before the fit look perfectly stable), so the caller has to say.
   * `byLine` only; defaults to true for callers whose type is already final.
   */
  ready?: boolean;
  /**
   * Line index this element starts at, for a headline split across sibling
   * RevealWords (the case-study title, the 404). The `byLine` equivalent of
   * `startIndex`.
   */
  startLine?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, IN_VIEW);
  const reducedMotion = useReducedMotion();
  const { active, immediate: ctxImmediate } = useSectionReveal();
  const isImmediate = immediate || ctxImmediate;
  const mounted = useHasMounted();
  const inputsReady = isImmediate ? mounted : active && inView;

  // Tokenise: string nodes → individual words (trailing space preserved so
  // the rendered text reflowing works naturally). Element nodes stay whole.
  // Whitespace-only strings (e.g. the {" "} JSX idiom) are appended to the
  // previous string token rather than dropped, preserving inter-word gaps
  // that the \S+\s* regex would otherwise miss.
  const tokens: ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (typeof child === "string") {
      // \s*\S+\s* — leading whitespace (space after an element node) is
      // captured as part of the first word token so it isn't silently dropped.
      const words = child.match(/\s*\S+\s*/g);
      if (words) {
        words.forEach((word) => tokens.push(word));
      } else if (child.length > 0) {
        // Pure whitespace: append to the last string token to preserve spacing.
        const last = tokens[tokens.length - 1];
        if (typeof last === "string") {
          tokens[tokens.length - 1] = last + child;
        } else {
          tokens.push(child);
        }
      }
    } else if (React.isValidElement(child)) {
      // Split element children (e.g. highlight spans) word-by-word, cloning
      // the element per word so each word inherits the parent's style/colour.
      const el = child as React.ReactElement<{ children?: ReactNode }>;
      const innerText = el.props.children;
      if (typeof innerText === "string") {
        const words = innerText.match(/\s*\S+\s*/g);
        if (words) {
          words.forEach((word) => tokens.push(React.cloneElement(el, {}, word)));
        } else {
          tokens.push(child);
        }
      } else {
        tokens.push(child);
      }
    } else {
      tokens.push(child);
    }
  });

  const Tag = as;

  // Fit the cascade to `span` when one is given, by moving the stagger alone:
  //   (n - 1) * stagger + WORD_DURATION = span
  // Every word blurs up over WORD_DURATION wherever it appears, so a fitted
  // line and an unfitted one look identical word for word and differ only in
  // how fast the cascade crosses them. Scaling the duration to fit instead
  // made the per-word reveal a function of the line's length — the home hero
  // ran at 2.86s a word against 1.45s everywhere else, purely because it had
  // a wrap target and the others did not.
  const count = startIndex + tokens.length;
  const timing = useMemo(() => {
    if (!span) return { stagger: WORD_STAGGER, duration: WORD_DURATION };
    const stagger = Math.max((span - WORD_DURATION) / Math.max(count - 1, 1), 0);
    return { stagger, duration: WORD_DURATION };
  }, [span, count]);

  // ─── Line grouping (byLine only) ───────────────────────────────────────────
  const tokenRefs = useRef<(HTMLElement | null)[]>([]);
  const [lineMap, setLineMap] = useState<number[] | null>(null);
  // Set once the cascade is under way. A resize or a late refit after that
  // point must not re-group the lines: the delays are already running, and a
  // token moving to a different line would restart its transition mid-flight.
  const frozen = useRef(false);
  const tokenCount = tokens.length;

  useEffect(() => {
    if (!byLine || !tokenCount || !ready) return;
    let cancelled = false;

    // Signature of everything that decides where the copy breaks. The grouping
    // is only trustworthy once this stops changing between frames.
    const signature = () => {
      const el = ref.current;
      if (!el) return "";
      return `${getComputedStyle(el).fontSize}|${el.clientWidth}|${el.clientHeight}`;
    };
    let lastSignature: string | null = null;
    let settleAttempts = 0;

    const measure = () => {
      if (cancelled || frozen.current) return;
      const els = tokenRefs.current.slice(0, tokenCount);
      if (els.some((el) => !el)) return;

      // Second line of defence: wait for the layout to hold still for a frame.
      // `ready` is what actually rules out a pre-fit measurement — two frames
      // taken before a fit look perfectly stable, so this cannot catch that on
      // its own — but it does absorb a late webfont swap or a reflow arriving
      // between the gate opening and this running.
      const sig = signature();
      if (sig !== lastSignature && settleAttempts < MAX_SETTLE_FRAMES) {
        lastSignature = sig;
        settleAttempts += 1;
        raf = requestAnimationFrame(measure);
        return;
      }

      const map: number[] = [];
      let line = 0;
      let lineTop = els[0]!.offsetTop;
      els.forEach((el, i) => {
        // Tokens on one wrapped line share an offsetTop. The 2px tolerance
        // absorbs sub-pixel differences between tokens of different heights;
        // a real line break moves by a whole line-height.
        if (i > 0 && el!.offsetTop - lineTop > 2) {
          line += 1;
          lineTop = el!.offsetTop;
        }
        map.push(line);
      });
      setLineMap((prev) =>
        prev && prev.length === map.length && prev.every((v, i) => v === map[i]) ? prev : map,
      );
    };

    // Grouping has to wait for the type that will actually be on screen: the
    // hero fits its font size after mount and the webfont can land later
    // still, and both change where the copy breaks. Racing fonts.ready against
    // a short timeout means a font that never resolves delays the headline by
    // 600ms rather than holding it at opacity 0 until the CSS safety floor.
    let raf = 0;
    let fallback = 0;
    const settled = Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => setTimeout(resolve, 600)),
    ]);
    settled.then(() => {
      if (cancelled) return;
      // A frame is the right moment to measure — layout is settled and nothing
      // is read back mid-write. But requestAnimationFrame does not fire in a
      // background tab, and the cascade holds until the lines are known, so a
      // timer backs it up: someone who opens the site in a background tab and
      // comes back to it finds the headline ready to reveal rather than
      // waiting on the CSS safety floor. Whichever lands first wins; the
      // second is a no-op once the grouping stops changing.
      raf = requestAnimationFrame(measure);
      fallback = window.setTimeout(measure, 100);
    });

    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
      ro.disconnect();
    };
  }, [byLine, tokenCount, ready]);

  // A byLine cascade holds until its lines are known; every other reveal runs
  // on its trigger alone.
  const shouldAnimate = inputsReady && (!byLine || lineMap !== null);

  useEffect(() => {
    if (shouldAnimate) frozen.current = true;
  }, [shouldAnimate]);

  const cascade = (i: number) =>
    byLine
      ? { i: startLine + (lineMap?.[i] ?? 0), stagger: LINE_STAGGER, duration: LINE_DURATION }
      : { i: startIndex + i, stagger: timing.stagger, duration: timing.duration };

  const tokenVariants = reducedMotion ? reducedVariants : byLine ? lineVariants : wordVariants;

  return (
    // Published so <SyncedStar>/<TitleStars> can time themselves against the
    // stagger this line actually used rather than the module default, which a
    // fitted span overrides.
    <Tag
      ref={ref as unknown as React.RefObject<never>}
      className={className}
      style={style}
      data-word-stagger={byLine ? LINE_STAGGER : timing.stagger}
      // The line count, for anything timing itself against this headline.
      // Three states, and consumers need all three: absent means not
      // line-grouped at all (time against token indices); 0 means grouped but
      // not measured yet, so every token's published delay is still a
      // placeholder 0 and timing against one would fire at 0s; a positive
      // count means the delays are final.
      data-lines={byLine ? (lineMap ? lineMap[lineMap.length - 1] + 1 : 0) : undefined}
    >
      {tokens.map((token, i) => {
        const c = cascade(i);
        return (
          <m.span
            key={i}
            ref={(el: HTMLElement | null) => {
              tokenRefs.current[i] = el;
            }}
            className="reveal-safety"
            style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
            custom={{ ...c, delay }}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
            variants={tokenVariants}
            // The resolved cascade offset for this token, excluding the
            // heading's own `delay`. Star sync reads it rather than
            // recomputing index x stagger, which is wrong under byLine.
            data-reveal-delay={c.i * c.stagger}
          >
            {token}
          </m.span>
        );
      })}
    </Tag>
  );
}
