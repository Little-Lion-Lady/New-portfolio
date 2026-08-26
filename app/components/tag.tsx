import type { ReactNode } from "react";

// Figma "Tag" pill (§01 Problem constraints 547:26291 / §05 Process "Deferred to V2" 547:26392).
// A bordered, fully-rounded pill with a centered label.
//   default  — body text, sentence case (problem constraints)
//   deferred — uppercase + line-through (V2 backlog items)
// Padding per Figma "Content" (547:26283): px 16/24/24, py 4/6/8. Border is
// border-primary, radius full (Figma 56px, taller than the pill). Text is
// text-secondary at B-xs through tablet, B-sm on desktop.
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
          deferred ? "line-through" : "lg:b-sm"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

// Tag group — a flex-wrap row of pills with an optional label above the row
// ("Deferred to V2", text-tertiary). Wrap gap defaults to xs; override via className.
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
      {label && <p className="b-xs uppercase text-text-tertiary">{label}</p>}
      <div className={`flex ${className}`}>{children}</div>
    </div>
  );
}
