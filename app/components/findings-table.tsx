import { Fragment } from "react";
import { Divider } from "./divider";

// Figma §04 "Header" (100:6144) + "List"/"Row" (100:6153). A Finding → Design decision table.
//   mobile  — each row stacks: finding · ↓ · decision (header shows "Finding" only)
//   tablet/desktop — 12-col grid: finding c1-5 · arrow c6-7 · decision c8-12
// Header text is text-primary-highlight (B-xs→B-sm→B-md); row text is text-secondary
// (B-xs→B-xs→B-sm); arrow is text-tertiary. Rows separated by dividers (gap-xl).
export function FindingsTable({
  rows,
}: {
  rows: { finding: string; decision: string }[];
}) {
  return (
    <div className="flex flex-col gap-2xl lg:gap-3xl">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-lg">
        <p className="b-xs text-text-primary-highlight md:col-span-5 md:b-sm lg:b-md">
          Finding
        </p>
        <p className="hidden text-text-primary-highlight md:col-start-8 md:col-span-5 md:block md:b-sm lg:b-md">
          Design decision
        </p>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-xl">
        {rows.map((row, i) => (
          <Fragment key={i}>
            <div className="grid grid-cols-1 gap-lg md:grid-cols-12 md:gap-x-lg md:gap-y-0">
              <p className="b-xs text-text-secondary md:col-span-5 lg:b-sm">
                {row.finding}
              </p>
              <p className="b-xs text-text-tertiary md:col-start-6 md:col-span-2 md:text-center lg:b-sm">
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </p>
              <p className="b-xs text-text-secondary md:col-start-8 md:col-span-5 lg:b-sm">
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
