import { NeatGradientBg } from "./neat-gradient";

export function GradientBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-xl -right-xl -top-xl z-0 h-[520px] pt-lg px-lg md:-left-3xl md:-right-3xl md:-top-3xl md:pt-2xl md:px-2xl lg:-left-5xl lg:-right-5xl lg:-top-5xl lg:h-[1000px] lg:pt-3xl lg:px-3xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl blur-[40px] md:rounded-[20px] lg:rounded-3xl">
        <NeatGradientBg />
      </div>
    </div>
  );
}
