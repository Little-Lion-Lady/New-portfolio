import type { Metadata } from "next";
import { pageMetadata } from "../../page-metadata";
import { CaseStudyStructuredData } from "../../components/structured-data";
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
import { Hmw } from "../../components/hmw";
import { FindingsTable } from "../../components/findings-table";
import { Journey } from "../../components/journey";
import {
  ApproachMedia,
  FlowDiagram,
  DesignMedia,
  ValidationMedia,
  OutcomeMedia,
} from "../../components/media-block";
import { covid } from "@/content/stats";

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
    finding: `Unfocused landing page: ${covid.taskSuccessBefore} success rate, 17 of 31 dropped at screen 1`,
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

// Arrow used between before→after stat pairs in §07 (matches the sm stat number
// scale). It sits in its own grid column and is centred in it, so it reads as
// belonging to neither stat rather than crowding the one on its right.
function StatArrow() {
  return (
    <span className="b-md self-start justify-self-center text-text-highlight-dark md:b-lg lg:d-xs">
      →
    </span>
  );
}

// One description, used by both the page metadata and the JSON-LD below, so
// the two cannot drift apart.
const description =
  `${covid.installs} New Zealanders downloaded the Covid Tracer app. Only ${covid.btDevicesBeforeRounded} turned on Bluetooth Tracing – a feature that anonymously and automatically mapped potential transmissions. People couldn’t tell what they were being asked to switch on, or whether it was working. I redesigned the onboarding, and ${covid.devicesAddedRounded} people switched it on.`;

export const metadata: Metadata = pageMetadata({
  path: "/work/covid-tracer",
  title: "NZ Covid Tracer app — Maryna Babych",
  description,
});

