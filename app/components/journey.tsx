// Figma §07 "Journey" + "_Step base" (436:16119 desktop / 436:17078 mobile).
// A 4-step timeline. Each step = a dot + connector line, then title + body.
//   mobile  — steps stack vertically; connector is a vertical line beside the text
//   tablet/desktop — steps sit in a 4-col row; connector is a horizontal line above the text
// Dot = 24px filled circle (component-bg-button-primary) with an 8px page-bg centre (ring).
// Title text-primary-highlight, body text-secondary; type B-2xs→B-2xs→B-sm.
function StepDot() {
  return (
    <div className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-component-bg-button-primary">
      <div className="size-[8px] rounded-full bg-bg-primary" />
    </div>
  );
}

function Step({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-md md:flex-col">
      {/* Connector: vertical (mobile) / horizontal (md+) */}
      <div className="flex flex-col items-center gap-3xs self-stretch pb-3xs md:w-full md:flex-row">
        <StepDot />
        <div className="w-[var(--size-1)] flex-1 bg-border-highlight md:h-[var(--size-1)] md:w-auto" />
      </div>
      {/* Text */}
      <div className="flex flex-1 flex-col gap-md pb-sm pt-4xs md:flex-none md:gap-md md:pb-xl">
        <p className="b-2xs text-text-primary-highlight lg:b-sm">{title}</p>
        <p className="b-2xs text-text-secondary lg:b-sm">{body}</p>
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
    <div className="flex flex-col gap-sm md:grid md:grid-cols-4 md:gap-md lg:gap-lg">
      {steps.map((s, i) => (
        <Step key={i} title={s.title} body={s.body} />
      ))}
    </div>
  );
}
