import type { ReactNode } from "react";

// Figma §05 "Process" option columns (547:10653/10657/10661) + "Chosen" tag (547:10665).
// Each option is a stacked block: label (text-tertiary) · title (text-primary-highlight) ·
// body (text-secondary), gap-lg. The chosen path carries a solid red "Chosen" badge
// (bg-text-highlight-dark, text-bg-primary, p-xs, no radius) pinned to its top-right.
// Text scale B-xs→B-sm→B-md, matching the other body columns.
export function OptionCard({
  label,
  title,
  children,
  chosen = false,
}: {
  label: string;
  title: string;
  children: ReactNode;
  chosen?: boolean;
}) {
  const scale = "b-xs md:b-sm lg:b-md";
  return (
    <div className="relative flex flex-col gap-lg">
      {chosen && (
        <span className="absolute right-0 top-0 z-10 flex items-center justify-center bg-text-highlight-dark p-xs text-bg-primary">
          <span className="b-xs md:b-sm">Chosen</span>
        </span>
      )}
      <p className={`${scale} text-text-tertiary`}>{label}</p>
      <p className={`${scale} text-text-primary-highlight`}>{title}</p>
      <p className={`${scale} text-text-secondary`}>{children}</p>
    </div>
  );
}

// Option cards row — stacks on mobile (gap-3xl/40), 3-up grid from tablet (gap-lg/20).
export function OptionCards({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3xl md:grid md:grid-cols-3 md:gap-lg">
      {children}
    </div>
  );
}
