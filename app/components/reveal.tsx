"use client";

/*
  Reveal + RevealWords
  ────────────────────
  Reveal        — fades a single element in from y:16px over 700ms on a
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

// ─── Timing ──────────────────────────────────────────────────────────────────
// One source of truth for the reveal system.
//
// A reveal reads as abrupt when it leaves rest already moving fast. The onset
// velocity is (y1/x1) * Y / DURATION, so the curve's initial slope matters as
// much as the duration: ease-out-quint (0.22,1) starts at slope 4.5, i.e. flat
// out, which popped. This curve starts at slope 2.25 and then flattens hard
// into a very long tail, so motion begins gently and spends most of its time
// settling. At 700ms over 16px that is ~51 px/s at the start — matching the
// old ease-out-quad's gentle onset — but with far more of the duration spent
// in the deceleration, which is what actually reads as smooth.
export const EASE = [0.32, 0.72, 0, 1] as [number, number, number, number];
export const DURATION = 0.7;
// Stagger is well under the duration, so each item begins while its neighbour
// is only a fraction through: the group arrives as one continuous cascade
// rather than a sequence of discrete pops.
export const STAGGER = 0.09;
const DURATION_FF = 0.6;
const WORD_DURATION = 1.0;
// Words need a far tighter stagger than blocks: the hero runs 33 of them, so
// the block value would drag its reveal out past three seconds. At 30ms the
// cascade crosses the line in ~1s while each word still takes a full second to
// resolve — around 25 words are in motion at any moment, so the line reads as
// one sweep rather than a row of individual pops.
const WORD_STAGGER = 0.03;
const Y = 16;

// filter:blur() is paint-bound — every frame re-rasterises the element at a new
// radius — so the radius is the frame cost. Block reveals wrap whole sections
// including large images and glass cards, where a wide radius is expensive and
// barely legible. Word reveals cover small glyph runs, where it is cheap and
// does the most work, so they keep a slightly wider one.
const BLUR_BLOCK = "blur(8px)";
const BLUR_TEXT = "blur(10px)";

const variants: Variants = {
  hidden: { opacity: 0, y: Y, filter: BLUR_BLOCK },
  visible: (custom: { i?: number; delay?: number } = {}) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: DURATION,
      ease: EASE,
      delay: (custom.i ?? 0) * STAGGER + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
};

const variantsNoY: Variants = {
  hidden: { opacity: 0, filter: BLUR_BLOCK },
  visible: (custom: { i?: number; delay?: number } = {}) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: DURATION,
      ease: EASE,
      delay: (custom.i ?? 0) * STAGGER + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
};

// Word-level reveal: blur-only, no y movement.
const wordVariants: Variants = {
  hidden: { opacity: 0, filter: BLUR_TEXT },
  visible: (i: number = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: WORD_DURATION,
      ease: EASE,
      delay: i * WORD_STAGGER,
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
  visible: (custom: { i?: number; delay?: number } = {}) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: DURATION_FF,
      ease: EASE,
      delay: (custom.i ?? 0) * STAGGER + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
};

const ffVariantsNoY: Variants = {
  hidden: { opacity: 0, filter: "blur(0px)" },
  visible: (custom: { i?: number; delay?: number } = {}) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: DURATION_FF,
      ease: EASE,
      delay: (custom.i ?? 0) * STAGGER + (custom.delay ?? 0),
    },
    transitionEnd: { filter: "none" },
  }),
};

const ffWordVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(0px)" },
  visible: (i: number = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: DURATION_FF,
      ease: EASE,
      delay: i * WORD_STAGGER,
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
      custom={{ i: index, delay }}
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
  immediate = false,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  startIndex?: number;
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

  return (
    <Tag ref={ref as unknown as React.RefObject<never>} className={className} style={style}>
      {tokens.map((token, i) => (
        <m.span
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
          custom={startIndex + i}
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
