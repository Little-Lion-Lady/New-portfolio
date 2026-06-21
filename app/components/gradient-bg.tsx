// Static stand-in for the hero gradient backdrop. The colour stops mirror the
// Figma "Gradient bg" (red → blue → transparent, blurred). This will be replaced
// by the animated, token-driven Gradient component (rebuild-prompt #4) and gains
// a dark-mode (blue) palette then. For now it validates the hero composition.
export function GradientBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520px] overflow-hidden lg:h-[1000px]">
      <div className="hero-gradient-bg h-full w-full" />
    </div>
  );
}
