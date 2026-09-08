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

import React, { createContext, useContext, useEffect, useId, useMemo, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
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

  /*
    An `immediate` reveal plays on mount and ignores the in-view gate — which
    means there is nothing about it to decide at runtime. Its delay is
    `index * STAGGER + delay`, all three of which are known while rendering, so
    it does not need Framer, a measurement, or even a script: the element ships
    with `data-play` already on it and the CSS in globals.css starts the
    animation at first paint.

    That is the whole fix for the case-study pages. Their LCP element is the
    intro paragraph inside <Reveal immediate> in case-study-hero.tsx, and
    "on mount" meant "after React has hydrated" — measured at 3.9-4.5s on a
    throttled phone against a 2.5s budget, on pages that had painted by 800ms.

    Scroll-triggered reveals keep the Framer path below. They are below the
    fold by definition, so they cannot be the LCP element, and they genuinely
    do need a runtime trigger.
  */
  if (isImmediate && !hold) {
    const Plain = as as React.ElementType;
    return (
      <Plain
        ref={ref as unknown as React.RefObject<HTMLDivElement>}
        className={className ? `reveal-anim ${className}` : "reveal-anim"}
        data-play=""
        style={
          {
            ...style,
            "--reveal-delay": `${index * STAGGER + delay}s`,
            "--reveal-duration": `${duration ?? DURATION}s`,
            "--reveal-ease": `cubic-bezier(${(ease ?? EASE).join(",")})`,
            "--reveal-y": noY ? "0px" : `${Y}px`,
            ...(blur || blurPx !== undefined
              ? {
                  "--reveal-name": "reveal-in-blur",
                  "--reveal-blur": `blur(${blurPx ?? parseFloat(BLUR_BLOCK.slice(5))}px)`,
                }
              : null),
          } as CSSProperties
        }
      >
        <RevealTriggerContext.Provider value={trigger}>{children}</RevealTriggerContext.Provider>
      </Plain>
    );
  }

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

  // ─── Line grouping ─────────────────────────────────────────────────────────
  //
  // byLine no longer animates through Framer. The cascade is CSS (see
  // `.line-reveal` in globals.css) and this only supplies the one thing CSS
  // cannot work out for itself: which wrapped line each token landed on.
  //
  // The measurement runs TWICE, and the first run is the point of the whole
  // arrangement:
  //
  //   1. An inline <script> rendered directly after the heading, which the
  //      parser executes the moment the heading's markup is complete — before
  //      hydration, before the framework chunk, often before the page has
  //      finished streaming. That is what moves the headline off the critical
  //      path: measured on the deployed site, this reveal used to start at
  //      3127ms on a throttled phone and LCP landed at 5328ms.
  //
  //   2. This effect, as the fallback. A client-side navigation re-renders the
  //      tree without re-running injected scripts, so on a route reached
  //      through the page curtain step 1 never fires. It is a no-op when the
  //      script already did the work — `data-revealed` is the flag.
  //
  // Both write the same thing: `--line` per token, `data-lines` on the heading
  // for the handoff consumers (HeroClose, AfterHeroReveal — see word-sync.ts),
  // then `data-revealed` to release the animation.
  const headingId = useId();

  useEffect(() => {
    if (!byLine) return;
    const el = ref.current;
    if (!el || el.hasAttribute("data-revealed")) return;
    groupLines(el, startLine);
  }, [byLine, startLine]);

  if (byLine) {
    return (
      <>
        <Tag
          id={headingId}
          ref={ref as unknown as React.RefObject<never>}
          className={className ? `line-reveal ${className}` : "line-reveal"}
          style={
            {
              ...style,
              // Read by the animation shorthand in globals.css. The two
              // timings come through as custom properties rather than being
              // written into the stylesheet, so motion-timing.ts stays the one
              // place either number is defined — the whole reason that module
              // is a plain non-client module in the first place.
              "--line-duration": `${LINE_DURATION}s`,
              "--line-stagger": `${LINE_STAGGER}s`,
              // Named rather than baked in so a headline split across sibling
              // RevealWords (the case-study title) keeps one continuous cascade.
              "--start-line": startLine,
              "--reveal-delay": `${delay}s`,
            } as CSSProperties
          }
          // Three states, and consumers need all three: absent means not
          // line-grouped; 0 means grouped but not measured yet; a positive
          // count means the delays are final. See useHeadlineHandoff.
          data-lines={0}
          // A fitted line overrides the module default, so consumers read what
          // was used rather than assuming. byLine always paces by LINE_STAGGER.
          data-word-stagger={LINE_STAGGER}
        >
          {tokens.map((token, i) => (
            <span key={i} style={{ display: "inline-block", whiteSpace: "pre-wrap" }}>
              {token}
            </span>
          ))}
        </Tag>
        <script
          // Runs during parse. Reading offsetTop forces layout on one heading,
          // which is cheap, and the stylesheet is render-blocking so the type
          // is already correct. The webfont may still be swapping, but Geist
          // ships a metric-matched fallback (size-adjust), so the wrap it
          // measures is the wrap the real face produces.
          dangerouslySetInnerHTML={{ __html: groupLinesScript(headingId, startLine) }}
        />
      </>
    );
  }

  const cascade = (i: number) => ({
    i: startIndex + i,
    stagger: timing.stagger,
    duration: timing.duration,
  });

  return (
    <Tag
      ref={ref as unknown as React.RefObject<never>}
      className={className}
      style={style}
      data-word-stagger={timing.stagger}
    >
      {tokens.map((token, i) => {
        const c = cascade(i);
        return (
          <m.span
            key={i}
            className="reveal-safety"
            style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
            custom={{ ...c, delay }}
            initial="hidden"
            animate={inputsReady ? "visible" : "hidden"}
            variants={reducedMotion ? reducedVariants : wordVariants}
            // The resolved cascade offset for this token, excluding the
            // heading's own `delay`. Star sync reads it rather than
            // recomputing index x stagger.
            data-reveal-delay={c.i * c.stagger}
          >
            {token}
          </m.span>
        );
      })}
    </Tag>
  );
}

