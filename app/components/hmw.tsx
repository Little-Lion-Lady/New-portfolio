import type { ReactNode } from "react";

// Figma "Header container / row 1" (COVID 1629:140118 · Basis 1613:139815).
// One How-Might-We line: the HMW label in text-highlight-dark, then the
// question in text-secondary, separated by a 4px space. Figma draws it as a
// flex row, but the question never wraps past the label in any frame, so an
// inline span keeps the same result without the indent a row would force.
// `scale` carries the whole line — COVID runs it at the key-paragraph ramp
// (B-xs→B-sm→B-md), Basis holds it at B-sm from tablet up in its narrower
// column. `stackLabel` puts the label on its own line, which is how COVID
// draws it on mobile (1144:10588).
export function Hmw({
  children,
  scale = "b-xs md:b-sm",
  stackLabel = false,
  className = "",
}: {
  children: ReactNode;
  scale?: string;
  stackLabel?: boolean;
  className?: string;
}) {
  return (
    <p className={`${scale} text-text-secondary ${className}`}>
      <span
        className={`text-text-highlight-dark ${stackLabel ? "block md:inline" : ""}`}
      >
        HMW{" "}
      </span>
      {children}
    </p>
  );
}
