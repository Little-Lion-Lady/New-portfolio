import type { ReactNode } from "react";

// Figma "Key paragraph" (278:30153 / 430:16062). A stacked text block:
//   optional label line   — text-tertiary caption above the lead (§06 "What broke")
//   optional lead line   — text-primary-highlight (#0f1117), the dark opener
//   body paragraph(s)    — text-secondary, may contain text-highlight-dark spans
// Responsive body scale B-xs→B-sm→B-md (16/20/24); inter-line gap sm→md (12/16/16,
// Figma "Key paragraph" 430:16066 Size=md, which shares the cap-trim basis of b-*).
export function KeyParagraph({
  label,
  lead,
  children,
  className = "",
}: {
  label?: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-start gap-sm md:gap-md ${className}`}>
      {label && (
        <p className="b-xs text-text-tertiary md:b-sm lg:b-md">{label}</p>
      )}
      {lead && (
        <p className="b-xs text-text-primary-highlight md:b-sm lg:b-md">{lead}</p>
      )}
      <p className="b-xs text-text-secondary md:b-sm lg:b-md">{children}</p>
    </div>
  );
}
