import { Button } from "./button";
import { CyclingWord } from "./cycling-word";
import { FitText } from "./fit-text";

const CYCLING_WORDS = ["love", "hate", "AI", "coffee", "mischief", "claude", "care", "passion"];

// Figma "Footer" component — a responsive grid.
//   desktop 6-col/3-row: socials(c1-2,r1) · made-with-love(c5,r1) · colophon(c1-2,r2) · wordmark(c1-6,r3)
//   tablet  4-col/4-row: socials(r1) · made-with-love(r2) · colophon(r3) · wordmark(r4)
//   mobile  4-col/4-row: same stacking as tablet, socials stack vertically
// Wordmark "get in touch" uses discrete sizes per breakpoint (60 / 170 / 314 px),
// per rebuild-prompt #6 (match each frame, don't interpolate). Clipped to avoid scroll.
export function SiteFooter() {
  return (
    <footer className="grid w-full grid-cols-4 gap-x-lg overflow-x-clip pt-2xl pb-4xs md:gap-y-xl md:pt-3xl md:pb-2xl dt:grid-cols-6 dt:gap-y-0 dt:pt-0 dt:pb-0">
      {/* Socials — vertical on mobile, horizontal md+ */}
      <div className="col-start-1 col-span-3 row-start-1 flex flex-col items-start gap-2xl md:col-span-2 md:flex-row md:items-center md:gap-6xl md:pt-md dt:pb-2xl dt:!pt-5xl">
        <Button variant="link" label="LinkedIn" href="https://www.linkedin.com/in/marynababych/" target="_blank" rel="noopener noreferrer" />
        <Button variant="link" label="Email" href="mailto:maryna.babych@gmail.com" target="_blank" rel="noopener noreferrer" />
      </div>

      {/* Made with love */}
      <div className="col-start-1 col-span-3 row-start-2 flex items-center pt-2xl pb-2xl md:col-span-2 md:pt-4xl md:pb-lg dt:!col-start-5 dt:col-span-2 dt:row-start-1 dt:items-start dt:!pt-3xl dt:overflow-hidden">
        <p className="whitespace-nowrap text-[32px] leading-[48px] text-text-tertiary md:text-[44px] md:leading-[1.1]">
          Made with <CyclingWord words={CYCLING_WORDS} className="text-text-primary-highlight" />
        </p>
      </div>

      {/* Colophon — M-xs → M-md → M-lg */}
      <div className="col-start-1 col-span-4 row-start-3 flex items-center md:col-span-3 md:-mb-lg dt:col-span-2 dt:row-start-2 dt:pt-4xl dt:!-mb-2xl">
        <p className="b-3xs text-text-tertiary md:b-2xs dt:b-sm">©2026_Maryna_Babych</p>
      </div>

      {/* Wordmark — FitText measures and scales to exactly fill viewport width. */}
      <FitText
        className="col-start-1 col-span-4 row-start-4 -ml-md w-screen self-start font-medium leading-[1.15] lowercase tracking-[-0.12em] text-text-highlight pl-md md:-ml-xl md:col-span-3 md:pl-xl dt:-ml-5xl dt:col-span-6 dt:row-start-3 dt:pl-5xl"
        heightRatio={0.81}
      >
        get in touch
      </FitText>
    </footer>
  );
}