export default function CovidTracer() {
  return (
    <main className="[--page-gutter:var(--spacing-md)] md:[--page-gutter:var(--spacing-3xl)] lg:[--page-gutter:var(--spacing-3xl)] page-shell relative flex flex-col gap-r-xl bg-bg-primary px-md pb-0 pt-[var(--header-clearance)] text-text-primary md:px-3xl lg:px-3xl lg:pb-0">
      {/* CreativeWork, linked to the Person/WebSite declared in the root
          layout. See components/structured-data.tsx. */}
      <CaseStudyStructuredData
        path="/work/covid-tracer"
        name="NZ Covid Tracer app"
        description={description}
        award="Best Design Award, Gold"
      />
      {/* Gradient + header + hero grouped so gap-r-xl isn't inserted between them */}
      <div>
        <SiteHeader />
        <section className="relative z-10">
          <CaseStudyHero
            titleTop="NZ Covid"
            titleBottom="Tracer App"
            lead="How I got half a million New Zealanders to switch on Bluetooth contact tracing"
            description={`${covid.installs} New Zealanders downloaded the Covid Tracer app. Only ${covid.btDevicesBeforeRounded} turned on Bluetooth Tracing – a feature that anonymously and automatically mapped potential transmissions. People couldn’t tell what they were being asked to switch on, or whether it was working. I redesigned the onboarding, and ${covid.devicesAddedRounded} people switched it on.`}
            meta={[
              { label: "Role_", value: "Senior Product Designer" },
              { label: "Scope_", value: "Strategy·UX/UI·Research" },
              { label: "Date_", value: "20’ – 21’" },
            ]}
            recognition={[
              {
                label: "Recognition_",
                value: "Best Design Award, Gold",
                href: "https://bestawards.co.nz/social-good/social-good/rush-1/nz-covid-tracer-app-1/",
              },
              {
                label: "Recognition_",
                value: "Open Source Awards 2021",
                href: "https://nzosa.org.nz/news-and-media/2021-winners-announced",
              },
              {
                label: "Recognition_",
                value: "GOOD Design Awards 2021",
                href: "https://good-design.org/projects/nz-covid-tracer-app/",
              },
            ]}
            images={[
              { src: "/home/work/covid-tracer/MOH1.jpg", alt: "The NZ COVID Tracer QR scanner open on a phone" },
              { src: "/home/work/covid-tracer/MOH2.jpg", alt: "Unite against COVID-19 campaign board, with the Ministry of Health briefing lectern" },
              { src: "/home/work/covid-tracer/MOH3.jpg", alt: "Grid of NZ COVID Tracer app screens on the campaign's hazard-stripe background" },
            ]}
          />
        </section>
      </div>

      {/* 01 — Problem */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="01" name="Problem" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-md">
          <Stats className="md:grid-cols-3">
            <Stat size="lg" value={covid.installsShort} label="Unique app installs" />
            <Stat size="lg" value="95%" label="Devices capable of BT Tracing" />
            <Stat size="lg" value={covid.btActivationRateBefore} label="Users with BT Tracing enabled" highlight />
          </Stats>
          <KeyParagraph className="lg:max-w-[953px]">
            Bluetooth Tracing was opt-in and badly explained. People didn’t know what it
            did, and once they were through onboarding there was nothing on screen to tell
            them whether it was running. The flow asked for trust before it had earned any.
          </KeyParagraph>
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 02 — Approach */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="02" name="Approach" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-md">
          <KeyParagraph className="lg:max-w-[953px]">
            A heuristic audit and some early benchmarking showed the drop-off clustered in
            two places. Between them, those two failures accounted for nearly half of
            eligible users never switching Bluetooth Tracing on.
          </KeyParagraph>
          <ApproachMedia />
        </Reveal>
        <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-r-lg">
          <Stats className="md:grid-cols-2 lg:grid-cols-4">
            <Stat size="sm" highlight value={covid.mislickBefore} label="Mislick rate on primary CTA" />
            <Stat size="sm" highlight value={covid.taskSuccessBefore} label="Avg task success rate" />
            <Stat size="sm" highlight value={covid.usabilityScoreBefore} label="Usability score" />
            <Stat size="sm" highlight value={covid.dropoffBefore} label="Users dropped off at screen 1" />
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

      {/* 03 — Design brief */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg pb-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="03" name="Design brief" />
        </Reveal>
        {/* Figma 1144:10215 pulls the How-Might-We up into the key paragraph
            block: --lg apart on mobile/tablet, but only 24 on desktop. The
            hypotheses then sit a full section gap below. */}
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-lg lg:gap-xl">
          <KeyParagraph className="lg:max-w-[953px]">
            The findings gave us one How Might We and two testable hypotheses. We set the
            success metrics before making any design decisions.
          </KeyParagraph>
          {/* Figma 1629:140118 — the HMW runs at the key-paragraph scale here,
              and mobile drops the label onto its own line (1144:10588). */}
          <Hmw scale="b-xs md:b-sm lg:b-md" stackLabel>
            improve Bluetooth Tracing feature acquisition for both new and existing users?
          </Hmw>
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

      {/* 04 — Design */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="04" name="Design" />
        </Reveal>
        {/* Figma sets the findings table only --sm (16/20/20) above the media,
            not the section gap, and the two media blocks only --2xs (6/8/12)
            apart — so both live in one group under the section header. */}
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-sm">
          <FindingsTable rows={findings} />
          <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-r-2xs">
            <FlowDiagram />
            <DesignMedia />
          </Reveal>
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 05 — Validation */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="05" name="Validation" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-lg">
          <KeyParagraph>
            What I really needed to know: would people turn Bluetooth on, and did they understand it
            doesn’t replace scanning posters? Getting that wrong meant they’d think they were
            protected when they weren’t.
          </KeyParagraph>
          <Stats rowGap="gap-y-2xl md:gap-y-lg" className="md:grid-cols-2 lg:grid-cols-4">
            <Stat size="sm" value={`${covid.mislickBefore} → ${covid.mislickAfter}`} label="Mislick rate reduction" />
            <Stat size="sm" value={`${covid.dropoffBefore} → ${covid.dropoffAfter}`} label="Drop off reduction at step 1" />
            <Stat size="sm" value={`${covid.taskSuccessBefore} → ${covid.taskSuccessAfter}`} label="Task success" />
            <Stat size="sm" value={`${covid.usabilityScoreBefore} → ${covid.usabilityScoreAfter}`} label="Usability score improvement" />
          </Stats>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          <ValidationMedia />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 06 — Outcome */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="06" name="Outcome" />
        </Reveal>
        {/* Figma 1144:10345 (desktop) / 1144:10501 (tablet) — the key paragraph
            and the before→after stats sit in one row on desktop (paragraph cols
            1-5, stats cols 7-11 of the 12-col page grid). On tablet they stack:
            the paragraph runs the full width and only the stats keep the
            5-of-9 column, so the stat rows sit 16 apart rather than desktop's
            40. The section's headline shot is no longer part of this row; it
            leads the image run below instead. */}
        <Reveal
          index={1}
          delay={0.6}
          className="flex w-full flex-col gap-lg md:grid md:grid-cols-9 md:gap-x-lg md:gap-y-xl lg:grid-cols-12 lg:gap-y-0"
        >
          <KeyParagraph className="md:col-start-1 md:col-span-9 md:row-start-1 lg:col-span-5">
            A month after launch, Bluetooth adoption was up and scanning hadn’t dropped. That
            combination was the point: people turned Bluetooth on without deciding it let them off
            the hook for scanning. While at the end of my tenure on the project the app rating
            score doubled from {covid.appRatingBefore} to {covid.appRatingAfter} stars.
          </KeyParagraph>
          {/* Figma 1144:10659 (mobile) / 1144:10505 (tablet) / 1144:10345
              (desktop) give the arrow a column of its own — two ~38% stat
              columns either side of a ~22-24% gutter — instead of sizing it to
              the glyph. */}
          <div className="grid grid-cols-[39fr_22fr_39fr] items-start gap-y-xs md:col-start-1 md:col-span-5 md:row-start-2 md:grid-cols-[38fr_24fr_38fr] md:gap-y-md lg:col-start-7 lg:col-span-5 lg:row-start-1 lg:gap-y-3xl">
            <Stat size="sm" highlight value={covid.btDevicesBefore} label="Daily active BT devices" />
            <StatArrow />
            <Stat size="sm" highlight value={covid.btDevicesAfter} label={`${covid.btGrowth} growth`} />
            <Stat size="sm" highlight value={covid.posterScansBefore} label="Daily poster scans" />
            <StatArrow />
            <Stat size="sm" highlight value={covid.posterScansAfter} label={`${covid.posterScanGrowth} growth`} />
          </div>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          <OutcomeMedia />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 07 — Journey */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
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
          image={{ src: "/home/work/basis/BS1.jpg", alt: "The Basis app on a phone beside the smart panel mounted on a wall" }}
        />
      </Reveal>

      <Divider />

      {/* No reveal: the footer arrives already there. */}
      <div className="relative z-10 w-full">
        <SiteFooter />
      </div>
    </main>
  );
}
