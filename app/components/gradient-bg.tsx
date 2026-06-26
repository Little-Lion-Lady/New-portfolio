import { NeatGradientBg } from "./neat-gradient";

export function GradientBg() {
  return (
    // clip-path:inset(0) is the only reliable way to clip filter bleed in Firefox.
    // overflow-hidden alone clips layout overflow but NOT filter:blur() spread.
    <div
      aria-hidden
      className="pointer-events-none absolute -left-xl -right-xl -top-xl z-0 h-[520px] overflow-hidden [clip-path:inset(0)] pt-lg px-lg md:-left-3xl md:-right-3xl md:-top-3xl md:pt-2xl md:px-2xl lg:-left-5xl lg:-right-5xl lg:-top-5xl lg:h-[620px] lg:pt-3xl lg:px-3xl"
    >
      {/* clip-path rounds match border-radius at each breakpoint so the
          blur-60px child's bleed is clipped to the same rounded rect. */}
      <div className="h-full w-full blur-[20px] opacity-80">
        <div className="h-full w-full overflow-hidden rounded-2xl [clip-path:inset(0_round_1rem)] md:rounded-[20px] md:[clip-path:inset(0_round_20px)] lg:rounded-3xl lg:[clip-path:inset(0_round_1.5rem)]">
          <div className="h-full w-full blur-[60px]">
            <NeatGradientBg />
          </div>
        </div>
      </div>
    </div>
  );
}
