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
    body: "Loyal Regulars are 14–19% of customers and account for far more revenue than that share suggests, in every market. Keeping them is the business model.",
  },
  {
    label: "Finding 2",
    title: "Discovery beats discounts",
    body: "Diners use First Table to find somewhere new, not to chase a deal. That ranked above saving money in every segment, which changed what the redesign had to be good at.",
  },
  {
    label: "Finding 3",
    title: "The lapsed segment is recoverable",
    body: "A large segment booked heavily for a few months, then went quiet. Most of them hadn’t switched to a rival, and 90% could name something that would bring them back. That makes it a reactivation problem, not a churn one.",
  },
  {
    label: "Finding 4",
    title: "Forgetting is the real drop-off",
    body: "Most users don’t abandon First Table, they just stop thinking about it. The habit never forms. What’s missing is a reason to come back between meals.",
  },
];

// §03 — the three things the new design system bought us. Figma keeps these at
// B-sm (one step below the section body) so they read as supporting notes.
const systemPrinciples = [
  {
    title: "Atomic design",
    body: "A token-based system (semantic colour, spacing, typography, size) with a standardised component library. UI changes stopped meaning a rebuild from scratch.",
  },
  {
    title: "Single source of truth for AI",
    body: "Figma components linked to their code counterparts through CodeConnect. A developer picking up a task already has the UI code to review, and the Figma MCP server points at real production code instead of guessing at it.",
  },
  {
    title: "Accessibility-led design",
    body: "Components rebuilt to a WCAG 2.1 AA baseline, with the accessibility notes written into the component docs rather than bolted on later.",
  },
];

const frictionPoints = [
  {
    finding: "Booking took four steps, and people dropped out before the end",
    decision: "Cut it to one step: browse to confirmed in a single action",
  },
  {
    finding:
      "Timeslot selection was ambiguous; diners weren’t sure what they’d booked until after confirming",
    decision:
      "Rebuilt the timeslot display with clear states, and added week-view browsing next to time search",
  },
  {
    finding:
      "Finding something nearby took too many steps if you were already out",
    decision: "Rebuilt the map into a proper way to browse rather than an afterthought",
  },
  {
    finding: "Solo and group bookings weren’t supported, so we were turning away real demand",
    decision: "Extended party size options to include solo diners and larger groups",
  },
  {
    finding: "7-day booking window cut off planners and special occasion bookers",
    decision:
      "Extended to 14 days, so one product works whether you’re booking tonight or a birthday next week",
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
    body: "150+ A/B tests per year, continuous usability research, staged rollout across 4 markets",
  },
];

export const metadata: Metadata = {
  title: "First Table booking app — Maryna Babych",
  description:
    "First Table had a product people loved and an app that got in their way. The dev team and I rebuilt the design system and the native app. Six months in, onboarding completion was up 21% and conversion up 12.3%.",
};

