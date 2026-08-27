import type { ReactNode } from "react";
import { HighlightPill } from "./tag";

// Figma Basis §05 "Process" option columns (mobile 1144:13092 / tablet
// 1144:11951 / desktop 1613:139357) + the "Chosen" tag.
//
// Each option is a label above a Figma "Key paragraph". The whole column runs
// B-xs at every breakpoint — label included — and the title/body pair inside
// the key paragraph stacks at gap 0, letting line height do the spacing.
// Label → pair is spacing-xs (8) until desktop, where it closes to spacing-2xs
// (6); desktop also pads the first two columns 20 on the right.
//
// The "Chosen" tag rides on the label line of the option it marks — see
// HighlightPill, which the About collage labels share.
export function OptionCard({
  label,
  title,
  children,
  chosen = false,
  className = "",
}: {
  label: string;
  title: string;
  children: ReactNode;
  chosen?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-xs lg:gap-2xs ${className}`}>
      <p className="b-xs flex items-center gap-sm text-text-tertiary">
        {label}
        {chosen && <HighlightPill>Chosen</HighlightPill>}
      </p>
      {/* Figma "Key paragraph" — gap 0, B-xs throughout. */}
      <div className="flex flex-col">
        <p className="b-xs text-text-primary-highlight">{title}</p>
        <p className="b-xs text-text-secondary">{children}</p>
      </div>
    </div>
  );
}

// Option cards row — stacks on mobile (gap-lg/20), 3-up from tablet (gap-lg/20).
// Desktop pads the first two columns on the right so the third can run full
// width against the grid edge (Figma 1613:139358/61 carry pr-20, 1613:139364
// doesn't).
export function OptionCards({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-lg md:grid md:grid-cols-3 md:gap-lg lg:[&>*:not(:last-child)]:pr-lg">
      {children}
    </div>
  );
}
