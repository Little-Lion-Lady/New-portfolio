import type { ReactNode } from "react";

// Figma "Key paragraph" (278:30153 / 430:16062). A stacked text block:
//   optional label line   — text-tertiary caption above the lead (§06 "What broke")
//   optional lead line   — text-primary-highlight (#0f1117), the dark opener
//   body paragraph(s)    — text-secondary, may contain text-highlight-dark spans
// Label keeps B-md on desktop (16/20/24); lead and body are B-xs→B-sm→B-sm
// (16/20/20). The lines stack at gap 0 —
// Figma "Key paragraph" holds B-sm from tablet up and lets line height do the
// spacing (it was B-md 24 with a 12/16 gap under cap trim).
export function KeyParagraph({
  label,
  lead,
  leadTone = "highlight",
  children,
  className = "",
}: {
  label?: ReactNode;
  lead?: ReactNode;
  /**
   * Lead colour. Most instances use text-primary-highlight (#0f1117); a few
   * section openers are drawn in text-primary (#3b414e) instead, and the Basis
   * §03 vision quote is text-highlight-dark.
   */
  leadTone?: "highlight" | "primary" | "accent";
  children: ReactNode;
  className?: string;
}) {
  const leadClass =
    leadTone === "primary"
      ? "text-text-primary"
      : leadTone === "accent"
        ? "text-text-highlight-dark"
        : "text-text-primary-highlight";
  return (
    <div className={`flex flex-col items-start ${className}`}>
      {label && (
        <p className="b-xs text-text-tertiary md:b-sm lg:b-md">{label}</p>
      )}
      {lead && (
        <p className={`b-xs md:b-sm ${leadClass}`}>{lead}</p>
      )}
      <p className="b-xs text-text-secondary md:b-sm">{children}</p>
    </div>
  );
}
