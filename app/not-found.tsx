import { GradientBg } from "./components/gradient-bg";
import { SiteHeader } from "./components/site-header";
import { Button } from "./components/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col bg-bg-primary px-md pt-[56px] md:px-3xl md:pt-[64px] lg:px-5xl lg:pt-[72px]">
      {/* Gradient — absolute z-0, renders behind everything */}
      <GradientBg />
      {/* Fixed header — always on top */}
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
            <p className="d-md whitespace-nowrap text-text-primary-highlight">Oops</p>
            <p className="d-md leading-[0.8] whitespace-nowrap text-text-highlight-dark">404 error</p>
          </div>

          {/* Tablet: 9-col grid stagger */}
          <div className="hidden grid-cols-9 gap-x-[20px] md:grid lg:hidden">
            <p className="col-[1/span_4] d-lg leading-[0.9] whitespace-nowrap text-text-primary-highlight">Oops</p>
            <p className="col-[2/span_8] d-lg leading-[0.9] whitespace-nowrap text-text-highlight-dark">404 error</p>
          </div>

          {/* Desktop: 12-col grid stagger, fluid D-xl → D-2xl */}
          <div className="hidden grid-cols-12 gap-x-[20px] lg:grid">
            <p
              className="col-[1/span_5] d-xl leading-[0.9] whitespace-nowrap text-text-primary-highlight"
              style={{ fontSize: "clamp(142px, 22.7px + 11.65vw, 224px)" }}
            >
              Oops
            </p>
            <p
              className="col-[3/span_10] d-xl leading-[0.9] whitespace-nowrap text-text-highlight-dark"
              style={{ fontSize: "clamp(142px, 22.7px + 11.65vw, 224px)" }}
            >
              404 error
            </p>
          </div>
        </div>

        {/* ── Helper row ─────────────────────────────────────────────────── */}

        {/* Mobile: stacked texts + button */}
        <div className="mt-3xl flex flex-col gap-3xl md:hidden">
          <div className="flex flex-col gap-[20px]">
            <p className="b-sm text-text-secondary">Are you lost?</p>
            <p className="b-sm text-text-secondary">I can fix this</p>
          </div>
          <Button variant="primary" label="Go home" href="/" className="self-start" />
        </div>

        {/* Tablet: flex row, button ml-auto */}
        <div className="mt-8xl hidden items-center gap-x-[20px] md:flex lg:hidden">
          <p className="w-[258px] b-md text-text-secondary">Are you lost?</p>
          <p className="w-[258px] b-md text-text-secondary">I can fix this</p>
          <div className="ml-auto">
            <Button variant="primary" label="Go home" href="/" />
          </div>
        </div>

        {/* Desktop: fills remaining ~30svh, flex-1 centers helper vertically */}
        <div className="hidden flex-1 items-center gap-x-[20px] lg:flex">
          <div className="flex-1" />
          <p className="w-[258px] b-md text-text-secondary">Are you lost?</p>
          <p className="w-[258px] b-md text-text-secondary">I can fix this</p>
          <div className="ml-auto">
            <Button variant="primary" label="Go home" href="/" />
          </div>
        </div>

      </div>
    </main>
  );
}
