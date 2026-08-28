// Figma "Hypothesis success container" (547:13726). Two axes: Breakpoint × Size.
// Three parts: mono label (H1/H2) · "We believe / Because" · "Success metric".
//   mobile  — stacked (flex-col)
//   tablet  — 9-col grid: label c1 · statements c2-6 · metric c7-8
//   desktop — 12-col grid: label c1-2 · statements c3-7 · metric c9-11
// Column spans are identical in both sizes; Size only moves the type scale and
// the two gaps, one step down each:
//                     label            body             statements gap   metric pad (mobile)
//   md (547:13725)    B-sm→B-sm→B-md   B-xs→B-xs→B-sm   md→md→lg          md (16)
//   sm (1670:4220)    B-xs→B-xs→B-sm   B-2xs→B-2xs→B-xs sm→sm→md          sm (12)
// Label is text-tertiary. "We believe"/"Because"/"Success metric" headers are
// text-primary-highlight; bodies text-secondary. Header→body stacks sit at gap 0
// under standard trim.
export function Hypothesis({
  label,
  believe,
  because,
  metric,
  size = "md",
}: {
  label: string;
  believe: string;
  because: string;
  metric: string;
  size?: "md" | "sm";
}) {
  const isSm = size === "sm";
  const labelClass = isSm ? "b-xs lg:b-sm" : "b-sm lg:b-md";
  const bodyClass = isSm ? "b-2xs lg:b-xs" : "b-xs lg:b-sm";
  const statementsGap = isSm ? "gap-sm lg:gap-md" : "gap-md lg:gap-lg";
  const metricPad = isSm ? "pt-sm md:pt-0" : "pt-md md:pt-0";

  return (
    <div className="flex flex-col gap-xs md:grid md:grid-cols-9 md:gap-lg lg:grid-cols-12">
      <p
        className={`${labelClass} uppercase text-text-tertiary md:col-start-1 md:col-span-1 lg:col-span-2`}
      >
        {label}
      </p>

      {/* We believe / Because */}
      <div
        className={`flex flex-col ${statementsGap} md:col-start-2 md:col-span-5 lg:col-start-3 lg:col-span-5`}
      >
        <div className="flex flex-col">
          <p className={`${bodyClass} text-text-primary-highlight`}>We believe</p>
          <p className={`${bodyClass} text-text-secondary`}>{believe}</p>
        </div>
        <div className="flex flex-col">
          <p className={`${bodyClass} text-text-primary-highlight`}>Because</p>
          <p className={`${bodyClass} text-text-secondary`}>{because}</p>
        </div>
      </div>

      {/* Success metric */}
      <div
        className={`flex flex-col ${metricPad} md:col-start-7 md:col-span-2 lg:col-start-9 lg:col-span-3`}
      >
        <p className={`${bodyClass} text-text-primary-highlight`}>Success metric</p>
        <p className={`${bodyClass} text-text-secondary`}>{metric}</p>
      </div>
    </div>
  );
}
