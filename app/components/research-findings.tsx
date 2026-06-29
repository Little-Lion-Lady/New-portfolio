// Figma §03 "Research" method block (mobile 547:10541 / tablet 547:7337 / desktop 495:4088).
// Repeats once per research method. Three parts:
//   header       — method name, B-md text-secondary (sentence case, not mono)
//   findings     — primary finding (text-primary-highlight) + secondary (text-secondary), B-sm
//   implication  — "Design implication" label (highlight) + body (secondary), B-sm
// Layout: mobile + tablet STACK (gap-2xl/32); desktop is a 12-col grid —
//   method col 1-3 · findings col 4-8 (span-5) · implication col 10-12.
// Type does NOT scale across breakpoints (header B-md, body B-sm everywhere). Inner
// gap within the finding/implication blocks is lg (20).
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
    <div className="flex w-full flex-col gap-2xl lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-lg lg:gap-y-0">
      <p className="b-md text-text-secondary lg:col-start-1 lg:col-span-3">{method}</p>

      <div className="flex flex-col gap-lg lg:col-start-4 lg:col-span-5">
        <p className="b-sm text-text-primary-highlight">{primary}</p>
        <p className="b-sm text-text-secondary">{secondary}</p>
      </div>

      <div className="flex flex-col gap-lg lg:col-start-10 lg:col-span-3">
        <p className="b-sm text-text-primary-highlight">Design implication</p>
        <p className="b-sm text-text-secondary">{implication}</p>
      </div>
    </div>
  );
}
