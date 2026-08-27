import { KeyParagraph } from "./key-paragraph";

// Figma Basis §04 "Research" method block (mobile 1144:13046 / tablet 1144:11882 /
// desktop 1144:10716). Repeats once per research method. Three parts:
//   method       — the method name, text-highlight-dark (NOT secondary), B-xs→B-sm
//   findings     — primary finding (text-primary-highlight) + secondary (text-secondary)
//   implication  — "Design implication" label + body
// Both the findings and the implication are Figma "Key paragraph" instances, so
// they stack at gap 0 and run B-xs→B-sm→B-sm (1613:139321) — these rows hold
// B-sm on desktop instead of taking the component's step up to B-md.
// Layout: mobile stacks at spacing-xs (8), tablet at spacing-sm (12); desktop is a
// 12-col grid — method col 1-3 · findings col 4-8 · implication col 10-12.
export function ResearchFindings({
  method,
  primary,
  secondary,
  implication,
}: {
  method: string;
  primary: string;
  secondary: string;
  implication: string;
}) {
  return (
    <div className="flex w-full flex-col gap-xs md:gap-sm lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-lg lg:gap-y-0">
      <p className="b-xs text-text-highlight-dark md:b-sm lg:col-start-1 lg:col-span-3">{method}</p>

      <KeyParagraph lead={primary} scale="b-xs md:b-sm" className="lg:col-start-4 lg:col-span-5">
        {secondary}
      </KeyParagraph>

      <KeyParagraph lead="Design implication" scale="b-xs md:b-sm" className="lg:col-start-10 lg:col-span-3">
        {implication}
      </KeyParagraph>
    </div>
  );
}
