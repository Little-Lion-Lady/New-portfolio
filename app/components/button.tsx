"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "./icons";

const arrowVariants = {
  rest: { x: 0, y: 0, scale: 1 },
  hover: { x: 3, y: -3, scale: 1.2 },
};

const arrowVariantsRight = {
  rest: { x: 0, y: 0 },
  hover: { x: 4, y: 0 },
};

// Figma "Button" component. Three variants × three breakpoints (mobile/tablet/desktop):
//   primary (Type=Button, Size=lg) — filled pill, text-inverted
//   link    (Type=Link,   Size=lg) — oversized text link (footer socials), text-primary-highlight
//   view    (Type=Link,   Size=sm) — mono uppercase inline link ("View"), text-primary
// Every size/gap/padding/colour below is taken from the Figma component spec.
type Variant = "primary" | "link" | "view";

export function Button({
  label,
  href = "#",
  variant = "primary",
  className = "",
}: {
  label: string;
  href?: string;
  variant?: Variant;
  className?: string;
}) {
  if (variant === "link") {
    return (
      <motion.a
        href={href}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className={`inline-flex items-center gap-2xs d-2xs text-text-primary-highlight transition-colors hover:text-text-primary-hover md:gap-xs md:d-xs ${className}`}
      >
        <span>{label}</span>
        <motion.span
          variants={arrowVariants}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex shrink-0"
        >
          <ArrowUpRight className="size-xl md:size-2xl lg:size-3xl" />
        </motion.span>
      </motion.a>
    );
  }

  if (variant === "view") {
    return (
      <motion.a
        href={href}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className={`inline-flex items-center gap-3xs b-2xs text-text-primary transition-colors hover:text-text-primary-hover md:gap-2xs md:b-xs lg:gap-3xs lg:b-sm ${className}`}
      >
        <span>{label}</span>
        <motion.span
          variants={arrowVariantsRight}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex shrink-0"
        >
          <ArrowRight className="size-md md:size-lg" />
        </motion.span>
      </motion.a>
    );
  }

  // primary
  return (
    <motion.a
      href={href}
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        rest: { scale: 1 },
        hover: { scale: 1.04 },
      }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative inline-flex items-center gap-xs overflow-hidden rounded-full pl-xl pr-lg py-sm b-xs text-text-inverted md:gap-sm md:pl-2xl md:pr-xl md:py-md md:b-sm lg:pl-3xl lg:pr-2xl lg:py-md lg:b-md ${className}`}
      style={{
        boxShadow:
          "0 10px 10px -10px var(--shadows-shadow-01), 0 10px 30px 1px var(--shadows-shadow-02)",
      }}
    >
      <span aria-hidden className="absolute inset-0 rounded-full bg-component-bg-button-primary" />
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-white"
        variants={{ rest: { opacity: 0 }, hover: { opacity: 0.08 } }}
        transition={{ duration: 0.25 }}
      />
      <span className="relative whitespace-nowrap">{label}</span>
      <motion.span
        variants={arrowVariantsRight}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative inline-flex shrink-0"
      >
        <ArrowRight className="size-lg md:size-xl lg:size-2xl" />
      </motion.span>
      {/* Glow overlay — tightens and brightens on hover */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow:
            "inset 0 -4px 15px 0 var(--shadows-glow-01), inset 0 2px 15px 2px var(--shadows-glow-01)",
        }}
        transition={{ duration: 0.25 }}
      />
    </motion.a>
  );
}
