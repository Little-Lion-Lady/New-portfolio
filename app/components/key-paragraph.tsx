import type { ReactNode } from "react";

// Figma "Key paragraph" (278:30153 / 430:16062). A stacked text block:
//   optional label line   — text-tertiary caption above the lead (§06 "What broke")
//   optional lead line   — text-primary-highlight (#0f0f0f), the dark opener
//   body paragraph(s)    — text-secondary, may contain text-highlight-dark spans
// Label, lead and body all run B-xs→B-sm→B-md (16/26, 20/32, 24/36 — Figma
// 741:6868/741:6869). The lines stack at gap 0 and let the line box do the
// spacing rather than carrying a gap of their own. `scale` overrides that ramp
// for the instances Figma holds smaller — Basis keeps its research rows and
// design principles at B-sm rather than stepping up on desktop.
export function KeyParagraph({
  label,
  lead,
  leadTone = "highlight",
  children,
  scale = "b-xs md:b-sm lg:b-md",
  className = "",
}: {
  label?: ReactNode;
  lead?: ReactNode;
  /**
   * Lead colour. Most instances use text-primary-highlight (#0f0f0f); a few
   * section openers are drawn in text-primary (#3c3c3c) instead, and the Basis
   * §03 vision quote is text-highlight-dark.
   */
  leadTone?: "highlight" | "primary" | "accent";
  children: ReactNode;
  /** Type ramp for label, lead and body. Defaults to B-xs→B-sm→B-md. */
  scale?: string;
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
        <p className={`${scale} text-text-tertiary`}>{label}</p>
      )}
      {lead && (
        <p className={`${scale} ${leadClass}`}>{lead}</p>
      )}
      <p className={`${scale} text-text-secondary`}>{children}</p>
    </div>
  );
}
