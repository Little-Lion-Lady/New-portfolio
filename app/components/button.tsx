"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ArrowUpRightSmall } from "./icons";

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

// "view" links only — the primary pill's arrow stays put (its own scale carries
// the hover), so this deliberately isn't shared with it.
const viewArrowVariants = {
  rest: { x: 0 },
  hover: { x: 4 },
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

// Multi-colour hover halo. It grows from scaleY(0.9), so the light blooms
// outwards from the pill's centre line rather than just fading in. The hue
// cycle itself is CSS (.button-glow / @keyframes button-glow-hue in
// globals.css) — a filter animation, so it stays off the main thread.
const primaryGlowVariants = {
  rest: { opacity: 0, scaleY: 0.9 },
  hover: { opacity: 1, scaleY: 1 },
  press: { opacity: 1, scaleY: 1 },
};

// Hand-tuned drop shadows, one per colour, in Figma order: x / y / blur /
// spread. Not a generated ramp — the offsets are not monotonic (04 sits above
// 03) and the blurs jump around, both on purpose, so resist "tidying" them into
// a sequence. 06 is the wide bloom that carries the halo out into the page; its
// 124px blur is why the pill can no longer clip its overflow.
const primaryGlowShadow = [
  "0 1px 3.8px 1px var(--button-glow-01)",
  "0 5px 2.5px -1px var(--button-glow-02)",
  "0 10px 5px -3px var(--button-glow-03)",
  "0 8px 4px -3px var(--button-glow-04)",
  "0 11px 14.3px -2px var(--button-glow-05)",
  "0 22px 124px -5px var(--button-glow-06)",
].join(", ");

// Figma "Button" component. Three variants × three breakpoints (mobile/tablet/desktop):
//   primary (Type=Button, Size=lg) — filled pill, text-inverted
//   link    (Type=Link,   Size=lg) — oversized text link (footer socials), text-primary-highlight
//   view    (Type=Link,   Size=sm) — mono uppercase inline link ("View"), text-primary
// Every size/gap/padding/colour below is taken from the Figma component spec,
// except the primary pill: its label, padding and arrow each sit one step below
// Figma's Size=lg spec at every breakpoint, so the pill reads lighter next to
// the body copy. Its left and right padding stay level with each other (the
// trailing arrow would otherwise crowd the right edge).
// Labels run at --font-weight-book (460) across all three variants — the type
// utilities set 400/500 at each breakpoint, so it needs `!` to win at lg.
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
  external = false,
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
  /** Primary variant only — swaps the arrow icon/motion to the diagonal "external link" style used by the link variant. */
  external?: boolean;
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
        className={`inline-flex items-center gap-xs d-2xs [font-weight:var(--font-weight-book)]! text-text-primary-highlight transition-colors hover:text-text-primary-hover md:gap-sm md:d-xs ${className}`}
      >
        <span>{label}</span>
        <m.span
          variants={arrowVariants}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex shrink-0"
        >
          <ArrowUpRight className="size-2xl lg:size-3xl" />
        </m.span>
      </LinkTag>
    );
  }

  if (variant === "view") {
    const viewText = size === "md" ? "b-sm lg:b-md" : "b-xs lg:b-sm";
    const viewGap  = size === "md" ? "gap-xs" : "gap-4xs lg:gap-3xs";
    const arrowSize = size === "md" ? "size-lg" : "size-md md:size-lg";
    const ViewTag = as === "span" ? m.span : isExternalHref(href) ? m.a : MotionLink;
    return (
      <ViewTag
        {...(as === "a" ? { href } : {})}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        animate="rest"
        className={`inline-flex items-center ${viewGap} ${viewText} [font-weight:var(--font-weight-book)]! text-text-primary transition-colors hover:text-text-primary-hover ${className}`}
      >
        <span>{label}</span>
        <m.span
          variants={viewArrowVariants}
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
      target={target}
      rel={rel}
      initial="rest"
      whileHover="hover"
      whileTap="press"
      animate="rest"
      variants={primaryScaleVariants}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={`button-glow-host relative isolate inline-flex items-center gap-2xs rounded-full pl-lg pr-lg py-xs b-2xs text-text-inverted md:gap-xs md:pl-xl md:pr-xl md:py-sm md:b-xs lg:gap-2xs lg:pl-2xl lg:pr-2xl lg:py-sm lg:b-sm [font-weight:var(--font-weight-book)]! ${className}`}
      style={{
        boxShadow:
          "0 10px 10px -10px var(--shadows-shadow-01), 0 10px 30px 1px var(--shadows-shadow-02)",
      }}
    >
      {/* Stacked colour halo — sits behind the pill fill (hence -z-10, and why
          the pill no longer clips its overflow). Its own background keeps the
          shadows from showing a gap at the rim. */}
      <m.span
        aria-hidden
        className="button-glow pointer-events-none absolute inset-0 -z-10 rounded-full bg-[var(--button-glow-01)]"
        style={{ boxShadow: primaryGlowShadow }}
        variants={primaryGlowVariants}
        transition={{
          opacity: { duration: 0.2, ease: "linear" },
          scaleY: { duration: 0.4, ease: [0.2, 0.715, 0.205, 0.99] },
        }}
      />
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
      {external ? (
        <span className="relative inline-flex shrink-0">
          <ArrowUpRightSmall className="size-md md:size-lg" />
        </span>
      ) : (
        <span className="relative inline-flex shrink-0">
          <ArrowRight className="size-md md:size-lg" />
        </span>
      )}
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
