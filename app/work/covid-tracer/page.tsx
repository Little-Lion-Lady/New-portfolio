import type { Metadata } from "next";
import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";
import { SectionHeader } from "../../components/section-header";
import { Divider } from "../../components/divider";
import { SectionReveal } from "../../components/section-reveal-context";
import { Reveal } from "../../components/reveal";
import { CaseStudyHero } from "../../components/case-study-hero";
import { CaseStudyNav } from "../../components/case-study-nav";
import { KeyParagraph } from "../../components/key-paragraph";
import { Stat, Stats } from "../../components/stat";
import { Insight } from "../../components/insight";
import { Hypothesis } from "../../components/hypothesis";
import { Column } from "../../components/column";
import { FindingsTable } from "../../components/findings-table";
import { Journey } from "../../components/journey";
import {
  ApproachMedia,
  FlowDiagram,
  DesignMedia,
  OutcomeMedia,
} from "../../components/media-block";
import { GlassImage } from "../../components/work-image";

const findings = [
  {
    finding: "Nothing in the app told users whether Bluetooth Tracing was on",
    decision:
      "Status indicator on the dashboard, visible in every screen state",
  },
  {
    finding: "Turning it on relied on memory, not on a prompt",
    decision:
      "One action per onboarding screen, with no competing CTAs",
  },
  {
    finding: "Too much information upfront, before any trust was established",
    decision:
      "Lead screen opens with the benefit (“Trace your encounters”) and drops the mechanics below the fold",
  },
  {
    finding: "Unfocused landing page: 38.7% success rate, 17 of 31 dropped at screen 1",
    decision:
      "Rebuilt around one primary CTA, with the supporting detail collapsed",
  },
  {
    finding: "No path for users who already had Bluetooth on; the flow assumed a fresh install",
    decision:
      "Separate flows for new users and for users who already had it enabled",
  },
];

const journeySteps = [
  {
    title: "Audit & Benchmark",
    body: "Heuristic review and a baseline usability test, covering onboarding and the in-app Bluetooth screens. Six things were clearly broken.",
  },
  {
    title: "Design",
    body: "Worked through options with our PO, designers, devs and the Ministry’s PO. Every decision traced back to a finding.",
  },
  {
    title: "Test",
    body: "Two rounds of user testing, each with one question to answer and a clear “therefore.”",
  },
  {
    title: "Ship",
    body: "Shipped over two sprints, with Ministry of Health sign-off at each stage.",
  },
];

// Arrow used between before→after stat pairs in §06 (matches the sm stat number scale).
function StatArrow() {
  return (
    <span className="b-md self-start text-text-highlight-dark md:b-lg lg:d-xs">→</span>
  );
}

export const metadata: Metadata = {
  title: "NZ Covid Tracer app — Maryna Babych",
  description:
    "2.7 million New Zealanders downloaded the Covid Tracer app. Only 1.3 million turned on Bluetooth Tracing, the part that logged contacts automatically. People couldn't tell what they were being asked to switch on, or whether it was working. I redesigned the onboarding to close the gap.",
};

