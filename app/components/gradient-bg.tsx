import { NeatGradientBg } from "./neat-gradient";

export function GradientBg() {
  return (
    <div className="relative">
    <div
      aria-hidden
      className="pointer-events-none absolute -left-xl -right-xl -top-xl z-0 h-[620px] pt-lg px-lg md:-left-3xl md:-right-3xl md:-top-3xl md:pt-2xl md:px-2xl lg:-left-5xl lg:-right-5xl lg:-top-5xl lg:pt-3xl lg:px-3xl"
    >
      {/* clip-path rounds match border-radius at each breakpoint so the
          blur-60px child's bleed is clipped to the same rounded rect. */}
      <div className="h-full w-full blur-[20px] opacity-80">
        <div className="h-full w-full overflow-hidden [clip-path:inset(0)]">
          <div className="h-full w-full blur-[60px]">
            <NeatGradientBg />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
