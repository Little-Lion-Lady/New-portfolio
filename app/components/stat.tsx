import type { ReactNode } from "react";

// Figma "Stat container" (393:7120) + "Stats" row. A big number + caption.
// Sizes (number / label scales per breakpoint, from resolved tokens):
//   lg (§01 Problem, §02 Approach)  number B-lg→D-xs→D-sm (32/44/60) · label B-xs→B-xs→B-sm
//   sm (§05 Validation, §06 Outcome) number B-md→B-lg→D-xs (24/32/44) · label B-xs (16)
//   outcome (Basis §07)             number D-xs→D-sm→D-md (44/60/80; medium on desktop) ·
//                                   label B-xs→B-sm→B-md · sublabel B-2xs→B-sm→B-sm (sentence case)
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
        ? "b-md md:b-lg lg:d-xs"
        : "d-xs md:d-sm lg:d-md";
  const labelClass = size === "outcome" ? "b-xs md:b-sm lg:b-md" : "b-xs lg:b-sm";
  const sublabelClass = size === "outcome" ? "b-2xs md:b-sm" : "b-2xs uppercase";
  // number → label-group gap, and label → sublabel gap
  const outerGap =
    size === "outcome" ? "gap-sm lg:gap-xl" : "gap-xs md:gap-md lg:gap-lg";
  const labelGap = size === "outcome" ? "gap-sm md:gap-md" : "gap-3xs";

  return (
    <div className={`flex flex-col justify-center ${outerGap} ${className}`}>
      <p
        className={`${numberClass} ${
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
