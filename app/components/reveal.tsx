"use client";

/*
  Reveal + RevealWords
  ────────────────────
  Reveal        — fades a single element in from y:16px over 400ms with an
                  ease-out curve. Pass `index` to stagger items in a group by
                  60ms each.

  RevealWords   — same animation applied word-by-word. Walks children,
                  splits string nodes into individual words (keeping trailing
                  whitespace), and treats every element node (e.g. a highlight
                  <span>) as a single indivisible token. Each token is wrapped
                  in a motion.span with display:inline-block.

  Both components:
  - Respect prefers-reduced-motion — instant fade.
  - Gate on <SectionReveal> context when nested inside one; outside any
    SectionReveal the context default is `true` so the in-view trigger fires
    normally.
*/

import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useSectionActive } from "./section-reveal-context";

// SSR-safe Firefox detection. Starts false (matches server render), flips to
// true on the client after hydration so there's no mismatch error.
function useIsFirefox() {
  const [isFF, setIsFF] = useState(false);
  useEffect(() => { setIsFF(/Firefox/.test(navigator.userAgent)); }, []);
  return isFF;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(20px)" },
  visible: (custom: { i?: number; delay?: number } = {}) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay: (custom.i ?? 0) * 0.06 + (custom.delay ?? 0),
    },
  }),
};

const variantsNoY: Variants = {
  hidden: { opacity: 0, filter: "blur(20px)" },
  visible: (custom: { i?: number; delay?: number } = {}) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay: (custom.i ?? 0) * 0.06 + (custom.delay ?? 0),
    },
  }),
};

// Word-level reveal: blur-only, no y movement.
const wordVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(20px)" },
  visible: (i: number = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      delay: i * 0.06,
    },
  }),
};

// For prefers-reduced-motion — instant, no animation.
const reducedVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(0px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.01 } },
};

// For Firefox — opacity + y only (no blur). filter:blur(0px) must be explicit
// in every state so Framer Motion overwrites the stale blur(20px) from the
// initial hidden state instead of carrying it forward.
const ffVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(0px)" },
  visible: (custom: { i?: number; delay?: number } = {}) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay: (custom.i ?? 0) * 0.06 + (custom.delay ?? 0),
    },
  }),
};

const ffVariantsNoY: Variants = {
  hidden: { opacity: 0, filter: "blur(0px)" },
  visible: (custom: { i?: number; delay?: number } = {}) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay: (custom.i ?? 0) * 0.06 + (custom.delay ?? 0),
    },
  }),
};

const ffWordVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(0px)" },
  visible: (i: number = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      delay: i * 0.06,
    },
  }),
};

const blurVariants: Variants = {
  hidden: { filter: "blur(8px)", opacity: 0 },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    transition: { duration: 0.6, ease: [0.445, 0.05, 0.55, 0.95] as [number, number, number, number] },
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
  className,
  style,
}: {
  children: ReactNode;
  index?: number;
  delay?: number;
  as?: Tag;
  blur?: boolean;
  noY?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const isFF = useIsFirefox();
  const sectionActive = useSectionActive();
  const shouldAnimate = sectionActive && inView;

  const Component = motion[as] as typeof motion.div;

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
      {children}
    </Component>
  );
}

// ─── RevealWords ─────────────────────────────────────────────────────────────

export function RevealWords({
  children,
  as = "p",
  className,
  style,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const isFF = useIsFirefox();
  const sectionActive = useSectionActive();
  const shouldAnimate = sectionActive && inView;

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
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
          custom={i}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
          variants={reducedMotion ? reducedVariants : isFF ? ffWordVariants : wordVariants}
        >
          {token}
        </motion.span>
      ))}
    </Tag>
  );
}