export default function FirstTable() {
  return (
    <main className="[--page-gutter:var(--spacing-md)] md:[--page-gutter:var(--spacing-3xl)] lg:[--page-gutter:var(--spacing-5xl)] relative flex flex-col gap-r-xl bg-bg-primary px-md pb-0 pt-[60px] text-text-primary md:px-3xl md:pt-[92px] lg:px-5xl lg:pb-0 lg:pt-[92px]">
      {/* Gradient + header + hero grouped so gap-r-xl isn't inserted between them */}
      <div>
        <SiteHeader />
        <section className="relative z-10">
          <CaseStudyHero
            titleTop="First Table"
            titleBottom="booking app"
            lead="A full rebuild of the booking app."
            description="First Table had a product people loved and an app that got in their way. The dev team and I rebuilt the design system and the native app. Six months in, onboarding completion was up 21% and conversion up 12.3%."
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
          <Stats className="md:grid-cols-2">
            <Stat size="lg" value="1.7M" label="App users" />
            <Stat size="lg" tone="highlight-dark" value="1.2" label="Bookings per user per year" />
          </Stats>
          <KeyParagraph className="lg:max-w-[916px]">
            I joined First Table as its first designer. The product itself worked. People knew
            what it was for, the community was there, and the restaurants were real. The app
            was the part letting it down: inconsistent, inaccessible, and a slog to get
            through.
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

      {/* 03 — Research */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="03" name="Research" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <KeyParagraph lead="Understanding diner motivation" className="lg:max-w-[916px]">
            Before redesigning anything I wanted to know who we were designing for. We ran a
            behavioural segmentation study over the last 13 months of bookings, then added
            survey research to get at what the numbers couldn’t tell us: why people book, and
            what stops them.
          </KeyParagraph>
        </Reveal>
        <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-4xl">
          <Stats className="md:grid-cols-3">
            <Stat size="lg" tone="highlight-subtle" value="400k+" label="Transactions analysed" />
            <Stat size="lg" tone="highlight-subtle" value="10k" label="User survey responses" />
            <Stat size="lg" tone="highlight-subtle" value="5" label="User groups identified" />
          </Stats>
          <FTResearchMedia />
        </Reveal>
        <Reveal index={3} delay={0.6} className="flex w-full flex-col gap-r-md">
          {findings.map((f) => (
            <Column
              key={f.label}
              label={f.label}
              title={f.title}
              labelClassName="b-xs md:b-sm lg:b-sm"
              textClassName="b-xs md:b-sm"
            >
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

      {/* 04 — Design System */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="04" name="Design System" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <KeyParagraph className="lg:max-w-[916px]">
            Alongside the research, before touching a single screen, I built a new design
            system. Design and engineering needed to be working from the same tokens, the same
            components, the same patterns. Without that, any UI work would only add to the
            inconsistency we were trying to fix.
          </KeyParagraph>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          <FTDesignSystemMedia />
        </Reveal>
        {/* Three supporting notes — B-sm throughout, a step below the section body
            (Figma 1394:101631): stacked on mobile, 3-up from tablet. */}
        <Reveal index={3} delay={0.6} className="flex w-full flex-col gap-3xl md:grid md:grid-cols-3 md:gap-lg">
          {systemPrinciples.map((p) => (
            <div key={p.title} className="flex flex-col items-start gap-md md:gap-lg">
              <p className="b-xs text-text-primary-highlight md:b-sm">{p.title}</p>
              <p className="b-xs text-text-secondary md:b-sm">{p.body}</p>
            </div>
          ))}
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 05 — Redesign */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="05" name="Redesign" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <KeyParagraph className="lg:max-w-[953px]">
            With the system in place we went after the main flows. The IA had grown into a
            mess of overlapping paths that made the app slower to use and harder to maintain.
            I stripped it back and rebuilt the core journeys.
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

      {/* 06 — Validation */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="06" name="Validation" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <KeyParagraph lead="150+ A/B tests run" className="lg:max-w-[953px]">
            No change shipped on intuition alone. We ran continuous usability research and
            more than 150 A/B tests a year. With 1.5 million monthly active users, every
            decision got checked against real behaviour before it reached production. Losing
            variants got cut. Winners got built on.
          </KeyParagraph>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          <FTValidationMedia />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 07 — Outcome */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="07" name="Outcome" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <Stats className="md:grid-cols-3">
            <Stat size="outcome" value="+51%" label="Sign-ups increase" />
            <Stat size="outcome" value="+21%" label="Onboarding completion" />
            <Stat size="outcome" value="+12.3%" label="Conversion rate increase" />
          </Stats>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          <Column label="Closing the loop">
            First Table already made going out for dinner affordable for a lot more people.
            The rebuild was about getting the app out of the way, so the only thing a diner
            notices is the table they just booked.
          </Column>
        </Reveal>
        <Reveal index={3} delay={0.6} className="w-full">
          <FTOutcomeMedia />
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
