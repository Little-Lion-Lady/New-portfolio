// Static stand-in for the hero gradient backdrop. The colour stops mirror the
// Figma "Gradient bg" (red → blue → transparent, blurred). This will be replaced
// by the animated, token-driven Gradient component (rebuild-prompt #4) and gains
// a dark-mode (blue) palette then. For now it validates the hero composition.
export function GradientBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[60px] z-0 h-[520px] px-md blur-[20px] md:top-[80px] md:px-xl lg:h-[1000px] lg:px-5xl">
      <div className="hero-gradient-bg h-full w-full overflow-hidden rounded-t-2xl md:rounded-t-[20px] lg:rounded-t-3xl" />
    </div>
  );
}
