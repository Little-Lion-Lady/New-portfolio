// Figma §07 "Journey" + "_Step base" (436:16119 desktop / 436:17078 mobile).
// A 4-step timeline. Each step = a dot + connector line, then title + body.
//   mobile  — steps stack vertically; connector is a vertical line beside the text
//   tablet/desktop — steps sit in a 4-col row; connector is a horizontal line above the text
// Dot = 24px filled circle (component-bg-button-primary) with an 8px page-bg centre (ring).
// Title text-primary-highlight, body text-secondary; type B-2xs→B-xs→B-sm.
// Step text stack: 12 / 12 / 16 (Figma _Step base 436:16155).
function StepDot() {
  return (
    <div className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-component-bg-button-primary md:size-[24px]">
      <div className="size-[6px] rounded-full bg-bg-primary md:size-[8px]" />
    </div>
  );
}

function Step({ title, body, isLast = false }: { title: string; body: string; isLast?: boolean }) {
  return (
    <div className="flex gap-md md:flex-col">
      {/* Connector: vertical (mobile) / horizontal (md+) */}
      <div className="flex flex-col items-center gap-xs self-stretch pb-3xs md:w-full md:flex-row md:gap-md">
        <StepDot />
        {!isLast && <div className="w-[var(--size-1)] flex-1 bg-border-highlight md:h-[var(--size-1)] md:w-auto" />}
      </div>
      {/* Text */}
      <div className="flex flex-1 flex-col gap-sm pb-sm pt-4xs md:flex-none md:pb-xl lg:gap-md">
        <p className="b-2xs text-text-primary-highlight md:b-xs lg:b-sm">{title}</p>
        <p className="b-2xs text-text-secondary md:b-xs lg:b-sm">{body}</p>
      </div>
    </div>
  );
}

export function Journey({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <div className="flex flex-col gap-sm md:grid md:grid-flow-col md:auto-cols-fr md:gap-md lg:gap-lg">
      {steps.map((s, i) => (
        <Step key={i} title={s.title} body={s.body} isLast={i === steps.length - 1} />
      ))}
    </div>
  );
}
