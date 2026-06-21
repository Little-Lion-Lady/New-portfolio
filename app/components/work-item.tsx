import type { ReactNode } from "react";
import { Button } from "./button";

// Figma "Work item" component.
// Layout per breakpoint:
//   mobile  — flex-col, gap-lg; number+name share a row, then desc/roles/View stacked
//   tablet  — 9-col grid (number c1, name c2-3, desc c5-9 with View inside)
//   desktop — 12-col grid (number c1, name c3-4, desc c6-11, View standalone c12)
// Type scales: number/name B-xs→B-sm→B-md; desc/roles/View M-xs→M-sm→M-md.
// Image carousel: 3 equal slots, h-400, rounded-12, bg-inverse (placeholders).
export function WorkItem({
  number,
  name,
  description,
  roles,
  href = "#",
}: {
  number: string;
  name: ReactNode;
  description: string;
  roles: string;
  href?: string;
}) {
  return (
    <article className="flex w-full flex-col items-center gap-lg md:gap-2xl lg:gap-4xl">
      {/* Text container: stack (mobile) → 9-col grid (tablet) → 12-col grid (desktop) */}
      <div className="flex w-full flex-col gap-lg md:grid md:grid-cols-9 md:items-start md:gap-lg lg:grid-cols-12">
        {/* number + name — one row on mobile; individual grid cells on md+ (via contents) */}
        <div className="flex items-center gap-xl md:contents">
          <p className="b-xs text-text-primary md:col-start-1 md:b-sm lg:b-md">{number}</p>
          <p className="flex-1 b-xs text-text-primary md:col-start-2 md:col-span-2 md:whitespace-nowrap md:b-sm lg:col-start-3 lg:whitespace-normal lg:b-md">
            {name}
          </p>
        </div>

        {/* description block — holds desc + roles, and the View link on mobile/tablet */}
        <div className="flex flex-col gap-lg md:col-start-5 md:col-span-5 lg:col-start-6 lg:col-span-6 lg:gap-md">
          <p className="m-xs uppercase text-text-primary md:m-sm lg:m-md">{description}</p>
          <p className="m-xs uppercase text-text-tertiary text-right md:m-sm md:text-left lg:m-md">{roles}</p>
          {/* View — wrapper controls visibility so it doesn't fight Button's display */}
          <div className="w-full lg:hidden">
            <Button variant="view" label="View" href={href} />
          </div>
        </div>

        {/* View — standalone column on desktop only */}
        <div className="hidden lg:col-start-12 lg:flex lg:justify-self-end">
          <Button variant="view" label="View" href={href} />
        </div>
      </div>

      {/* Image carousel — equal placeholder slots (bg-inverse). NOTE: Figma is a
          fixed 1936px strip that bleeds past the content width (a peek/scroll
          carousel); implement that with the real images + scroll interaction. */}
      <div className="flex w-full items-start gap-xs">
        <div className="h-[400px] flex-1 rounded-[var(--size-6)] bg-bg-inverse" />
        <div className="h-[400px] flex-1 rounded-[var(--size-6)] bg-bg-inverse" />
        <div className="h-[400px] flex-1 rounded-[var(--size-6)] bg-bg-inverse" />
      </div>
    </article>
  );
}
