import type { ReactNode } from "react";

// Figma "Tag" pill (§01 Problem constraints 547:26291 / §05 Process "Deferred to V2" 547:26392).
// A bordered, fully-rounded pill with a centered label.
//   default  — body text, sentence case (problem constraints)
//   deferred — uppercase + line-through (V2 backlog items)
// Padding per Figma "Content" (547:26283): px 16/24/24, py 4/6/8. Border is
// border-primary, radius full (Figma 56px, taller than the pill). Default text
// is text-secondary at B-xs through tablet, B-sm on desktop; deferred pills are
// drawn in Geist Mono at a flat 16/28 (Figma 1613:139374), so they hold their
// size across every breakpoint.
export function Tag({
  children,
  deferred = false,
}: {
  children: ReactNode;
  deferred?: boolean;
}) {
  return (
    <div className="flex items-center justify-center overflow-clip rounded-full border border-border-primary px-md py-3xs md:px-xl md:py-2xs lg:py-xs">
      <p
        className={`b-xs whitespace-nowrap text-center text-text-secondary ${
          deferred
            ? "font-mono uppercase leading-[28px] line-through"
            : "lg:b-sm"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

// Tag group — a flex-wrap row of pills with an optional label above the row
// ("Deferred to V2"): Geist Mono, uppercase, 16/28, text-tertiary. Label → row
// is spacing-lg (20). Wrap gap defaults to xs; override via className.
export function TagGroup({
  label,
  children,
  className = "flex-wrap gap-xs",
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-lg">
      {label && (
        <p className="b-xs font-mono uppercase leading-[28px] text-text-tertiary">
          {label}
        </p>
      )}
      <div className={`flex ${className}`}>{children}</div>
    </div>
  );
}

// Figma Basis §05 "Chosen" tag (1613:139367). A solid highlight pill —
// bg-text-highlight-dark, text-bg-primary, B-2xs (14/24), 12 of horizontal
// padding and none vertical (its height is the text's own line box), fully
// rounded. Marks the chosen option column on Basis, and labels the two
// About collage cards.
export function HighlightPill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`b-2xs flex items-center justify-center rounded-full bg-text-highlight-dark px-sm text-bg-primary ${className}`}
    >
      {children}
    </span>
  );
}
