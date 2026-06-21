import Link from "next/link";
import { ArrowUpRight } from "./icons";

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
      <Link
        href={href}
        className={`inline-flex items-center gap-xs d-2xs text-text-primary-highlight transition-colors hover:text-text-primary-hover md:gap-sm md:d-xs ${className}`}
      >
        <span>{label}</span>
        <ArrowUpRight className="size-lg shrink-0 md:size-xl lg:size-2xl" />
      </Link>
    );
  }
  if (variant === "view") {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-3xs m-xs uppercase text-text-primary transition-colors hover:text-text-primary-hover md:gap-2xs md:m-sm lg:gap-3xs lg:m-md ${className}`}
      >
        <span>{label}</span>
        <ArrowUpRight className="size-lg shrink-0 md:size-xl" />
      </Link>
    );
  }
  // primary
  return (
    <Link
      href={href}
      className={`relative inline-flex items-center gap-xs overflow-hidden rounded-full pl-xl pr-md py-sm b-xs text-text-inverted md:gap-sm md:pl-2xl md:pr-lg md:py-lg md:b-sm lg:pl-3xl lg:pr-xl lg:b-md ${className}`}
      style={{
        boxShadow:
          "0 10px 10px -10px var(--shadows-shadow-01), 0 10px 30px 1px var(--shadows-shadow-02), inset 0 -4px 15px 0 var(--shadows-glow-01), inset 0 2px 15px 2px var(--shadows-glow-01)",
      }}
    >
      <span aria-hidden className="absolute inset-0 rounded-full bg-component-bg-button-primary" />
      <span className="relative whitespace-nowrap">{label}</span>
      <ArrowUpRight className="relative size-xl shrink-0 lg:size-2xl" />
    </Link>
  );
}
