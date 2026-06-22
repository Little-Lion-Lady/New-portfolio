import { Button } from "./button";

// Figma "Footer" component — a responsive grid.
//   desktop 6-col/3-row: socials(c1-2,r1) · made-with-love(c5,r1) · colophon(c1-2,r2) · wordmark(c1-6,r3)
//   tablet  4-col/4-row: socials(r1) · made-with-love(r2) · colophon(r3) · wordmark(r4)
//   mobile  4-col/4-row: same stacking as tablet, socials stack vertically
// Wordmark "get in touch" uses discrete sizes per breakpoint (60 / 170 / 314 px),
// per rebuild-prompt #6 (match each frame, don't interpolate). Clipped to avoid scroll.
export function SiteFooter() {
  return (
    <footer className="grid w-full grid-cols-4 gap-x-lg overflow-hidden pt-4xl pb-4xs md:gap-y-xl md:pt-7xl md:pb-2xl lg:grid-cols-6 lg:gap-y-0 lg:pt-0 lg:pb-0">
      {/* Socials — vertical on mobile, horizontal md+ */}
      <div className="col-start-1 col-span-3 row-start-1 flex flex-col items-start gap-xl md:col-span-2 md:flex-row md:items-center md:gap-6xl md:pt-md lg:pb-2xl lg:pt-5xl">
        <Button variant="link" label="LinkedIn" href="https://www.linkedin.com" />
        <Button variant="link" label="Email" href="mailto:maryna.babych@gmail.com" />
      </div>

      {/* Made with love */}
      <div className="col-start-1 col-span-3 row-start-2 flex items-center pt-4xl md:col-span-2 md:pt-3xl lg:col-start-5 lg:col-span-1 lg:row-start-1 lg:items-end lg:self-end lg:pt-0 lg:pb-xl">
        <p className="whitespace-nowrap text-[32px] leading-[48px] text-text-tertiary md:text-[44px] md:leading-[1.1]">
          Made with <span className="text-text-primary-highlight">love</span>
        </p>
      </div>

      {/* Colophon — M-xs → M-md → M-lg */}
      <div className="col-start-1 col-span-4 row-start-3 flex items-center pt-4xl md:col-span-3 lg:col-span-2 lg:row-start-2 lg:pt-9xl">
        <p className="m-xs uppercase text-text-tertiary md:m-md lg:m-lg">©2026_Maryna_Babych</p>
      </div>

      {/* Wordmark — fluid vw sizing so text fills full viewport width at every breakpoint.
          Negative margin + w-screen breaks out of the page's horizontal padding. */}
      <p
        className="col-start-1 col-span-4 row-start-4 -ml-md w-screen self-start whitespace-nowrap font-medium leading-[1.15] lowercase tracking-[-0.05em] text-text-highlight text-[18vw] pl-md md:-ml-xl md:col-span-3 md:pl-xl lg:-ml-5xl lg:col-span-6 lg:row-start-3 lg:pl-5xl"
      >
        get in touch
      </p>
    </footer>
  );
}
