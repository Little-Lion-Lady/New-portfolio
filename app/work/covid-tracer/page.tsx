import type { Metadata } from "next";
import { GradientBg } from "../../components/gradient-bg";
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
    finding: "No system visibility — users couldn’t tell if BT was active",
    decision:
      "Persistent BT status indicator on dashboard, always visible regardless of screen state",
  },
  {
    finding: "Action relied on memory rather than choice or clear prompt",
    decision:
      "Single action per onboarding screen — one decision at a time, no competing CTAs",
  },
  {
    finding: "Too much information upfront, overloading users before trust established",
    decision:
      "Value prop screen leads with benefit (“Trace your encounters”), mechanics collapsed below fold",
  },
  {
    finding: "Landing page lacked focus — 38.7% success rate, 17/31 dropped at screen 1",
    decision:
      "Redesigned to single primary CTA with supporting context collapsed — BT enable action unmissable",
  },
  {
    finding: "No path for users who already had BT on — flow assumed new state",
    decision:
      "Separate flows for new users and existing users with BT already enabled — context-aware entry",
  },
];

const journeySteps = [
  {
    title: "Audit & Benchmark",
    body: "Heuristic evaluation and baseline usability test across onboarding and in-app BT surfaces. Identified six critical failures.",
  },
  {
    title: "Design",
    body: "Collaborative ideation with PO, design, dev, and MoH PO. Every decision mapped to a finding.",
  },
  {
    title: "Test",
    body: "Two rounds of user testing. Each with a specific question and a clear “therefore.”",
  },
  {
    title: "Ship",
    body: "Delivered over two agile sprints with Ministry of Health approval at each stage.",
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
    "2.7 million New Zealanders downloaded the Covid Tracer app. Only 1.3 million had Bluetooth Tracing enabled, which allowed frictionless contact tracing that would kerb the spread. I diagnosed it as a UX failure and redesigned the experience to close that gap.",
};

export default function CovidTracer() {
  return (
    <main className="relative flex flex-col gap-r-xl bg-bg-primary px-md pb-0 pt-[56px] text-text-primary md:px-3xl md:pt-[64px] lg:px-5xl lg:pb-0 lg:pt-[72px]">
      {/* Gradient + header + hero grouped so gap-r-xl isn't inserted between them */}
      <div>
        <GradientBg height="647px" fullWidth />
        <SiteHeader />
        <section className="relative z-10">
          <CaseStudyHero
            titleTop="NZ Covid"
            titleBottom="Tracer App"
            lead="How I closed a 1.4 million user gap during the COVID-19 pandemic"
            description="2.7 million New Zealanders downloaded the Covid Tracer app. Only 1.3 million had Bluetooth Tracing enabled, which allowed frictionless contact tracing that would kerb the spread. I diagnosed it as a UX failure and redesigned the experience to close that gap."
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

      {/* 01 — Problem */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="01" name="Problem" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-4xl">
          <Stats className="md:grid-cols-3">
            <Stat size="lg" value="2.7M" label="Unique app installs" />
            <Stat size="lg" value="95%" label="Devices capable of BT Tracing" />
            <Stat size="lg" value="49%" label="Users enabled BT tracing" highlight />
          </Stats>
          <KeyParagraph className="lg:max-w-[916px]">
            Bluetooth Tracing was opt-in, invisible, and poorly explained. Users didn’t
            understand what it did, couldn’t see whether it was working, and had no
            compelling reason to turn it on. The onboarding flow asked for trust before
            establishing it. That was the failure to fix.
          </KeyParagraph>
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 02 — Approach */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="02" name="Approach" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-md">
          <KeyParagraph className="lg:max-w-[916px]">
            Through a heuristic audit and early benchmarking, I found the drop-off wasn’t
            random. Two distinct failures were responsible for nearly half of eligible users
            not enabling a feature that would protect their community.
          </KeyParagraph>
          <ApproachMedia />
        </Reveal>
        <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-4xl">
          <Stats className="md:grid-cols-2 lg:grid-cols-4">
            <Stat size="lg" highlight value="18%" label="Mislick rate on primary CTA" />
            <Stat size="lg" highlight value="38.7%" label="Avg task success rate" />
            <Stat size="lg" highlight value="47" label="Usability score" />
            <Stat size="lg" highlight value="55%" label="Users drop off at screen 1" />
          </Stats>
          <div className="flex flex-col gap-r-md">
            <Column label="Blocker 1" title="The app asked for trust before earning it">
              Onboarding used technical language, no clear calls to action, and frontloaded
              too much information. Users arrived at the BT screen without understanding what
              they were being asked to do — or why it mattered.
            </Column>
            <Column label="Blocker 2" title="BT status was invisible once you were in the app">
              Existing users had no way to tell if Bluetooth Tracing was active. There was no
              persistent indicator, no reminder, and the action to enable it relied on users
              remembering where to find it — not on the app surfacing it.
            </Column>
          </div>
        </Reveal>
      </SectionReveal>

      {/* Insight — between 02 and 03, no dividers */}
      <Reveal delay={0.6} immediate className="relative z-10 w-full">
        <Insight>
          The problem wasn’t awareness. It was comprehension and confidence. Redesign needed
          to answer one question faster: “Is this safe and does it work?” Reassure first.
          Explain second. Ask third.
        </Insight>
      </Reveal>

      {/* 03 — Design brief */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="03" name="Design brief" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-md">
          <KeyParagraph className="lg:max-w-[916px]">
            The discovery findings translated into a single HMW and two testable hypotheses
            with defined success metrics — set before any design decisions were made.
          </KeyParagraph>
          <Column label="How might we" labelClassName="b-xs md:b-sm lg:b-sm">
            improve Bluetooth Tracing feature acquisition for both new and existing users?
          </Column>
        </Reveal>
        <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-r-md">
          <Hypothesis
            label="H1"
            believe="increasing the visual affordance of Bluetooth Tracing will drive acquisition"
            because="users need a clear, persistent cue — not a buried setting they have to remember to find."
            metric="BT daily active users grow by 30% within one month of launch."
          />
          <Divider />
          <Hypothesis
            label="H2"
            believe="improving how Contact Tracing is explained will lift acquisition across both new and existing users"
            because="users will understand what they’re enabling — and why it’s worth it."
            metric="Daily BT active devices grow while poster scans remain stable or also increase."
          />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 04 — Design */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="04" name="Design" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <FindingsTable rows={findings} />
        </Reveal>
        <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-xs md:gap-md lg:gap-xl">
          <FlowDiagram />
          <DesignMedia />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 05 — Validation */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="05" name="Validation" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-4xl">
          <KeyParagraph lead="Two rounds. Each one answered a specific question.">
            I ran two rounds of user testing against the redesign. Each round had a clear
            “therefore” — findings fed directly into the next iteration rather than being
            logged and filed.
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

      {/* 06 — Outcome */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="06" name="Outcome" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-lg lg:grid lg:grid-cols-12 lg:gap-x-lg">
          {/* Content (desktop: right) */}
          <div className="flex flex-col gap-2xl lg:col-start-8 lg:col-span-5">
            <KeyParagraph>
              Both hypotheses validated within one month of launch. While at the end of my
              tenure on the project the app rating score doubled.
            </KeyParagraph>
            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-x-lg gap-y-3xl">
              <Stat size="sm" highlight value="1,494,077" label="Daily active BT devices" />
              <StatArrow />
              <Stat size="sm" highlight value="2,006,506" label="Mislick rate reduction" />
              <Stat size="sm" highlight value="618,344" label="Daily poster scans" />
              <StatArrow />
              <Stat size="sm" highlight value="672,605" label="26% growth" />
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

      {/* 07 — Journey */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="07" name="Journey" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <Journey steps={journeySteps} />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* Case study nav */}
      <Reveal delay={0.6} immediate className="relative z-10 w-full">
        <CaseStudyNav
          title="Basis Home app"
          href="/work/basis"
          image={{ src: "/home/work/basis/BS1.jpg", alt: "Basis home app screen" }}
        />
      </Reveal>

      <Divider />

      <Reveal delay={0.6} immediate className="relative z-10 w-full">
        <SiteFooter />
      </Reveal>
    </main>
  );
}
