import { GradientBg } from "./components/gradient-bg";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { SectionHeader } from "./components/section-header";
import { WorkItem } from "./components/work-item";
import { Button } from "./components/button";
import { SectionReveal } from "./components/section-reveal-context";
import { Reveal } from "./components/reveal";
import { HeroCat } from "./components/hero-cat";
import { AboutCat } from "./components/about-cat";
import { HeroText } from "./components/hero-text";

function Divider({ className }: { className?: string }) {
  return <div className={`h-px bg-border-primary ${className ?? "w-full"}`} />;
}

export default function Home() {
  return (
    // Full-bleed on tablet/mobile (no page padding); desktop keeps px-5xl/py-3xl. Section gap = --2xl.
    <main className="relative flex flex-col gap-r-2xl bg-bg-primary px-md pb-0 pt-[56px] text-text-primary md:px-xl md:pt-[64px] lg:px-5xl lg:pb-0 lg:pt-[72px]">
      {/* Gradient + header + hero grouped so gap-r-2xl isn't inserted between them */}
      <div>
        <GradientBg />
        <SiteHeader />

        {/* Hero — fills the viewport (clamped 640px–1500px).
            Text vertically centered in the top 3/4. Image bottom-aligned in the remaining 1/4. */}
        {/* lg: subtract main's py-3xl (40px) so the section bottom aligns with the viewport fold */}
        <section className="relative z-10 flex h-[clamp(640px,calc(100svh-56px),1500px)] w-full flex-col md:h-[clamp(640px,calc(100svh-64px),1500px)] lg:h-[clamp(640px,calc(100svh-80px),1500px)]">
        {/* Text — fits to its bounding box via JS binary search on font-size */}
        <HeroText className="flex h-[calc(100%-100%/3)] w-full items-center pt-lg pb-3xs md:py-2xl lg:pt-6xl lg:pb-4xl" />
        {/* Image + divider — bottom 1/4.5.
            Divider is flex-1 so it stretches from the left page edge.
            Image pulls left with a negative margin to overlap the divider
            by exactly 5% of the image's max-width per breakpoint:
              mobile  296px → -ml-[15px]
              tablet  636px → -ml-[32px]
              desktop 42vw  → -ml-[2.1vw] */}
        <Reveal as="div" delay={2} noY className="flex h-[calc(100%/3)] items-end">
          <Divider className="flex-1 self-end mb-[calc(100svh/3*0.15)] md:mb-[calc(100svh/3*0.2)] lg:mb-[calc(100svh/3*0.3)] backdrop-blur-[20px] rounded-tl-md rounded-tr-md md:rounded-tl-lg md:rounded-tr-lg lg:rounded-tl-xl lg:rounded-tr-xl" />
          <HeroCat className="relative z-10 max-h-full w-auto flex-shrink-0 object-contain object-bottom -ml-[15px] max-w-[296px] md:-ml-[32px] md:max-w-[636px] md:min-h-[200px] md:max-h-[280px] lg:-ml-[1.8vw] lg:max-w-[36vw] lg:min-h-[300px]" />
        </Reveal>
        </section>
      </div>

      {/* 01 — Selected works. gap = --xl, pb-3xl. Reveals on scroll, staggered. */}
      <SectionReveal as="section" id="work" className="relative z-10 flex w-full flex-col gap-r-xl pb-3xl">
        <Reveal index={0} className="w-full">
          <SectionHeader number="01" name="Selected works" />
        </Reveal>
        <div className="flex w-full flex-col gap-r-3xl">
          <Reveal index={1} className="w-full">
            <WorkItem
              number="SW/01"
              name="Basis home app"
              description="Defining and designing the world’s first Smart Electrical Panel companion app to redefine user’s relationship with energy."
              roles="UX/UI, Research, Product strategy"
            />
          </Reveal>
          <Reveal index={2} className="w-full">
            <WorkItem
              number="SW/02"
              name="NZ COVID Tracer app"
              description="Working on a nation-wide COVID-19 pandemic response to support contact tracing efforts and protect New Zealand from the spread of COVID-19."
              roles="UX/UI, Research, Product strategy"
            />
          </Reveal>
        </div>
      </SectionReveal>

      <Divider />

      {/* 02 — Backstory. gap = --xl, py-lg (tablet/desktop), 0 (mobile). Reveals on scroll. */}
      <SectionReveal as="section" id="about" className="relative z-10 flex w-full flex-col gap-r-xl md:py-lg">
        <Reveal index={0} className="w-full">
          <SectionHeader number="02" name="Backstory" />
        </Reveal>
        {/* Content: mobile+tablet stack (cat → desc); desktop 12-col grid */}
        <Reveal index={1} className="w-full flex flex-col gap-lg lg:grid lg:grid-cols-12 lg:items-start">
          <div className="flex justify-end lg:col-start-8 lg:col-span-5 lg:self-end">
            <AboutCat className="w-full md:w-1/2 md:min-w-[350px] lg:w-full" />
          </div>
          <div className="flex flex-col gap-r-xl lg:col-start-1 lg:col-span-7 lg:row-start-1">
            {/* Key paragraph — B-sm → B-md → B-lg */}
            <p className="b-sm text-text-secondary md:b-md lg:b-lg">
              I’m a <span className="text-text-highlight-dark">passionate</span>,{" "}
              <span className="text-text-highlight-dark">strategic</span>, and{" "}
              <span className="text-text-highlight-dark">creative thinker</span>, blending human-centred
              design with technology to create experiences that positively impact lives. With{" "}
              <span className="text-text-highlight-dark">9 years</span> of experience in product design,
              I’ve delivered <span className="text-text-highlight-dark">award-winning</span>,{" "}
              <span className="text-text-highlight-dark">impactful</span> designs across a variety of
              industries and environments, including agencies, startups, and established product
              companies.
            </p>
            <Button variant="primary" label="About me" href="#about" className="self-start" />
          </div>
        </Reveal>
      </SectionReveal>

      <Divider />

      <Reveal className="w-full">
        <SiteFooter />
      </Reveal>
    </main>
  );
}
