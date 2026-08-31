import { Fragment } from "react";
import { Divider } from "./divider";

// Figma §04 "Header" (100:6144) + "List"/"Row" (100:6153). A Finding → Design decision table.
//   mobile  — each row stacks: finding · ↓ · decision (header shows "Finding" only)
//   tablet  — 9-col grid:  finding c1-4 · arrow c5   · decision c6-9
//   desktop — 12-col grid: finding c1-5 · arrow c6-7 · decision c8-12
// Header text is text-primary-highlight (B-xs→B-xs→B-md — tablet matches mobile);
// row text is text-secondary
// (B-xs→B-xs→B-sm); arrow is text-tertiary. Rows separated by dividers.
// Spacing per Figma 1512:7124 (desktop) / 1512:7125 (tablet), which agree:
// "Section wrapper" gaps at 20 (--sm), "List" at 16 (--xs), and the list carries
// 40 (--md) of bottom padding. "Row" stacks at 0 on mobile. Mobile's bottom
// padding is left at 24 — no mobile frame was given to check it against.
// Column headings default to the COVID Tracer §04 wording; First Table §04 relabels
// them "Friction point" / "Solution".
// `mobileLabel` covers the one-column mobile layout: the decision heading is
// hidden there, so a single finding-only heading leaves the second half of each
// row unlabelled. Pass a combined heading to name both.
export function FindingsTable({
  rows,
  findingLabel = "Finding",
  decisionLabel = "Design decision",
  mobileLabel,
  headerClassName = "b-xs lg:b-md",
}: {
  rows: { finding: string; decision: string }[];
  findingLabel?: string;
  decisionLabel?: string;
  /** Heading shown below md, where the decision column's heading is hidden. */
  mobileLabel?: string;
  headerClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-lg">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-9 md:gap-x-lg lg:grid-cols-12">
        <p className={`${headerClassName} text-text-primary-highlight md:col-span-4 lg:col-span-5`}>
          <span className="md:hidden">{mobileLabel ?? findingLabel}</span>
          <span className="hidden md:inline">{findingLabel}</span>
        </p>
        <p className={`hidden text-text-primary-highlight md:col-start-6 md:col-span-4 md:block lg:col-start-8 lg:col-span-5 ${headerClassName}`}>
          {decisionLabel}
        </p>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-md pb-xl md:pb-3xl">
        {rows.map((row, i) => (
          <Fragment key={i}>
            <div className="grid grid-cols-1 md:grid-cols-9 md:gap-x-lg md:gap-y-0 lg:grid-cols-12">
              <p className="b-xs text-text-secondary md:col-span-4 lg:col-span-5 lg:b-sm">
                {row.finding}
              </p>
              <p className="b-xs text-text-tertiary md:col-start-5 md:col-span-1 md:text-center lg:col-start-6 lg:col-span-2 lg:b-sm">
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </p>
              <p className="b-xs text-text-secondary md:col-start-6 md:col-span-4 lg:col-start-8 lg:col-span-5 lg:b-sm">
                {row.decision}
              </p>
            </div>
            {i < rows.length - 1 && <Divider />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
