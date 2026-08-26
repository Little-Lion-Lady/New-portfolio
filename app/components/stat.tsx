import type { ReactNode } from "react";

// Figma "Stat container" (393:7120) + "Stats" row. A big number + caption.
// Sizes (number / label scales per breakpoint, from resolved tokens):
//   lg (§01 Problem, §02 Approach)  number B-lg→D-xs→D-sm (32/44/60) · label B-xs→B-sm→B-sm
//                                   (Figma "Stat container" 393:15661 Size=md — the variant
//                                    the page compositions instance, not Size=lg)
//   sm (§05 Validation, §06 Outcome) number B-md→B-lg→D-xs (24/32/44) · label B-xs (16)
//   outcome (Basis §08, First Table §07)
//                                   number D-xs→D-xs→D-md (44/44/80; medium on desktop only —
//                                   tablet stays at D-xs regular) · label B-xs→B-xs→B-md ·
//                                   sublabel B-2xs→B-xs→B-sm (sentence case)
// Number colour: text-primary by default. `highlight` is the red "alert" variant
// (text-highlight-dark); `tone` picks a specific token when a section mixes more
// than one (First Table §01 runs primary / highlight / highlight-dark across its
// three stats, §02 uses highlight-subtle throughout).
// Label + sublabel are text-tertiary.
// Optional sublabel (§07 Outcome "Measured over 6-month pilot") — a second caption line.
const TONE_CLASS = {
  primary: "text-text-primary",
  highlight: "text-text-highlight",
  "highlight-dark": "text-text-highlight-dark",
  "highlight-subtle": "text-text-highlight-subtle",
} as const;

export function Stat({
  value,
  label,
  sublabel,
  size = "lg",
  highlight = false,
  tone,
  className = "",
}: {
  value: ReactNode;
  label: string;
  sublabel?: string;
  size?: "lg" | "sm" | "outcome";
  highlight?: boolean;
  tone?: keyof typeof TONE_CLASS;
  className?: string;
}) {
  const numberClass =
    size === "lg"
      ? "b-lg md:d-xs lg:d-sm"
      : size === "sm"
        ? "b-md md:d-2xs lg:d-xs"
        : "d-xs lg:d-md";
  // Figma Size=md labels are B-sm at BOTH tablet and desktop (code had 16/16/20).
  // Figma Size=sm drops to B-2xs (14) on mobile — cap height 10 there vs 11.4 for B-xs.
  const labelClass =
    size === "outcome" ? "b-xs lg:b-md" : size === "lg" ? "b-xs md:b-sm" : "b-2xs md:b-sm";
  const sublabelClass = size === "outcome" ? "b-2xs md:b-xs lg:b-sm" : "b-2xs uppercase";
  // Number → label group sits at gap 0 in every Figma variant: the standard-trim
  // line box already carries the leading that the old 12/16/20 gap was adding on
  // top of the trimmed cap box. The two smaller sizes pull the label back up on
  // mobile, where B-lg (32/48) and B-md (24/36) leave the most slack.
  const numberPull =
    size === "lg" ? "-mb-xs md:mb-0" : size === "sm" ? "-mb-3xs md:mb-0" : "";
  // Label → sublabel gap. Size=md (this component's `lg`) is the one variant
  // Figma steps back down to 12 on desktop rather than holding 16. The outcome
  // variant's Figma "Label container" carries no gap at all — like the number →
  // label join, the trimmed line boxes already supply the separation.
  const labelGap =
    size === "outcome" ? "" : size === "lg" ? "gap-sm md:gap-md lg:gap-sm" : "gap-sm md:gap-md";

  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <p
        className={`${numberClass} ${numberPull} ${
          TONE_CLASS[tone ?? (highlight ? "highlight-dark" : "primary")]
        }`}
      >
        {value}
      </p>
      <div className={`flex flex-col ${labelGap}`}>
        <p className={`${labelClass} text-text-tertiary`}>{label}</p>
        {sublabel && (
          <p className={`${sublabelClass} text-text-tertiary`}>{sublabel}</p>
        )}
      </div>
    </div>
  );
}

// "Stats" row — responsive grid. Column gap = lg (20), row gap = 3xl (40), matching
// Figma's grid (gap-x 20 / gap-y 40). Callers set the column count per section via
// `className` (e.g. "md:grid-cols-3", "md:grid-cols-2 lg:grid-cols-4"); default stacks.
export function Stats({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-x-lg gap-y-3xl ${className}`}>
      {children}
    </div>
  );
}