export default function CovidTracer() {
  return (
    <main className="[--page-gutter:var(--spacing-md)] md:[--page-gutter:var(--spacing-2xl)] lg:[--page-gutter:var(--spacing-3xl)] relative flex flex-col gap-r-xl bg-bg-primary px-md pb-0 pt-[60px] text-text-primary md:px-2xl md:pt-[92px] lg:px-3xl lg:pb-0 lg:pt-[92px]">
      {/* Gradient + header + hero grouped so gap-r-xl isn't inserted between them */}
      <div>
        <SiteHeader />
        <section className="relative z-10">
          <CaseStudyHero
            titleTop="NZ Covid"
            titleBottom="Tracer App"
            lead="How I closed a 1.4 million user gap during the COVID-19 pandemic"
            description="2.7 million New Zealanders downloaded the Covid Tracer app. Only 1.3 million turned on Bluetooth Tracing, the part that logged contacts automatically. People couldn’t tell what they were being asked to switch on, or whether it was working. I redesigned the onboarding to close the gap."
            meta={[
              { label: "Role_", value: "Senior Product Designer" },
              { label: "Scope_", value: "Strategy·UX/UI·Research" },
              { label: "Date_", value: "20’ – 21’" },
            ]}
            recognition={[
              { label: "Recognition_", value: "Best Design Award, Gold" },
              { label: "Recognition_", value: "Open Source Awards 2021" },
              { label: "Recognition_", value: "GOOD Design Awards 2021" },
            ]}
            images={[
              { src: "/home/work/covid-tracer/MOH1.jpg", alt: "NZ COVID Tracer app screen" },
              { src: "/home/work/covid-tracer/MOH2.jpg", alt: "NZ COVID Tracer app screen" },
              { src: "/home/work/covid-tracer/MOH3.jpg", alt: "NZ COVID Tracer app screen" },
            ]}
          />
        </section>
      </div>

      {/* 01 — Journey */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="01" name="Journey" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <Journey steps={journeySteps} />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 02 — Problem */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="02" name="Problem" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-4xl">
          <Stats className="md:grid-cols-3">
            <Stat size="lg" value="2.7M" label="Unique app installs" />
            <Stat size="lg" value="95%" label="Devices capable of BT Tracing" />
            <Stat size="lg" value="49%" label="Users with BT Tracing enabled" highlight />
          </Stats>
          <KeyParagraph className="lg:max-w-[916px]">
            Bluetooth Tracing was opt-in and badly explained. People didn’t know what it
            did, and once they were through onboarding there was nothing on screen to tell
            them whether it was running. The flow asked for trust before it had earned any.
          </KeyParagraph>
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 03 — Approach */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="03" name="Approach" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-md">
          <KeyParagraph className="lg:max-w-[916px]">
            A heuristic audit and some early benchmarking showed the drop-off clustered in
            two places. Between them, those two failures accounted for nearly half of
            eligible users never switching Bluetooth Tracing on.
          </KeyParagraph>
          <ApproachMedia />
        </Reveal>
        <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-4xl">
          <Stats className="md:grid-cols-2 lg:grid-cols-4">
            <Stat size="lg" highlight value="18%" label="Mislick rate on primary CTA" />
            <Stat size="lg" highlight value="38.7%" label="Avg task success rate" />
            <Stat size="lg" highlight value="47" label="Usability score" />
            <Stat size="lg" highlight value="55%" label="Users dropped off at screen 1" />
          </Stats>
          <div className="flex flex-col gap-r-md">
            <Column label="Blocker 1" title="The app asked for trust before earning it">
              Onboarding led with technical language and too much of it, and no screen had an
              obvious next step. By the time people reached the Bluetooth screen, they didn’t
              know what they were agreeing to.
            </Column>
            <Column label="Blocker 2" title="BT status was invisible once you were in the app">
              Nothing in the app showed whether Bluetooth Tracing was on. Turning it on meant
              remembering it existed and going to look for it in settings.
            </Column>
          </div>
        </Reveal>
      </SectionReveal>

      {/* Insight — between 02 and 03, no dividers */}
      <Reveal delay={0.6} immediate className="relative z-10 w-full">
        <Insight>
          People had heard of Bluetooth Tracing. They just couldn’t tell whether it was safe
          or whether it worked. The redesign had to answer that faster. Reassure first.
          Explain second. Ask third.
        </Insight>
      </Reveal>

      {/* 04 — Design brief */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="04" name="Design brief" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-md">
          <KeyParagraph className="lg:max-w-[916px]">
            The findings gave us one How Might We and two testable hypotheses. We set the
            success metrics before making any design decisions.
          </KeyParagraph>
          <Column label="How might we" labelClassName="b-xs md:b-sm lg:b-sm">
            improve Bluetooth Tracing feature acquisition for both new and existing users?
          </Column>
        </Reveal>
        <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-r-md">
          <Hypothesis
            label="H1"
            believe="making Bluetooth Tracing visible in the app will get more people to turn it on"
            because="people need a cue they can’t miss, not a setting they have to remember to go and find."
            metric="Bluetooth Tracing daily active users grow 30% within a month of launch."
          />
          <Divider />
          <Hypothesis
            label="H2"
            believe="explaining Contact Tracing better will lift take-up among new and existing users alike"
            because="people will know what they’re switching on, and what they get for it."
            metric="Daily Bluetooth-active devices grow while poster scans hold steady or rise."
          />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 05 — Design */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="05" name="Design" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <FindingsTable rows={findings} />
        </Reveal>
        <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-xs md:gap-md lg:gap-lg">
          <FlowDiagram />
          <DesignMedia />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 06 — Validation */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="06" name="Validation" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-4xl">
          <KeyParagraph lead="Two rounds. Each one answered a specific question.">
            Each round had a clear “therefore”. Findings went straight into the next
            iteration instead of being logged and filed.
          </KeyParagraph>
          <Stats className="md:grid-cols-2 lg:grid-cols-4">
            <Stat size="sm" value="18% → 5.3%" label="Mislick rate reduction" />
            <Stat size="sm" value="55% → 12%" label="Drop off reduction at step 1" />
            <Stat size="sm" value="38% → 92%" label="Task success" />
            <Stat size="sm" value="47 → 81" label="Usability score improvement" />
          </Stats>
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 07 — Outcome */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="07" name="Outcome" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-lg lg:grid lg:grid-cols-12 lg:gap-x-lg">
          {/* Content (desktop: right) */}
          <div className="flex flex-col gap-2xl lg:col-start-8 lg:col-span-5">
            <KeyParagraph>
              Both hypotheses were validated within a month of launch. By the time I left the
              project, the app’s rating had doubled.
            </KeyParagraph>
            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-x-lg gap-y-3xl">
              <Stat size="sm" highlight value="1,494,077" label="Daily active BT devices" />
              <StatArrow />
              <Stat size="sm" highlight value="2,006,506" label="34% growth" />
              <Stat size="sm" highlight value="618,344" label="Daily poster scans" />
              <StatArrow />
              <Stat size="sm" highlight value="672,605" label="9% growth" />
            </div>
          </div>
          {/* Headline image (desktop: left) */}
          <GlassImage
            src="/home/work/covid-tracer/MOH11.jpg"
            alt="NZ COVID Tracer app screen"
            aspectRatio="758/474"
            className="w-full self-start lg:col-start-1 lg:col-span-6 lg:row-start-1"
          />
        </Reveal>
        {/* The outer SectionReveal's gap-r-xl (40/72/80px) separates every
            child uniformly, but OutcomeMedia's own row gap between MOH12 and
            MOH13 is only gap-xs/md:gap-md (8/16px) — so the MOH11→MOH12 gap
            was much bigger than the MOH12→MOH13 gap on mobile/tablet.
            Negative margin pulls it down to match; lg is left alone (its
            own row layout wasn't part of this request). */}
        <Reveal index={2} delay={0.6} className="w-full -mt-[32px] md:-mt-[56px] lg:mt-0">
          <OutcomeMedia />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* Case study nav */}
      <Reveal delay={0.6} immediate className="relative z-10 w-full">
        <CaseStudyNav
          title="First Table booking app"
          href="/work/first-table"
          image={{ src: "/home/work/firsttable/FT1.jpg", alt: "First Table app screen" }}
        />
      </Reveal>

      <Divider />

      <Reveal delay={0.6} immediate className="relative z-10 w-full">
        <SiteFooter />
      </Reveal>
    </main>
  );
}
