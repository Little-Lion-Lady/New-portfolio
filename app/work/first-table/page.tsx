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
import { Column } from "../../components/column";
import { FindingsTable } from "../../components/findings-table";
import { Journey } from "../../components/journey";
import {
  FTProblemMedia,
  FTResearchMedia,
  FTDesignSystemMedia,
  FTRedesignMedia,
  FTValidationMedia,
  FTOutcomeMedia,
} from "../../components/media-block";
import { firstTable } from "@/content/stats";

const blockers = [
  {
    label: "Blocker 1",
    title: "Inaccessible and inconsistent UI/UX",
    body: "Components that almost matched but didn’t. Font sizes drifted from screen to screen, and there were no tokens underneath any of it.",
  },
  {
    label: "Blocker 2",
    title: "Friction at every step",
    body: "Booking took four steps. Timeslots were ambiguous, the map was no use if you were already out and hungry, and a 7-day window ruled out anyone planning ahead.",
  },
  {
    label: "Blocker 3",
    title: "Low re-engagement",
    body: "With nothing pulling users back between bookings, the habit never formed.",
  },
];

const findings = [
  {
    label: "Finding 1",
    title: "Who drives the business",
    body: "Loyal Regulars are 14–19% of the customer base but deliver 28–37% of revenue in every market. Retaining them is the business model.",
  },
  {
    label: "Finding 2",
    title: "Discovery beats discounts",
    body: "Diners use First Table to find somewhere new, not to chase a deal. Finding somewhere new outranked saving money as the primary driver in every segment, and reframed what the redesign needed to prioritise.",
  },
  {
    label: "Finding 3",
    title: "The lapsed segment is recoverable",
    body: "A large segment booked intensely for a few months, then went quiet. 80% hadn’t switched to a rival. 90% could name something that would bring them back. This is a reactivation problem, not a churn one.",
  },
  {
    label: "Finding 4",
    title: "Forgetting is the real drop-off",
    body: "Most users don’t abandon First Table. They just stop thinking about it. The habit never forms. Re-engagement mechanics are the lever rather than better discounts.",
  },
];

// §03 — the three things the new design system bought us. Figma keeps these at
// B-sm (one step below the section body) so they read as supporting notes.
const systemPrinciples = [
  {
    title: "Atomic design",
    body: "Built a token-based system (semantic colour, spacing, typography, size) and standardised component library unlocks UI iteration without rebuilding from zero; faster to ship, easier to maintain.",
  },
  {
    title: "Single source of truth for AI",
    body: "Figma components linked to their code counterparts via CodeConnect. When a developer picks up a task, the UI code is already there to review. The Figma MCP server references real production code, making AI-assisted implementation significantly more precise.",
  },
  {
    title: "Accessibility-led design",
    body: "Rebuilt components to WCAG 2.1 AA baseline; accessibility notes embedded in component documentation, not added post-hoc.",
  },
];

const frictionPoints = [
  {
    finding: "Four-step booking flow created unnecessary drop-off before commitment",
    decision: "Cut the booking flow to a single step — from browse to confirmed in one action",
  },
  {
    finding:
      "Timeslot selection was ambiguous — diners weren’t sure what they’d committed to before confirming",
    decision:
      "Rebuilt timeslot display with clear state feedback; added week-view browsing alongside specific time search",
  },
  {
    finding:
      "The map didn’t serve spontaneous diners — finding something nearby required too many steps",
    decision: "Rebuilt the map as a first-class discovery surface for diners out and about",
  },
  {
    finding: "Solo and group bookings were unsupported — the product was turning away real demand",
    decision: "Extended party size options to include solo diners and larger groups",
  },
  {
    finding: "7-day booking window cut off planners and special occasion bookers",
    decision:
      "Extended to 14-day window; designed for two distinct mental models (spontaneous and planned) in one product",
  },
];

