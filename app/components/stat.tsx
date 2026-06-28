import type { ReactNode } from "react";

// Figma "Stat container" (393:7120) + "Stats" row. A big number + caption.
// Two size scales (number / label) per breakpoint, from resolved tokens:
//   lg (§01 Problem, §02 Approach)  number B-lg→D-xs→D-sm (32/44/60) · label B-xs→B-xs→B-sm
//   sm (§05 Validation, §06 Outcome) number B-md→B-lg→D-xs (24/32/44) · label B-xs (16)
// Number colour: text-primary by default, text-highlight-dark for the red "alert" variant.
// Label is always text-tertiary. Number→label gap = 2xs→sm→md (6/12/16).
// Before→after values are passed inline as the value string, e.g. "18% → 5.3%".
export function Stat({
  value,
  label,
  size = "lg",
  highlight = false,
  className = "",
}: {
  value: ReactNode;
  label: string;
  size?: "lg" | "sm";
  highlight?: boolean;
  className?: string;
}) {
  const numberClass =
    size === "lg" ? "b-lg md:d-xs lg:d-sm" : "b-md md:b-lg lg:d-xs";
  const labelClass = size === "lg" ? "b-xs lg:b-sm" : "b-xs";

  return (
    <div
      className={`flex flex-col justify-center gap-2xs md:gap-sm lg:gap-md ${className}`}
    >
      <p
        className={`${numberClass} ${
          highlight ? "text-text-highlight-dark" : "text-text-primary"
        }`}
      >
        {value}
      </p>
      <p className={`${labelClass} text-text-tertiary`}>{label}</p>
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
