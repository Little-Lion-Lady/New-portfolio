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
  - Gate on <SectionReveal> context when nested inside one; outside any
    SectionReveal the context default is `true` so the in-view trigger fires
    normally.
*/

import React, { createContext, useContext, useMemo, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { m, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useSectionReveal } from "./section-reveal-context";
import {
  EASE,
  DURATION,
  STAGGER,
  DURATION_FF,
  WORD_DURATION,
  WORD_STAGGER,
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

// SSR-safe Firefox detection, computed once and shared across every Reveal/
// RevealWords instance (a page can render dozens) instead of once per
// instance. useSyncExternalStore lets the client value differ from the
// server's `false` on the very first client render with no hydration warning
// and no extra setState-in-effect render, unlike a useState+useEffect pair.
let cachedIsFirefox: boolean | null = null;
function getIsFirefoxSnapshot() {
  if (cachedIsFirefox === null) cachedIsFirefox = /Firefox/.test(navigator.userAgent);
  return cachedIsFirefox;
}
function getIsFirefoxServerSnapshot() {
  return false;
}
function subscribeNoop() {
  return () => {};
}
function useIsFirefox() {
  return useSyncExternalStore(subscribeNoop, getIsFirefoxSnapshot, getIsFirefoxServerSnapshot);
}

// Has this component committed on the client yet? `immediate` reveals need one
// render in the hidden state before they animate, which is what the old
// useState(false) + setState-in-effect pair bought. Same trick as
// useIsFirefox above: the server snapshot is false and the client snapshot is
// true, so the value flips across hydration with no extra state.
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



type BlockCustom = { i?: number; delay?: number; duration?: number };

const variants: Variants = {
  hidden: { opacity: 0, y: Y, filter: BLUR_BLOCK },
  visible: (custom: BlockCustom = {}) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: custom.duration ?? DURATION,
      ease: EASE,
      delay: (custom.i ?? 0) * STAGGER + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
};

const variantsNoY: Variants = {
  hidden: { opacity: 0, filter: BLUR_BLOCK },
  visible: (custom: BlockCustom = {}) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: custom.duration ?? DURATION,
      ease: EASE,
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

// For prefers-reduced-motion — instant, no animation.
const reducedVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(0px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.01 }, transitionEnd: { filter: "none" } },
};

// For Firefox — opacity + y only (no blur). filter:blur(0px) must be explicit
// in every state so Framer Motion overwrites the stale blur from the initial
// hidden state instead of carrying it forward. With no blur to paint there is
// nothing to hide behind, so these run slightly shorter.
const ffVariants: Variants = {
  hidden: { opacity: 0, y: Y, filter: "blur(0px)" },
  visible: (custom: BlockCustom = {}) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: custom.duration ?? DURATION_FF,
      ease: EASE,
      delay: (custom.i ?? 0) * STAGGER + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
};

const ffVariantsNoY: Variants = {
  hidden: { opacity: 0, filter: "blur(0px)" },
  visible: (custom: BlockCustom = {}) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: custom.duration ?? DURATION_FF,
      ease: EASE,
      delay: (custom.i ?? 0) * STAGGER + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
};

const ffWordVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(0px)" },
  visible: (custom: WordCustom = {}) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: custom.duration ?? DURATION_FF,
      ease: EASE,
      delay: (custom.i ?? 0) * (custom.stagger ?? WORD_STAGGER) + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
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
  immediate = false,
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
  immediate?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, IN_VIEW);
  const reducedMotion = useReducedMotion();
  const isFF = useIsFirefox();
  const { active, immediate: ctxImmediate } = useSectionReveal();
  // `immediate` (prop or inherited from an immediate SectionReveal) reveals on
  // mount and ignores the in-view gate, so all content appears at once on load.
  const isImmediate = immediate || ctxImmediate;
  const mounted = useHasMounted();
  const shouldAnimate = isImmediate ? mounted : active && inView;

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
      className={className}
      style={style}
      custom={{ i: index, delay, duration }}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={reducedMotion ? reducedVariants : isFF ? (noY ? ffVariantsNoY : ffVariants) : blur ? blurVariants : noY ? variantsNoY : variants}
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
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, IN_VIEW);
  const reducedMotion = useReducedMotion();
  const isFF = useIsFirefox();
  const { active, immediate: ctxImmediate } = useSectionReveal();
  const isImmediate = immediate || ctxImmediate;
  const mounted = useHasMounted();
  const shouldAnimate = isImmediate ? mounted : active && inView;

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

  return (
    // Published so <SyncedStar>/<TitleStars> can time themselves against the
    // stagger this line actually used rather than the module default, which a
    // fitted span overrides.
    <Tag
      ref={ref as unknown as React.RefObject<never>}
      className={className}
      style={style}
      data-word-stagger={timing.stagger}
    >
      {tokens.map((token, i) => (
        <m.span
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
          custom={{ i: startIndex + i, delay, duration: timing.duration, stagger: timing.stagger }}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
          variants={reducedMotion ? reducedVariants : isFF ? ffWordVariants : wordVariants}
        >
          {token}
        </m.span>
      ))}
    </Tag>
  );
}
