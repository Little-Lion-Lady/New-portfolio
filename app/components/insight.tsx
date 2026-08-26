import type { ReactNode } from "react";

// Figma "Insight" (Basis 1144:13077 mobile / 1144:10423 tablet / 1144:10770 desktop).
// A single card — bg-utility-inverses-white (white in light mode, Blue/950 in
// dark), a 1px inset hairline and a 16/20/24 radius — holding the label + body.
//   label  — "Insight", text-primary-overlay (50%)
//   body   — text-primary, centered
// Card padding px 3xl→8xl→9xl (40/128/160), py 4xl→(4xl/5xl)→(6xl/7xl).
// Text B-xs→B-sm→B-md; label→body sits at 4/0/2 (Figma "Text container").
// The outer box carries NO padding: Figma has the text container fill the card
// edge to edge, and the page gap alone (80/72/40) spaces it from its
// neighbours — the old frame inset plus py was adding ~48px per Insight.
export function Insight({
  label = "Insight",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="relative w-full overflow-hidden rounded-md bg-utility-inverses-white md:rounded-lg lg:rounded-xl shadow-[0_2px_20px_var(--shadows-shadow-02)]">
        <div className="flex w-full flex-col items-center gap-3xs px-3xl py-4xl md:gap-none md:px-8xl md:pb-5xl md:pt-4xl lg:gap-4xs lg:px-9xl lg:pb-7xl lg:pt-6xl">
          <p className="b-xs text-text-primary-overlay md:b-sm lg:b-md">{label}</p>
          <p className="b-xs text-center text-text-primary md:b-sm lg:b-md">{children}</p>
        </div>
        {/* Inset ring, not a border — a border would occupy layout space inside
            the zero-padding card and shift the text box by 1px. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--border-overlay)]"
        />
      </div>
    </div>
  );
}
