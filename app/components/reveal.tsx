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

import React, { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useSectionActive } from "./section-reveal-context";

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: i * 0.06,
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

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
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
  as = "div",
  blur = false,
  className,
  style,
}: {
  children: ReactNode;
  index?: number;
  as?: Tag;
  blur?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const sectionActive = useSectionActive();
  const shouldAnimate = sectionActive && inView;

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      ref={ref as unknown as React.RefObject<HTMLDivElement>}
      className={className}
      style={style}
      custom={index}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={reducedMotion ? reducedVariants : blur ? blurVariants : variants}
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
    } else {
      tokens.push(child);
    }
  });

  const Tag = as;

  return (
    <Tag ref={ref as unknown as React.RefObject<HTMLElement>} className={className} style={style}>
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
          custom={i}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
          variants={reducedMotion ? reducedVariants : wordVariants}
        >
          {token}
        </motion.span>
      ))}
    </Tag>
  );
}
