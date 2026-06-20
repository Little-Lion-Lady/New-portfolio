"use client";

/*
  Reveal
  ──────
  Fades a single element in from `y: 16px` over 400ms with an ease-out curve.
  Triggers when the element scrolls into view (Framer Motion's useInView wraps
  IntersectionObserver). Pass `index` to stagger items in a group by 60ms each.

  - Respects `prefers-reduced-motion` — collapses to an instant fade.
  - `as` lets the wrapper render as p / div / span / li without losing semantics.
*/

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";
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
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });
  const reducedMotion = useReducedMotion();
  // When wrapped in <SectionReveal>, defer animation until the parent section
  // has been triggered. Outside any SectionReveal the context default is true,
  // so behaviour falls back to the original in-view trigger.
  const sectionActive = useSectionActive();
  const shouldAnimate = sectionActive && inView;

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
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
