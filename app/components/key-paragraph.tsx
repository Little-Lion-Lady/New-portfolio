import type { ReactNode } from "react";

// Figma "Key paragraph" (278:30153 / 430:16062). A stacked text block:
//   optional lead line   — text-primary-highlight (#0f1117), the dark opener
//   body paragraph(s)    — text-secondary, may contain text-highlight-dark spans
// Responsive body scale B-xs→B-sm→B-md (16/20/24); inter-line gap md→lg (16/20).
export function KeyParagraph({
  lead,
  children,
  className = "",
}: {
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-start gap-md md:gap-lg ${className}`}>
      {lead && (
        <p className="b-xs text-text-primary-highlight md:b-sm lg:b-md">{lead}</p>
      )}
      <p className="b-xs text-text-secondary md:b-sm lg:b-md">{children}</p>
    </div>
  );
}