const journeySteps = [
  {
    title: "Research",
    body: "Behavioural segmentation across 1M+ bookings, with survey research on top to get at motivations, jobs to be done, and what brings people back",
  },
  {
    title: "Design System",
    body: "Token architecture, component library, accessibility work and Figma CodeConnect, all in place before any UI work",
  },
  {
    title: "Redesign",
    body: "IA restructure, booking flow reduction, timeslot UX, map rebuild, new party size and booking window features",
  },
  {
    title: "Validation",
    body: `${firstTable.abTestsPerYear} A/B tests per year, continuous usability research, staged rollout across ${firstTable.markets} markets`,
  },
];

export const metadata: Metadata = {
  title: "First Table booking app — Maryna Babych",
  description:
    `First Table had a product people loved and an app that got in their way. The dev team and I rebuilt the design system and the native app. Six months later the onboarding completion was up ${firstTable.onboardingCompletionIncrease} and conversion up ${firstTable.conversionIncrease}.`,
};

export default function FirstTable() {
  return (
    <main className="[--page-gutter:var(--spacing-md)] md:[--page-gutter:var(--spacing-3xl)] lg:[--page-gutter:var(--spacing-3xl)] relative flex flex-col gap-r-xl bg-bg-primary px-md pb-0 pt-[60px] text-text-primary md:px-3xl md:pt-[92px] lg:px-3xl lg:pb-0 lg:pt-[92px]">
      {/* Gradient + header + hero grouped so gap-r-xl isn't inserted between them */}
      <div>
        <SiteHeader />
        <section className="relative z-10">
          <CaseStudyHero
            titleTop="First Table"
            titleBottom="booking app"
            lead="A full rebuild of the booking app."
            description={`First Table had a product people loved and an app that got in their way. The dev team and I rebuilt the design system and the native app. Six months later the onboarding completion was up ${firstTable.onboardingCompletionIncrease} and conversion up ${firstTable.conversionIncrease}.`}
            meta={[
              { label: "Role_", value: "Lead Product Designer" },
              {
                label: "Scope_",
                value: "Strategy·UX/UI·Design System·Research·A/B testing",
              },
              { label: "Date_", value: "25’ – 26’" },
            ]}
            recognition={[
              { label: "Recognition_", value: "Best Design Award, Finalist" },
            ]}
            images={[
              { src: "/home/work/firsttable/FT1.jpg", alt: "First Table app screen" },
              { src: "/home/work/firsttable/FT2.jpg", alt: "First Table app screen" },
              { src: "/home/work/firsttable/3.jpg", alt: "First Table app screen" },
            ]}
          />
        </section>
      </div>

      {/* 01 — Problem */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="01" name="Problem" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-4xl">
          <Stats className="md:grid-cols-3">
            <Stat size="lg" value={firstTable.appUsersShort} label="App users" />
            <Stat size="lg" tone="highlight-dark" value={firstTable.conversionBefore} label="Conversion rate through booking flow" />
            <Stat size="lg" tone="highlight-dark" value="Low" label="Repeat bookings" />
          </Stats>
          {/* Figma 1394:101595 holds this opener at B-sm on desktop rather than
              stepping up to B-md. */}
          <KeyParagraph className="lg:max-w-[953px]">
            When I joined First Table as the founding design team member, the product had real
            love behind it. The value proposition was clear, the community was there, and the
            restaurants were real. But the digital experience wasn’t holding up its end.
            Inaccessible, inconsistent, and full of friction. It was quietly capping the
            potential of a product that deserved better.
          </KeyParagraph>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          <FTProblemMedia />
        </Reveal>
        <Reveal index={3} delay={0.6} className="flex w-full flex-col gap-r-md">
          {blockers.map((b) => (
            <Column key={b.label} label={b.label} title={b.title}>
              {b.body}
            </Column>
          ))}
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 02 — Research */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="02" name="Research" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <KeyParagraph lead="Understanding diner motivation" className="lg:max-w-[953px]">
            Before redesigning anything, I needed to understand who we were actually designing
            for. We ran a behavioural segmentation study across the last 13 months of bookings
            and layered in survey research to reach what the data alone couldn’t tell us: the
            motivations, habits, and friction points driving real diner decisions.
          </KeyParagraph>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          <Stats className="md:grid-cols-3">
            <Stat size="lg" tone="highlight-subtle" value="400k+" label="Transactions analysed" />
            <Stat size="lg" tone="highlight-subtle" value="10k" label="User survey responses" />
            <Stat size="lg" tone="highlight-subtle" value="5" label="User groups identified" />
          </Stats>
        </Reveal>
        <Reveal index={3} delay={0.6} className="w-full">
          <FTResearchMedia />
        </Reveal>
        <Reveal index={4} delay={0.6} className="flex w-full flex-col gap-r-md">
          {findings.map((f) => (
            <Column key={f.label} label={f.label} title={f.title}>
              {f.body}
            </Column>
          ))}
        </Reveal>
      </SectionReveal>

      {/* Insight — between 02 and 03, no dividers */}
      <Reveal delay={0.6} immediate className="relative z-10 w-full">
        <Insight>
          Users treat First Table as a way to find somewhere new, not as a deals app. That
          held in every segment we looked at.
        </Insight>
      </Reveal>

      {/* 03 — Design System */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="03" name="Design System" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <KeyParagraph className="lg:max-w-[953px]">
            Before touching a single screen, I led the creation of a new design system. The
            goal was to align design and engineering on shared tokens, accessible components,
            and consistent patterns. Without that foundation, any UI work would compound the
            inconsistency we were trying to fix.
          </KeyParagraph>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          <FTDesignSystemMedia />
        </Reveal>
        {/* Three supporting notes (Figma 1523:63230 / 1575:135304 / 1575:135327).
            Each is a Key paragraph — title over body at gap 0. They stack at --sm
            on mobile and go 3-up from tablet, where --sm is also the grid gutter:
            equal thirds of Figma's 9-col grid, and of the 12-col one on desktop. */}
        <Reveal index={3} delay={0.6} className="flex w-full flex-col gap-r-sm md:grid md:grid-cols-3">
          {systemPrinciples.map((p) => (
            <KeyParagraph key={p.title} lead={p.title} scale="b-xs lg:b-sm">
              {p.body}
            </KeyParagraph>
          ))}
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 04 — Redesign */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="04" name="Redesign" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <KeyParagraph className="lg:max-w-[953px]">
            With the system in place, we went after the key flows. IA analysis revealed a
            tangled web of interactions and redundancy that made the app slower to use and
            harder to maintain. I stripped it back, restructured the information architecture,
            and rebuilt the core paths.
          </KeyParagraph>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          <FindingsTable
            rows={frictionPoints}
            findingLabel="Friction point"
            decisionLabel="Solution"
            headerClassName="b-xs"
          />
        </Reveal>
        <Reveal index={3} delay={0.6} className="w-full">
          <FTRedesignMedia />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 05 — Validation */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="05" name="Validation" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <KeyParagraph lead={`${firstTable.abTestsPerYear} A/B tests run`} className="lg:max-w-[953px]">
            No change shipped on intuition alone. The work was shaped by continuous usability
            research and {firstTable.abTestsPerYear} A/B tests a year. With {firstTable.appUsers} app users, every
            design decision was checked against real behaviour before it landed in production.
            Losing variants got cut. Winners got built on.
          </KeyParagraph>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          <FTValidationMedia />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 06 — Outcome */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="06" name="Outcome" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <Stats className="md:grid-cols-3">
            <Stat size="outcome" value={`+${firstTable.signupIncrease}`} label="Sign-ups increase" />
            <Stat size="outcome" value={`+${firstTable.onboardingCompletionIncrease}`} label="onboarding completion" />
            <Stat size="outcome" value={`+${firstTable.conversionIncrease}`} label="Conversion rate increase" />
          </Stats>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          {/* Figma 1394:101716 steps this row up to B-md on desktop, unlike the
              Blocker and Finding rows above. */}
          <Column label="Closing the loop" textClassName="b-xs md:b-sm lg:b-md">
            First Table was already changing who gets to go out for dinner. The rebuild made
            sure the product was worthy of the promise. Simple enough that the only thing a
            diner notices is the table they just booked.
          </Column>
        </Reveal>
        <Reveal index={3} delay={0.6} className="w-full">
          <FTOutcomeMedia />
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
