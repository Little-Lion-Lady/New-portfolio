import { GradientBg } from "./components/gradient-bg";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { SectionHeader } from "./components/section-header";
import { WorkItem } from "./components/work-item";
import { Button } from "./components/button";
import { SectionReveal } from "./components/section-reveal-context";
import { Reveal } from "./components/reveal";

function Divider({ className }: { className?: string }) {
  return <div className={`h-px bg-border-primary ${className ?? "w-full"}`} />;
}

// Hero copy is style-less in Figma — it scales fluidly with the viewport.
// clamp() is tuned to hit the Figma frame sizes: 32px (mobile) / 60px (tablet) / 92px (desktop).
const HL = { color: "var(--text-primary-highlight)" };

export default function Home() {
  return (
    // Full-bleed on tablet/mobile (no page padding); desktop keeps px-5xl/py-3xl. Section gap = --2xl.
    <main className="relative flex flex-col gap-r-2xl bg-bg-primary px-md pb-0 pt-[60px] text-text-primary md:px-xl md:pt-[80px] lg:px-5xl lg:pb-3xl lg:pt-[80px]">
      <GradientBg />
      <SiteHeader />

      {/* Hero — fills the viewport (clamped 640px–1500px).
          Text vertically centered in the top 3/4. Image bottom-aligned in the remaining 1/4. */}
      {/* lg: subtract main's py-3xl (40px) so the section bottom aligns with the viewport fold */}
      <section className="relative z-10 flex h-[clamp(640px,100svh,1500px)] w-full flex-col lg:h-[clamp(640px,calc(100svh-80px),1500px)]">
        {/* Text — top 4/5, content vertically centered with responsive y-padding */}
        <div className="flex h-[calc(100%-100%/4.5)] w-full items-center py-3xs md:py-2xl lg:py-4xl">
          <Reveal
            as="p"
            blur
            className="w-full"
            style={{
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-medium)",
              fontSize: "clamp(32px, min(5.85vw, 6.5svh), 92px)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "var(--text-primary-overlay)",
            }}
          >
            I&apos;m an <span style={HL}>IC Product Designer</span> specialising in{" "}
            <span style={HL}>product growth</span> and optimisation with a track record of shipping{" "}
            <span style={HL}>highly crafted interfaces</span> and dynamic interactions that elevate
            user experience. Currently <span style={HL}>leading design</span> at First Table.
          </Reveal>
        </div>
        {/* Image + divider — bottom 1/4.5. Divider is absolute (z-0) so the image (z-10) sits in front. */}
        <div className="relative flex h-[calc(100%/4.5)] items-end justify-end">
          <Divider className="absolute top-3/4 -translate-y-1/2 left-md md:left-xl lg:left-5xl w-[70%] backdrop-blur-[20px] rounded-tl-[16px] rounded-tr-[16px] md:rounded-tl-[20px] md:rounded-tr-[20px] lg:rounded-tl-[24px] lg:rounded-tr-[24px]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/home/hero-image.png"
            alt="Illustration of a designer working at a laptop"
            className="relative z-10 max-h-full w-auto object-contain object-bottom md:max-w-[636px] lg:max-w-[42vw]"
          />
        </div>
      </section>

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
        {/* Content: mobile stack (desc → cat below); tablet 8-col; desktop 12-col */}
        <Reveal index={1} className="flex flex-col gap-lg md:grid md:grid-cols-8 md:items-start lg:grid-cols-12">
          <div className="flex flex-col gap-r-xl md:col-start-1 md:col-span-6 lg:col-span-7">
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
            {/* Button + awards — col on mobile, row md+, spread on desktop */}
            <div className="flex flex-col items-start gap-md md:flex-row md:items-center md:gap-6xl lg:justify-between lg:gap-0">
              <Button variant="primary" label="About me" href="#about" />
              <div className="flex items-center gap-md pr-3xl">
                {[1, 2, 3, 4].map((n) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={n} src={`/home/award-${n}.png`} alt="" className="size-[44px] object-contain md:size-[60px]" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end self-end md:col-start-7 md:col-span-2 md:justify-center lg:col-start-10 lg:col-span-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/home/magic-cat.png"
              alt=""
              className="w-[233px] max-w-full object-contain md:w-full lg:w-[412px]"
            />
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
