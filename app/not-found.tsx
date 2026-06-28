import { GradientBg } from "./components/gradient-bg";
import { SiteHeader } from "./components/site-header";
import { Button } from "./components/button";
import { Reveal, RevealWords } from "./components/reveal";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col bg-bg-primary px-md pt-[56px] md:px-xl md:pt-[64px] lg:px-5xl lg:pt-[72px]">
      <GradientBg />
      <SiteHeader />

      {/* Full-height content wrapper, sits above gradient */}
      <div className="relative z-10 flex flex-1 flex-col">

        {/* ── Hero text ──────────────────────────────────────────────────────
            Mobile/tablet: natural height with top padding.
            Desktop: fixed 70svh with text pushed to bottom via justify-end,
            so the helper is always visible in the remaining ~30svh.        */}
        <div className="flex flex-col justify-end pb-8xl pt-8xl md:pb-2xl md:pt-[140px] lg:h-[70svh] lg:justify-center lg:pt-0 lg:pb-0">

          {/* Mobile: no stagger, stack */}
          <div className="md:hidden">
            <RevealWords as="h1" className="d-md whitespace-nowrap text-text-primary-highlight">Oops</RevealWords>
            <RevealWords as="p" startIndex={1} className="d-md leading-[0.8] whitespace-nowrap text-text-highlight-dark">404 error</RevealWords>
          </div>

          {/* Tablet: 9-col grid stagger */}
          <div className="hidden grid-cols-9 gap-x-[20px] md:grid lg:hidden">
            <RevealWords as="h1" className="col-[1/span_4] d-lg leading-[0.9] whitespace-nowrap text-text-primary-highlight">Oops</RevealWords>
            <RevealWords as="p" startIndex={1} className="col-[2/span_8] d-lg leading-[0.9] whitespace-nowrap text-text-highlight-dark">404 error</RevealWords>
          </div>

          {/* Desktop: 12-col grid stagger, fluid D-xl → D-2xl */}
          <div className="hidden grid-cols-12 gap-x-[20px] lg:grid">
            <RevealWords
              as="h1"
              className="col-[1/span_5] d-xl leading-[0.9] whitespace-nowrap text-text-primary-highlight"
              style={{ fontSize: "clamp(142px, 22.7px + 11.65vw, 224px)" }}
            >
              Oops
            </RevealWords>
            <RevealWords
              as="p"
              startIndex={1}
              className="col-[3/span_10] d-xl leading-[0.9] whitespace-nowrap text-text-highlight-dark"
              style={{ fontSize: "clamp(142px, 22.7px + 11.65vw, 224px)" }}
            >
              404 error
            </RevealWords>
          </div>
        </div>

        {/* ── Helper row ─────────────────────────────────────────────────── */}

        {/* Mobile: stacked texts + button */}
        <div className="mt-3xl flex flex-col gap-3xl md:hidden">
          <div className="flex flex-col gap-[20px]">
            <Reveal index={0} delay={0.5} as="p" className="b-sm text-text-secondary">Are you lost?</Reveal>
            <Reveal index={1} delay={0.5} as="p" className="b-sm text-text-secondary">I can fix this</Reveal>
          </div>
          <Reveal index={2} delay={0.5} className="self-start">
            <Button variant="primary" label="Go home" href="/" />
          </Reveal>
        </div>

        {/* Tablet: flex row, button ml-auto */}
        <div className="mt-8xl hidden items-center gap-x-[20px] md:flex lg:hidden">
          <Reveal index={0} delay={0.5} as="p" className="w-[258px] b-md text-text-secondary">Are you lost?</Reveal>
          <Reveal index={1} delay={0.5} as="p" className="w-[258px] b-md text-text-secondary">I can fix this</Reveal>
          <Reveal index={2} delay={0.5} className="ml-auto">
            <Button variant="primary" label="Go home" href="/" />
          </Reveal>
        </div>

        {/* Desktop: fills remaining ~30svh, flex-1 centers helper vertically */}
        <div className="hidden flex-1 items-center gap-x-[20px] lg:flex">
          <div className="flex-1" />
          <Reveal index={0} delay={0.5} as="p" className="w-[258px] lg:b-md text-text-secondary">Are you lost?</Reveal>
          <Reveal index={1} delay={0.5} as="p" className="w-[258px] lg:b-md text-text-secondary">I can fix this</Reveal>
          <Reveal index={2} delay={0.5} className="ml-auto">
            <Button variant="primary" label="Go home" href="/" />
          </Reveal>
        </div>

      </div>
    </main>
  );
}