/*
  The grouping itself, written once and used from both entry points above.

  Tokens on one wrapped line share an offsetTop. The 2px tolerance absorbs
  sub-pixel differences between tokens of different heights; a real line break
  moves by a whole line-height.
*/
function groupLines(el: Element, startLine: number) {
  const spans = el.children;
  if (!spans.length) return;
  const stamp = (node: HTMLElement, line: number) => {
    node.style.setProperty("--line", String(line));
    // TitleStars pins its cluster to a word and has to share that word's place
    // in the cascade. Under a line-grouped reveal the offset comes from the
    // measured line, not the token index, so it can only be published here.
    node.setAttribute("data-reveal-delay", String((startLine + line) * LINE_STAGGER));
  };
  let lineTop = (spans[0] as HTMLElement).offsetTop;
  let line = 0;
  stamp(spans[0] as HTMLElement, 0);
  for (let i = 1; i < spans.length; i++) {
    const s = spans[i] as HTMLElement;
    if (s.offsetTop - lineTop > 2) {
      line += 1;
      lineTop = s.offsetTop;
    }
    stamp(s, line);
  }
  el.setAttribute("data-lines", String(line + 1));
  el.setAttribute("data-revealed", "");
}

/*
  The same routine as a string, for the inline <script>. Deliberately a
  duplicate rather than a serialised `groupLines.toString()`: this has to
  survive minification, and a bundler is free to rename anything it can see.
*/
function groupLinesScript(id: string, startLine: number) {
  return (
    `(function(){var h=document.getElementById(${JSON.stringify(id)});if(!h)return;` +
    `var s=h.children,n=s.length;if(!n)return;var b=${startLine},g=${LINE_STAGGER};` +
    `function m(e,l){e.style.setProperty('--line',String(l));` +
    `e.setAttribute('data-reveal-delay',String((b+l)*g));}` +
    `var t=s[0].offsetTop,l=0;m(s[0],0);` +
    `for(var i=1;i<n;i++){var o=s[i].offsetTop;if(o-t>2){l++;t=o;}m(s[i],l);}` +
    `h.setAttribute('data-lines',String(l+1));h.setAttribute('data-revealed','');})();`
  );
}
