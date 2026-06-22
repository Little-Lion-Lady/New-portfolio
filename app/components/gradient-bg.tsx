import { NeatGradientBg } from "./neat-gradient";

export function GradientBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520px] overflow-hidden lg:h-[1000px]">
      <div className="h-full w-full px-xs md:px-sm lg:px-[36px] blur-[35px]">
        <div className="overflow-hidden rounded-2xl md:rounded-[20px] lg:rounded-3xl h-full w-full mt-6 md:mt-10 lg:mt-16">
          <NeatGradientBg />
        </div>
      </div>
    </div>
  );
}
