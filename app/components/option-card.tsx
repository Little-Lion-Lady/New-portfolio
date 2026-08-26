import type { ReactNode } from "react";

// Figma Basis §06 "Process" option columns (mobile 1523:63206 / tablet 1144:11953 /
// desktop 1144:10787) + the "Chosen" tag.
//
// Each option is a label above a Figma "Key paragraph": the label is text-tertiary
// and steps up to B-sm on desktop, while the title/body pair inside the key
// paragraph stays B-xs at every breakpoint and stacks at gap 0 (line height does
// the spacing). Label → pair is spacing-xs (8) until desktop, where it opens to
// spacing-lg (20); desktop also pads each column 20 on the right.
//
// The tag is a solid red chip pinned to the column's top-right —
// bg-text-highlight-dark, text-bg-primary, 8px of horizontal padding and none
// vertical (its height is the text's own line box), no radius.
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
  return (
    <div className="relative flex flex-col gap-xs lg:gap-lg lg:pr-lg">
      {chosen && (
        <span className="absolute right-0 top-0 z-10 flex items-center justify-center bg-text-highlight-dark px-xs text-bg-primary">
          <span className="b-xs lg:b-sm">Chosen</span>
        </span>
      )}
      <p className="b-xs text-text-tertiary lg:b-sm">{label}</p>
      {/* Figma "Key paragraph" — gap 0, B-xs throughout. */}
      <div className="flex flex-col">
        <p className="b-xs text-text-primary-highlight">{title}</p>
        <p className="b-xs text-text-secondary">{children}</p>
      </div>
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
