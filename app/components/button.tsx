"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "./icons";

// Animated Next.js Link — client-side nav + prefetch for internal routes.
const MotionLink = m.create(Link);

// True for hrefs that shouldn't go through next/link (external origins,
// mailto/tel, or the "#" placeholder used by not-yet-wired buttons).
function isExternalHref(href: string) {
  return href === "#" || /^(https?:|mailto:|tel:)/.test(href);
}

const arrowVariants = {
  rest: { x: 0, y: 0, scale: 1 },
  hover: { x: 3, y: -3, scale: 1.2 },
};

const arrowVariantsRight = {
  rest: { x: 0, y: 0 },
  hover: { x: 4, y: 0 },
};

const primaryScaleVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.04 },
  press: { scale: 0.95 },
};

const primaryWhiteOverlayVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 0.08 },
  press: { opacity: 0.08 },
};

const primaryPressTintVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 0 },
  press: { opacity: 0.14 },
};

// Figma "Button" component. Three variants × three breakpoints (mobile/tablet/desktop):
//   primary (Type=Button, Size=lg) — filled pill, text-inverted
//   link    (Type=Link,   Size=lg) — oversized text link (footer socials), text-primary-highlight
//   view    (Type=Link,   Size=sm) — mono uppercase inline link ("View"), text-primary
// Every size/gap/padding/colour below is taken from the Figma component spec.
type Variant = "primary" | "link" | "view";
type ViewSize = "sm" | "md";

export function Button({
  label,
  href = "#",
  variant = "primary",
  size = "sm",
  className = "",
  target,
  rel,
  as = "a",
}: {
  label: string;
  href?: string;
  variant?: Variant;
  size?: ViewSize;
  className?: string;
  target?: string;
  rel?: string;
  /** Render as a plain (non-link) element — use when nesting inside an outer <a>. */
  as?: "a" | "span";
}) {
  if (variant === "link") {
    const LinkTag = as === "span" ? m.span : isExternalHref(href) ? m.a : MotionLink;
    return (
      <LinkTag
        {...(as === "a" ? { href, target, rel } : {})}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        animate="rest"
        className={`inline-flex items-center gap-2xs d-2xs text-text-primary-highlight transition-colors hover:text-text-primary-hover md:gap-xs md:d-xs ${className}`}
      >
        <span>{label}</span>
        <m.span
          variants={arrowVariants}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex shrink-0"
        >
          <ArrowUpRight className="size-xl md:size-2xl lg:size-3xl" />
        </m.span>
      </LinkTag>
    );
  }

  if (variant === "view") {
    const viewText = size === "md" ? "b-sm lg:b-md" : "b-xs lg:b-sm";
    const viewGap  = size === "md" ? "gap-xs" : "gap-3xs md:gap-2xs lg:gap-3xs";
    const arrowSize = size === "md" ? "size-xl" : "size-md md:size-lg";
    const ViewTag = as === "span" ? m.span : isExternalHref(href) ? m.a : MotionLink;
    return (
      <ViewTag
        {...(as === "a" ? { href } : {})}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        animate="rest"
        className={`inline-flex items-center ${viewGap} ${viewText} text-text-primary transition-colors hover:text-text-primary-hover ${className}`}
      >
        <span className="[text-box:trim-both_cap_alphabetic]">{label}</span>
        <m.span
          variants={arrowVariantsRight}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex shrink-0"
        >
          <ArrowRight className={arrowSize} />
        </m.span>
      </ViewTag>
    );
  }

  // primary
  const PrimaryTag = isExternalHref(href) ? m.a : MotionLink;
  return (
    <PrimaryTag
      href={href}
      initial="rest"
      whileHover="hover"
      whileTap="press"
      animate="rest"
      variants={primaryScaleVariants}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative inline-flex items-center gap-xs overflow-hidden rounded-full pl-xl pr-lg py-sm b-xs text-text-inverted md:gap-sm md:pl-2xl md:pr-xl md:py-md md:b-sm lg:pl-3xl lg:pr-2xl lg:py-md lg:b-md ${className}`}
      style={{
        boxShadow:
          "0 10px 10px -10px var(--shadows-shadow-01), 0 10px 30px 1px var(--shadows-shadow-02)",
      }}
    >
      <span aria-hidden className="absolute inset-0 rounded-full bg-component-bg-button-primary" />
      <m.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-white"
        variants={primaryWhiteOverlayVariants}
        transition={{ duration: 0.25 }}
      />
      {/* Pressed-state tint — mobile tap feedback (also fires on mouse-down) */}
      <m.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-black"
        variants={primaryPressTintVariants}
        transition={{ duration: 0.15 }}
      />
      <span className="relative whitespace-nowrap">{label}</span>
      <m.span
        variants={arrowVariantsRight}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative inline-flex shrink-0"
      >
        <ArrowRight className="size-lg md:size-xl lg:size-2xl" />
      </m.span>
      {/* Glow overlay — tightens and brightens on hover */}
      <m.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow:
            "inset 0 -4px 15px 0 var(--shadows-glow-01), inset 0 2px 15px 2px var(--shadows-glow-01)",
        }}
        transition={{ duration: 0.25 }}
      />
    </PrimaryTag>
  );
}
