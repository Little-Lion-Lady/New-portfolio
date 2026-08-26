import type { ReactNode } from "react";

// Figma "Column" (393:7160 §02 "Blocker" / 393:15762 §03 "How might we").
// A labelled row: short label + a text block (optional bold title + body).
//   mobile  — stacked (flex-col, gap 0 — standard trim carries the leading)
//   tablet  — 9-col grid: label c1 · text c4-9 (Figma 393:15680)
//   desktop — 12-col grid: label c1-2 · text c3-9
// Label is text-primary-highlight; title text-primary; body text-secondary.
// Text scale B-xs→B-sm→B-md (16/20/24) by default; COVID and First Table use it as
// drawn, Basis holds the whole block at B-sm via textClassName. labelClassName
// overrides the label scale independently
// (e.g. §03 keeps the label at B-sm on desktop).
// Pass `ordered` instead of children for a numbered list (§04 "How might we" HMW
// statements 547:10601) — renders a list-decimal <ol> of text-secondary items.
export function Column({
  label,
  title,
  children,
  ordered,
  labelClassName,
  textClassName,
  className = "",
}: {
  label: string;
  title?: string;
  children?: ReactNode;
  ordered?: string[];
  labelClassName?: string;
  textClassName?: string;
  className?: string;
}) {
  const scale = textClassName ?? "b-xs md:b-sm lg:b-md";
  return (
    <div
      className={`flex flex-col md:grid md:grid-cols-9 md:gap-x-xl lg:grid-cols-12 lg:gap-x-lg ${className}`}
    >
      <p
        className={`${labelClassName ?? scale} text-text-primary-highlight md:col-start-1 md:col-span-1 lg:col-span-2 whitespace-nowrap`}
      >
        {label}
      </p>
      <div className="flex flex-col md:col-start-4 md:col-span-6 lg:col-start-3 lg:col-span-7">
        {title && <p className={`${scale} text-text-primary`}>{title}</p>}
        {ordered ? (
          <ol className={`${scale} flex list-decimal flex-col gap-md pl-xl text-text-secondary md:gap-lg`}>
            {ordered.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        ) : (
          <p className={`${scale} text-text-secondary`}>{children}</p>
        )}
      </div>
    </div>
  );
}
