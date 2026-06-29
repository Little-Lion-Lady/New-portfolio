// Figma "Hypothesis success container" (547:13766 desktop / 547:13794 tablet / 547:13869 mobile).
// Three parts: mono label (H1/H2) · "We believe / Because" · "Success metric".
//   mobile  — stacked (flex-col)
//   tablet  — 9-col grid: label c1 · statements c2-6 · metric c7-8
//   desktop — 12-col grid: label c1-2 · statements c3-7 · metric c9-11
// Label is mono uppercase M-sm→M-md, text-tertiary. "We believe"/"Because"/
// "Success metric" headers are text-primary-highlight; bodies text-secondary. Body B-xs→B-sm.
export function Hypothesis({
  label,
  believe,
  because,
  metric,
}: {
  label: string;
  believe: string;
  because: string;
  metric: string;
}) {
  return (
    <div className="flex flex-col gap-xl md:grid md:grid-cols-9 md:gap-lg lg:grid-cols-12">
      <p className="b-xs uppercase text-text-tertiary md:col-start-1 md:col-span-1 md:b-sm lg:col-span-2">
        {label}
      </p>

      {/* We believe / Because */}
      <div className="flex flex-col gap-xl md:col-start-2 md:col-span-5 lg:col-start-3 lg:col-span-5 lg:gap-3xl">
        <div className="flex flex-col gap-sm md:gap-md lg:gap-lg">
          <p className="b-xs text-text-primary-highlight lg:b-sm">We believe</p>
          <p className="b-xs text-text-secondary lg:b-sm">{believe}</p>
        </div>
        <div className="flex flex-col gap-sm md:gap-md lg:gap-lg">
          <p className="b-xs text-text-primary-highlight lg:b-sm">Because</p>
          <p className="b-xs text-text-secondary lg:b-sm">{because}</p>
        </div>
      </div>

      {/* Success metric */}
      <div className="flex flex-col gap-sm md:gap-md pt-md md:col-start-7 md:col-span-2 md:pt-0 lg:col-start-9 lg:col-span-3 lg:gap-lg">
        <p className="b-xs text-text-primary-highlight lg:b-sm">Success metric</p>
        <p className="b-xs text-text-secondary lg:b-sm">{metric}</p>
      </div>
    </div>
  );
}
