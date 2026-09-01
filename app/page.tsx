import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { SectionHeader } from "./components/section-header";
import { WorkItem } from "./components/work-item";
import { Button } from "./components/button";
import { SectionReveal } from "./components/section-reveal-context";
import { Reveal } from "./components/reveal";
import { HeroCat, AboutCat } from "./components/dynamic-visuals";
import { SyncedStar } from "./components/synced-star";
import { HeroText } from "./components/hero-text";
import { Divider } from "./components/divider";
import { basis, covid, firstTable } from "@/content/stats";

export default function Home() {
  return (
    // Full-bleed on tablet/mobile (no page padding); desktop keeps px-3xl/py-3xl. Section gap = --2xl.
    <main className="[--page-gutter:var(--spacing-md)] md:[--page-gutter:var(--spacing-2xl)] lg:[--page-gutter:var(--spacing-3xl)] relative flex flex-col gap-r-2xl bg-bg-primary px-md pb-0 pt-[60px] text-text-primary md:px-2xl md:pt-[92px] lg:px-3xl lg:pb-0 lg:pt-[92px]">
      {/* Gradient + header + hero grouped so gap-r-2xl isn't inserted between them */}
      <div>
        {/* Every piece below is marked `intro`: the whole sequence is skipped,
            rendered already finished, if this session has seen the home page
            before — see hero-seen.ts.

            Hero load sequence — nav and headline open together, cat closes:
              nav       0s    → settles 0.7s
              headline  0s    → last word settles 5s (REVEAL_SPAN)
              cat       2.3s  → settles 3.0s
            The headline's 5s is a wrap, not the point at which it reads as
            present: with a 69ms stagger over 32 words the last word *starts*
            at ~2.1s, and everything after that is the tail softly resolving.
            So the cat follows the whole line being in motion rather than the
            nominal end — waiting for 5s left a dead beat with nothing moving
            but a blur no one can see. */}
        <SiteHeader revealDelay={0} intro />

        {/* Hero — fills the viewport (clamped 640px–1500px).
            Text vertically centered in the top 3/4. Image bottom-aligned in the remaining 1/4. */}
        {/* lg: subtract main's py-3xl (40px) so the section bottom aligns with the viewport fold */}
        <section className="relative z-10 flex h-[clamp(640px,calc(100svh-60px),1500px)] w-full flex-col md:h-[clamp(640px,calc(100svh-92px),1500px)] lg:h-[clamp(640px,calc(100svh-100px),1500px)]">
        {/* Text — fits to its bounding box via JS binary search on font-size */}
        <HeroText revealDelay={0} intro className="flex h-[calc(100%-100%/3)] w-full items-center pt-lg pb-3xs md:pt-3xl md:pb-2xl lg:pt-lg lg:pb-4xl" />
        {/* Image + divider — bottom 1/4.5.
            Divider is flex-1 so it stretches from the left page edge.
            Image pulls left with a negative margin to overlap the divider
            by exactly 10% of the image's max-width per breakpoint:
              mobile  296px → -ml-[30px]
              tablet  636px → -ml-[64px]
              desktop 36vw  → -ml-[3.6vw] */}
        <div className="relative flex h-[calc(100%/3)] items-end">
          {/* Third twinkle star — sits underneath the hero text, lifted just above
              the top of this row so it clears the last line of the headline.
              It reveals with the headline word it sits under, so it sits OUTSIDE
              the Reveal below: a parent animating opacity multiplies its
              children, and the cat's reveal now runs late enough that it would
              hold this star back past the word it points at. */}
          <SyncedStar
            variant={3}
            intro
            revealDelay={0}
            className="pointer-events-none absolute left-[3%] -top-[28px] w-8 md:left-[2%] md:-top-[36px] md:w-11 lg:left-[2%] lg:-top-[44px] lg:w-14"
          />
          {/* noSafetyFloor: the Divider below carries a backdrop-blur, which a
              reveal running the safety-floor animation would empty out (the
              animation makes its element a backdrop root). Part of the hero
              intro, so it plays on mount and needs no floor. */}
          <Reveal as="div" delay={2.3} noY intro noSafetyFloor className="flex h-full w-full items-end">
            <Divider tone="primary" className="flex-1 self-end mb-[calc(100svh/3*0.15)] md:mb-[calc(100svh/3*0.2)] lg:mb-[calc(100svh/3*0.3)] backdrop-blur-[20px] rounded-tl-md rounded-tr-md md:rounded-tl-lg md:rounded-tr-lg lg:rounded-tl-xl lg:rounded-tr-xl" />
            <HeroCat className="relative z-10 max-h-full w-auto flex-shrink-0 object-contain object-bottom -ml-[30px] max-w-[296px] md:-ml-[64px] md:max-w-[636px] md:min-h-[200px] md:max-h-[280px] lg:-ml-[3.6vw] lg:max-w-[36vw] lg:min-h-[300px]" />
          </Reveal>
        </div>
        </section>
      </div>

      {/* 01 — Selected works. gap = --xl, pb-3xl. Reveals on scroll, staggered. */}
      <SectionReveal as="section" id="work" className="relative z-10 flex w-full scroll-mt-[60px] flex-col gap-r-xl pb-3xl md:scroll-mt-[92px] lg:scroll-mt-[92px]">
        <Reveal index={0} className="w-full">
          <SectionHeader number="01" name="Selected works" />
        </Reveal>
        {/* Gap between work items — --3xl (80/128/160). Figma's standard-trim
            pass rebalanced the responsive 3xl step, so this is back on the
            token instead of the old fixed 96/128/224 override. */}
        <div className="flex w-full flex-col gap-r-3xl">
          {/* SW/01 waits for the section heading to be most of the way through
              its 600ms fade. index alone only buys 60ms, which reads as the two
              arriving together. SW/02+ keep the plain index stagger — they sit
              far enough down that each fires on its own in-view trigger. */}
          <Reveal index={1} delay={0.3} className="w-full">
            <WorkItem
              number="SW/01"
              name="First Table app"
              description={`A ground-up redesign of First Table, the app that gives diners 50% off their first table of the night, now used by ${firstTable.appUsers} people. In the six months since launch, sign-ups are up ${firstTable.signupIncrease} and conversion up ${firstTable.conversionIncrease}.`}
              roles="Growth, Design system, Experimentation"
              href="/work/first-table"
              images={[
                { src: "/home/work/firsttable/FT1.jpg", alt: "First Table app screen" },
                { src: "/home/work/firsttable/FT2.jpg", alt: "First Table app screen" },
                { src: "/home/work/firsttable/3.jpg", alt: "First Table app screen" },
                { src: "/home/work/firsttable/FT3.jpg", alt: "First Table app screen" },
                { src: "/home/work/firsttable/FirstTable_08.jpg", alt: "First Table app screen" },
              ]}
            />
          </Reveal>
          <Reveal index={2} className="w-full">
            <WorkItem
              number="SW/02"
              // Middle item counter-scrolls, so the three rows don't all drift
              // the same way.
              reverseMarquee
              name="NZ COVID Tracer app"
              description={`${covid.installs} New Zealanders downloaded the COVID Tracer app. Only ${covid.btActivationRateBefore} turned on Bluetooth Tracing, the part that logged contacts automatically. I redesigned the onboarding and half a million more people switched it on.`}
              roles="Onboarding, Research, Usability"
              href="/work/covid-tracer"
              images={[
                { src: "/home/work/covid-tracer/MOH0.jpg", alt: "NZ COVID Tracer app screen" },
                { src: "/home/work/covid-tracer/MOH1.5.jpg", alt: "NZ COVID Tracer app screen" },
                { src: "/home/work/covid-tracer/MOH2.jpg", alt: "NZ COVID Tracer app screen" },
                { src: "/home/work/covid-tracer/MOH3.jpg", alt: "NZ COVID Tracer app screen" },
              ]}
            />
          </Reveal>
          <Reveal index={3} className="w-full">
            <WorkItem
              number="SW/03"
              name="Basis home app"
              description={`The companion app for New Zealand’s first smart electrical panel, built with no product owner and no brief. I owned the strategy. The ${basis.pilotLengthWord} pilot cut household energy bills by ${basis.billReductionActual}.`}
              roles="UX/UI, Research, Product strategy"
              href="/work/basis"
              images={[
                {
                  src: "/home/work/basis/BS1.jpg",
                  alt: "Basis home app screen",
                  // Narrower than the row's other cards by request.
                  lgWidth: { class: "lg:w-[350px]", px: 350 },
                },
                { src: "/home/work/basis/BS2.jpg", alt: "Basis home app screen" },
                { src: "/home/work/basis/BS3.png", alt: "Basis home app screen" },
                { src: "/home/work/basis/BS4.png", alt: "Basis home app screen", quality: 75 },
              ]}
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
        <Reveal index={1} className="w-full flex flex-col gap-lg lg:grid lg:grid-cols-12 lg:items-stretch">
          <div className="flex justify-end lg:col-start-8 lg:col-span-5 lg:self-end lg:h-full">
            <AboutCat className="w-full max-w-[350px] aspect-[1857/1206] md:w-1/2 md:min-w-[350px] lg:w-full lg:max-w-full lg:h-full lg:aspect-auto" />
          </div>
          <div className="flex flex-col gap-r-xl lg:col-start-1 lg:col-span-7 lg:row-start-1">
            {/* Key paragraph — B-sm → B-md → B-lg */}
            <p className="b-sm text-text-secondary md:b-md lg:b-md">
              With 9+ years of experience, I&apos;ve taken products from{" "}
              <span className="text-text-highlight-dark">0→1</span>{" "}
              and brought tired ones back to life. I work in the open with engineers and PMs, and I
              care as much about{" "}
              <span className="text-text-highlight-dark">how a team works as what it ships</span>:
              shared systems, testing habits, people getting better at their craft. My work has
              reached millions of users across three continents and won{" "}
              <span className="text-text-highlight-dark">four Best Design Awards</span>.
            </p>
            <Button variant="primary" label="About me" href="/about" className="self-start" />
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
