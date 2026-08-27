// Figma §07 "Journey" + "_Step base" (436:16119 desktop / 436:17078 mobile).
// A 4-step timeline. Each step = a dot + connector line, then title + body.
//   mobile  — steps stack vertically; connector is a vertical line beside the text
//   tablet/desktop — steps sit in a 4-col row; connector is a horizontal line above the text
// Dot = a text-highlight-dark disc (24px, 20 on mobile) with a bg-light centre;
// the connector is the same highlight-dark at 2px. Both are SVGs in Figma —
// _Step icon base fills #FF0000 with an r=4 #F2F4F8 dot, Connector strokes #FF0000.
// Title text-primary-highlight, body text-secondary; type B-2xs→B-xs→B-sm.
// Step text stack sits at gap 0 (Figma _Step base): under standard trim the
// B-2xs/B-xs line box already carries the leading that the old 12/12/16 gap was
// stacking on top of. Type never reaches B-sm: the title runs B-2xs→B-xs→B-xs
// and the body B-2xs→B-2xs→B-xs, so tablet is the one step where the two
// differ (title 16/26 over body 14/24).
// Row gap: 4 (mobile, stacked) → 16 (tablet) → 20 (desktop).
// Dot: 20 on mobile, 24 from tablet up.
function StepDot() {
  return (
    <div className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-text-highlight-dark md:size-[24px]">
      <div className="size-[7px] rounded-full bg-bg-light md:size-[8px]" />
    </div>
  );
}

function Step({ title, body, isLast = false }: { title: string; body: string; isLast?: boolean }) {
  return (
    <div className="flex gap-md md:flex-col md:gap-xs">
      {/* Connector: vertical (mobile) / horizontal (md+) */}
      <div className="flex flex-col items-center gap-xs self-stretch pb-3xs md:w-full md:flex-row md:gap-md">
        <StepDot />
        {!isLast && <div className="w-[var(--size-1)] flex-1 rounded-full bg-text-highlight-dark md:h-[var(--size-1)] md:w-auto" />}
      </div>
      {/* Text */}
      <div className="flex flex-1 flex-col pb-md pt-4xs md:flex-none md:pb-xl">
        <p className="b-2xs text-text-primary-highlight md:b-xs">{title}</p>
        <p className="b-2xs text-text-secondary lg:b-xs">{body}</p>
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
    <div className="flex flex-col gap-3xs md:grid md:grid-flow-col md:auto-cols-fr md:gap-md lg:gap-lg">
      {steps.map((s, i) => (
        <Step key={i} title={s.title} body={s.body} isLast={i === steps.length - 1} />
      ))}
    </div>
  );
}
