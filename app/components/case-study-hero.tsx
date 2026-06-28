import { Reveal, RevealWords } from "./reveal";

// Figma "Hero" (393:15527 desktop / 436:16273 tablet / 436:16901 mobile).
// Title (two-tone, fluid) + description (lead + body) + meta + bleed image strip.
//   title    — case-hero-title (D-xs→D-md→D-2xl); line 1 primary-highlight, line 2 50% overlay
//              revealed word-by-word (RevealWords), matching the About hero
//   layout   — mobile/tablet stack text→meta; desktop 12-col grid (meta c2-6 | text c7-12)
//   meta     — single column (mobile), 2-col context|recognition (tablet), single column (desktop)
//   images   — horizontal strip of bg-inverse placeholders, h 300→400→600, proportional widths
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start">
      <p className="b-2xs whitespace-nowrap text-text-tertiary lg:b-sm">{label}</p>
      <p className="b-2xs whitespace-nowrap text-text-secondary lg:b-sm">{value}</p>
    </div>
  );
}

export function CaseStudyHero() {
  return (
    <div className="flex w-full flex-col gap-3xl md:gap-6xl">
      {/* Title + description (inner Hero block) */}
      <div className="flex w-full flex-col gap-4xl pt-2xl lg:gap-9xl lg:pt-8xl">
        {/* Title — two lines, fluid, revealed word-by-word */}
        <h1 className="case-hero-title flex flex-col gap-3xs whitespace-nowrap md:gap-xs">
          <RevealWords as="span" className="block text-text-primary-highlight">
            NZ Covid
          </RevealWords>
          <RevealWords as="span" startIndex={2} className="block text-text-primary-overlay">
            Tracer App
          </RevealWords>
        </h1>

        {/* Description — stacked on mobile/tablet, grid (meta | text) on desktop.
            Text then meta reveal with a 0.3s stagger. */}
        <div className="flex flex-col gap-3xl md:gap-4xl lg:grid lg:grid-cols-12 lg:gap-x-lg">
          {/* Text block (desktop: right, c7-12) */}
          <Reveal noY immediate delay={0.3} className="flex flex-col gap-xl lg:col-start-7 lg:col-span-6 lg:justify-center">
            <p className="b-sm text-text-primary-highlight lg:b-md">
              How I closed a 1.4 million user gap during the COVID-19 pandemic
            </p>
            <p className="b-xs text-text-secondary md:b-sm lg:b-md">
              2.7 million New Zealanders downloaded the Covid Tracer app. Only 1.3
              million had Bluetooth Tracing enabled, which allowed frictionless contact
              tracing that would kerb the spread. I diagnosed it as a UX failure and
              redesigned the experience to close that gap.
            </p>
          </Reveal>

          {/* Meta block (desktop: left, c2-6) — 0.3s after the text block */}
          <Reveal noY immediate delay={0.6} className="flex flex-col gap-sm md:grid md:grid-cols-2 md:gap-x-lg lg:col-start-2 lg:col-span-5 lg:row-start-1 lg:flex lg:flex-col lg:gap-lg">
            <div className="flex flex-col gap-sm md:gap-md lg:gap-lg">
              <MetaRow label="Role_" value="Senior Product Designer" />
              <MetaRow label="Scope_" value="Strategy·UX/UI·Research" />
              <MetaRow label="Date_" value="20’ – 21’" />
            </div>
            <div className="flex flex-col gap-sm md:gap-md lg:gap-lg">
              <MetaRow label="Recognition_" value="Best Design Award, Gold" />
              <MetaRow label="Recognition_" value="Open Source Awards 2021" />
              <MetaRow label="Recognition_" value="GOOD Design Awards 2021" />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Image strip — 4 proportional placeholders (real Figma is a 1936px peek/scroll
          strip for real imagery). No corner radius, per Figma. */}
      <Reveal
        noY
        immediate
        delay={0.6}
        className="flex w-full gap-sm overflow-hidden md:gap-xs lg:gap-md"
      >
        <div className="h-[300px] flex-[3] bg-bg-inverse md:h-[400px] lg:h-[600px]" />
        <div className="h-[300px] flex-[4] bg-bg-inverse md:h-[400px] lg:h-[600px]" />
        <div className="h-[300px] flex-[4] bg-bg-inverse md:h-[400px] lg:h-[600px]" />
        <div className="h-[300px] flex-[7] bg-bg-inverse md:h-[400px] lg:h-[600px]" />
      </Reveal>
    </div>
  );
}
