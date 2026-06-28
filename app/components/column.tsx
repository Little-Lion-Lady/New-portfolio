import type { ReactNode } from "react";

// Figma "Column" (393:7160 §02 "Blocker" / 393:15762 §03 "How might we").
// A labelled row: short label + a text block (optional bold title + body).
//   mobile  — stacked (flex-col, gap-lg)
//   tablet  — 9-col grid: label c1 · text c3-9
//   desktop — 12-col grid: label c1-2 · text c3-9
// Label is text-primary-highlight; title text-primary; body text-secondary.
// Text scale B-xs→B-sm→B-md (16/20/24); labelClassName overrides the label scale
// (e.g. §03 keeps the label at B-sm on desktop).
export function Column({
  label,
  title,
  children,
  labelClassName,
  className = "",
}: {
  label: string;
  title?: string;
  children: ReactNode;
  labelClassName?: string;
  className?: string;
}) {
  const scale = "b-xs md:b-sm lg:b-md";
  return (
    <div
      className={`flex flex-col gap-lg md:grid md:grid-cols-9 md:gap-x-xl lg:grid-cols-12 lg:gap-x-lg ${className}`}
    >
      <p
        className={`${labelClassName ?? scale} text-text-primary-highlight md:col-start-1 md:col-span-1 lg:col-span-2`}
      >
        {label}
      </p>
      <div className="flex flex-col gap-md md:col-start-3 md:col-span-7 md:gap-xl lg:col-start-3 lg:col-span-7 lg:gap-2xl">
        {title && <p className={`${scale} text-text-primary`}>{title}</p>}
        <p className={`${scale} text-text-secondary`}>{children}</p>
      </div>
    </div>
  );
}
