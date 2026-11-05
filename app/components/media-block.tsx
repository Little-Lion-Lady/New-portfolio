import Image from "next/image";
import { GlassFrame, GlassImage, DEFAULT_QUALITY } from "./work-image";
import { LoopingVideo } from "./looping-video";
import { blurFor } from "./image-blur";
import { sizesFor } from "./image-sizes";

// Figma image collages for §02 (100:6005), §04 (100:6193), §06 (495:3594).
// Corner radius follows Figma: main image blocks are sharp; §06 phone frames are rounded.


// §02 Approach — a phone screen beside a wide screenshot. Stacks on mobile.
export function ApproachMedia() {
  return (
    <div className="flex gap-2xs md:gap-sm lg:gap-md flex-col md:flex-row md:items-stretch">
      {/* MOH4 + MOH5 share one row height: flex-grow proportional to each
          image's own ratio (flex-basis 0) + matching frameAspectRatio makes
          the browser resolve a common height and correct, uncropped widths.
          min-w-0 on both is load-bearing: a flex item's default min-width:auto
          is transferred from its aspect-ratio, which lets MOH5 claim its full
          1256/460 width instead of its flex share and push the row past the
          page padding (Safari does this; Chrome squeezes it instead). With
          min-w-0 the flex ratios always win and the row can never overflow —
          the inner box already clips the few px of ratio skew. */}
      <GlassImage
        src="/home/work/covid-tracer/covid-tracer-sign-in-heatmap-before.jpg"
        alt="Click heatmap over the original poster-scan sign-in screen, before the redesign"
        frameAspectRatio="260/460"
        className="mx-auto w-[165px] shrink-0 md:mx-0 md:w-auto md:min-w-0 md:shrink md:flex-[0.5652]"
      />
      <GlassImage
        src="/home/work/covid-tracer/covid-tracer-sign-in-dropoff-funnel.jpg"
        alt="Drop-off funnel across the three sign-in screens, with the largest loss between the first and the second"
        frameAspectRatio="1256/460"
        className="w-full md:w-auto md:min-w-0 md:flex-[2.7304]"
      />
    </div>
  );
}

// §04 Design — the wide onboarding flow diagram above the design boards.
export function FlowDiagram() {
  return (
    <GlassImage
      src="/home/work/covid-tracer/covid-tracer-onboarding-flow-diagram.jpg"
      alt="Onboarding flow diagram, from the app store listing through to Bluetooth Tracing switched on"
      aspectRatio="1560/513"
      className="w-full"
    />
  );
}

// §04 Design — two annotated design boards, then a wide full-width shot below.
export function DesignMedia() {
  return (
    <div className="flex gap-2xs md:gap-sm lg:gap-md flex-col">
      {/* Figma 1144:10318 — the two boards stack full-width through tablet and
          split into two equal 818 columns at desktop. Same frame ratio on both
          from md up, so equal flex shares already resolve one shared height;
          min-w-0 stops each frame's aspect-derived min-width from claiming
          more than its flex share and overflowing the row. */}
      <div className="flex gap-2xs md:gap-sm lg:gap-md flex-col lg:flex-row">
        <GlassImage
          src="/home/work/covid-tracer/covid-tracer-dashboard-bluetooth-states.png"
          alt="Five dashboard variants showing every Bluetooth Tracing status state"
          frameAspectClassName="aspect-[361/220] md:aspect-[944/500] lg:aspect-[818/500]"
          className="w-full lg:min-w-0 lg:flex-1"
        />
        <GlassImage
          src="/home/work/covid-tracer/covid-tracer-poster-scan-before-after.png"
          alt="Poster scan sign-in screen, before and after the redesign"
          frameAspectClassName="aspect-[361/200] md:aspect-[944/500] lg:aspect-[818/500]"
          className="w-full lg:min-w-0 lg:flex-1"
        />
      </div>
      <GlassImage
        src="/home/work/covid-tracer/covid-tracer-bluetooth-page-design-board.jpg"
        alt="Annotated design board working through variants of the Bluetooth Tracing page"
        aspectRatio="1560/768"
        className="w-full"
      />
    </div>
  );
}

// §05 Validation — the two test rounds: a click heatmap and the round's metrics
// beside a recorded session. Figma 1831:42841 (desktop) / 1831:50704 (tablet) /
// 1831:50716 (mobile). Desktop pairs the two narrow shots into one 816 column
// beside the 816-wide session recording; tablet keeps that pair as a row of two
// but takes the full width, and mobile stacks all three.
export function ValidationMedia() {
  return (
    <div className="flex gap-2xs md:gap-sm lg:gap-md flex-col lg:flex-row lg:items-stretch">
      <div className="flex gap-2xs md:gap-sm lg:gap-md flex-col md:flex-row md:items-stretch lg:min-w-0 lg:flex-1">
        {/* The heatmap and the metrics sheet have different ratios but share a
            row height from md up — the justified-row technique used by MOH4/MOH5
            above: flex-basis 0, flex-grow proportional to each image's own
            ratio, with that same ratio on the frame. Both carry their TRUE
            ratio rather than Figma's frame, which trims the metric cards' icons
            off the top of the sheet at tablet and desktop; matching ratios
            still resolve one shared row height, so nothing is cropped and the
            row still lines up. */}
        <GlassImage
          src="/home/work/covid-tracer/covid-tracer-test-round-heatmap.png"
          alt="Click heatmap over the poster scan screen from the first test round"
          frameAspectRatio="560/947"
          className="w-full md:w-auto md:min-w-0 md:flex-[0.5913]"
        />
        <GlassImage
          src="/home/work/covid-tracer/covid-tracer-test-round-metrics.png"
          alt="Test round metrics: 8% misclick rate, 10.8s average, 64% success, 12% bounce; 9 of 25 testers left after screen 1"
          frameAspectRatio="651/947"
          hairline={false}
          className="w-full md:w-auto md:min-w-0 md:flex-[0.6874]"
        />
      </div>
      {/* At desktop this sits beside the pair and takes its height from them
          rather than from a ratio of its own: the pair's shared height follows
          from their two true ratios, so any fixed aspect here would be the
          taller box and would stretch the pair instead (the nesting trap
          documented on the §06 rows below). aspect-auto + the row's stretch
          makes the recording follow the pair exactly, at every desktop width. */}
      <GlassImage
        src="/home/work/covid-tracer/covid-tracer-usability-session-recording.png"
        alt="Recorded usability session running the Bluetooth Tracing prototype"
        frameAspectClassName="aspect-[361/262] md:aspect-[944/722] lg:aspect-auto"
        className="w-full lg:min-w-0 lg:flex-1"
      />
    </div>
  );
}

// §06 Outcome — the shipped screens, the app-store ratings, the launch numbers
// and the Ministry press shot. Figma 1144:10358 (desktop) / 1144:10512 (tablet)
// / 1831:50683 (mobile).
//
// The shipped screens ship as two different exports rather than one responsive
// crop: desktop gets all six in a single wide strip, tablet and mobile get them
// as two rows of three. The two sets also sit in a different order — desktop
// leads with the strip and then pairs the ratings card with the launch numbers,
// while tablet/mobile run ratings → strip 1 → strip 2 → numbers straight down —
// so each breakpoint gets its own block rather than one reordered flex column.
const OUTCOME_RATINGS_ALT =
  "NZ COVID Tracer app store listing, March 2020 beside July 2021: the rating rises from 2.1 to 4.2 stars";
const OUTCOME_NUMBERS_ALT =
  "Launch numbers: 2.8M+ registered users, 300M+ poster scans and manual entries, 1.5M+ users with Bluetooth tracing on";
const OUTCOME_SCREENS_ALT = "The shipped NZ COVID Tracer onboarding and dashboard screens";

export function OutcomeMedia() {
  return (
    <div className="flex gap-2xs md:gap-sm lg:gap-md flex-col">
      {/* Mobile + tablet — one full-width column, screens split across two shots */}
      <div className="flex gap-2xs md:gap-sm flex-col lg:hidden">
        <GlassImage
          src="/home/work/covid-tracer/covid-tracer-app-store-rating-before-after.jpg"
          alt={OUTCOME_RATINGS_ALT}
          frameAspectClassName="aspect-[361/225] md:aspect-[944/500]"
          className="w-full"
        />
        <GlassImage
          src="/home/work/covid-tracer/covid-tracer-shipped-screens-mobile-1.png"
          alt="Shipped screens: Bluetooth tracing setup, the thank-you screen and the dashboard"
          sizes="(min-width: 1024px) 64px, (min-width: 768px) 829px, 362px"
          frameAspectClassName="aspect-[361/225] md:aspect-[944/583]"
          className="w-full"
        />
        <GlassImage
          src="/home/work/covid-tracer/covid-tracer-shipped-screens-mobile-2.png"
          alt="Shipped screens: poster scanner, Bluetooth tracing switched on and a recorded visit"
          sizes="(min-width: 1024px) 64px, (min-width: 768px) 829px, 362px"
          frameAspectClassName="aspect-[361/225] md:aspect-[944/583]"
          className="w-full"
        />
        <GlassImage
          src="/home/work/covid-tracer/covid-tracer-launch-numbers.jpg"
          alt={OUTCOME_NUMBERS_ALT}
          frameAspectClassName="aspect-[361/225] md:aspect-[944/600]"
          className="w-full"
        />
      </div>
      {/* Desktop — the wide six-screen strip, then ratings beside the numbers */}
      <div className="hidden lg:flex lg:flex-col lg:gap-md">
        <GlassImage
          src="/home/work/covid-tracer/covid-tracer-shipped-screens-desktop.png"
          alt={OUTCOME_SCREENS_ALT}
          sizes="(min-width: 1024px) 1374px, 64px"
          frameAspectClassName="lg:aspect-[1648/574]"
          className="w-full"
        />
        <div className="flex gap-md">
          <GlassImage
            src="/home/work/covid-tracer/covid-tracer-app-store-rating-before-after.jpg"
            alt={OUTCOME_RATINGS_ALT}
            frameAspectClassName="lg:aspect-[818/500]"
            className="min-w-0 flex-1"
          />
          <GlassImage
            src="/home/work/covid-tracer/covid-tracer-launch-numbers.jpg"
            alt={OUTCOME_NUMBERS_ALT}
            frameAspectClassName="lg:aspect-[818/500]"
            className="min-w-0 flex-1"
          />
        </div>
      </div>
      <GlassImage
        src="/home/work/covid-tracer/covid-tracer-ministry-briefing.jpg"
        alt="Dr Ashley Bloomfield holding up the NZ COVID Tracer app at a Ministry of Health briefing"
        frameAspectClassName="aspect-[361/200] md:aspect-[944/455] lg:aspect-[1648/710]"
        objectPosition="left"
        className="w-full"
      />
    </div>
  );
}

/* ── BASIS case study media blocks ──────────────────────────────────────── */


// §03 Research — a stacked column of 3 result shots beside a wide detail image.
// Column stacks above the detail image through tablet, sits beside it only from desktop up.
export function ResearchMedia() {
  return (
    <div className="flex gap-r-2xs flex-col lg:flex-row lg:items-stretch">
      <div className="flex gap-r-2xs flex-col lg:w-1/3">
        <GlassImage src="/home/work/basis/basis-research-interview-annotating-concepts.jpg" alt="Research participant annotating printed concepts during a home energy interview" className="h-[158px] w-full lg:h-auto lg:flex-1" />
        <GlassImage src="/home/work/basis/basis-research-interview-participant.jpg" alt="Research participant mid-interview during home energy research" className="h-[158px] w-full lg:h-auto lg:flex-1" />
        <GlassImage src="/home/work/basis/basis-research-participant-printed-screens.jpg" alt="Research participant reviewing printed screens beside a laptop" className="h-[158px] w-full lg:h-auto lg:flex-1" />
      </div>
      {/* 931×601 is BS7's real ratio — aspect-[931/601] through tablet
          (matching lg's already-correct value) shows the whole photo
          instead of cropping to a fixed 227px. */}
      <GlassImage
        src="/home/work/basis/basis-desk-research-board.png"
        alt="Desk research board of market findings, charts and competitor teardowns"
        className="aspect-[931/601] w-full lg:aspect-[931/601] lg:h-auto lg:w-2/3 lg:flex-none"
      />
    </div>
  );
}

// §05 Process — a wide flow diagram above a taller detail shot.
export function ProcessMedia() {
  return (
    <div className="flex flex-col gap-2xs md:gap-sm lg:gap-md">
      <GlassImage src="/home/work/basis/basis-competitor-feature-matrix.jpg" alt="Colour-coded matrix comparing features across competitor products" className="aspect-[3168/1235] w-full" />
      {/* BS9's real ratio is 1600×1395 — aspect-[1600/1395] replaces the
          fixed heights (306/524px mobile/tablet, 1414px desktop) that were
          cropping it at every breakpoint. */}
      <GlassImage src="/home/work/basis/basis-affinity-map-workshop.png" alt="Affinity map clustering research notes into themes on a workshop board" className="aspect-[1600/1395] w-full" />
    </div>
  );
}

// §06 Solution design — row of two shots.
export function SolutionMedia() {
  return (
    <div className="flex gap-r-2xs flex-col">
      {/* BS12 (near-square, 1866×1812) and BS13 (wide, 1600×1092) share one
          row height from md up via the justified-row technique: flex-basis:0
          + flex-grow proportional to each image's own ratio, with a matching
          frameAspectRatio on each. A fixed width on BS12 (the old approach)
          stretched BS13's outer frame to match BS12's tall height while its
          inner photo only filled its own shorter aspect-derived height,
          leaving BS13 visibly padded with empty space — flex-grow removes
          that gap by giving both a shared height and proportional width. */}
      <div className="flex gap-r-2xs flex-col lg:flex-row lg:items-stretch">
        <GlassImage
          src="/home/work/basis/basis-beta-app-flow-diagram.png"
          alt="Full app flow diagram for the beta build"
          frameAspectRatio="1866/1812"
          className="w-full lg:w-auto lg:flex-[1.0298]"
        />
        <GlassImage
          src="/home/work/basis/basis-wireframe-flows.png"
          alt="Low-fidelity wireframe flows for the main app journeys"
          frameAspectRatio="1600/1092"
          className="w-full lg:w-auto lg:flex-[1.4652]"
        />
      </div>
    </div>
  );
}

// §06 Prototype testing — a strip of four screenshots, with two participant
// photos (plain rounded images, no glass frame). Below the strip on mobile
// (side by side), pinned to the right of it from tablet up.
export function PrototypeMedia() {
  return (
    <div className="flex flex-col gap-r-2xs lg:flex-row lg:items-end lg:justify-between lg:gap-2xl">
      {/* BS14–BS17 are all effectively the same 219×478 ratio, so a single
          aspectRatio (inner-box, no-crop) per image plus width-only classes
          is enough — height always derives correctly from whatever width
          each breakpoint's layout resolves to. Always a single row of four
          at every breakpoint — no 2×2 grid fallback. flex-1 (not w-1/4) so
          gap-xs is subtracted from the available width instead of added on
          top of four 25% bases, which doesn't overflow and so doesn't need
          overflow-hidden to hide it — a fix that was also clipping every
          card's drop shadow. lg:flex-1 on the row itself is still needed
          once the outer container becomes lg:flex-row: without it this div
          has no width source of its own (children are all flex-basis:0, so
          they can't contribute one), and collapses to 0. */}
      <div className="flex gap-r-2xs lg:flex-1">
        <GlassImage src="/home/work/basis/basis-prototype-savings-notifications.png" alt="Prototype screen: projected annual savings with a prompt to enable notifications" aspectRatio="219/478" className="flex-1" />
        <GlassImage src="/home/work/basis/basis-prototype-hot-water-circuit.png" alt="Prototype screen: hot water circuit showing live usage and running cost" aspectRatio="219/478" className="flex-1" />
        <GlassImage src="/home/work/basis/basis-prototype-standby-confirm.jpg" alt="Prototype screen: hold-to-confirm control for putting a circuit on standby" aspectRatio="219/478" className="flex-1" />
        <GlassImage src="/home/work/basis/basis-prototype-usage-breakdown.png" alt="Prototype screen: usage breakdown with monthly cost and a daily bar chart" aspectRatio="219/477" className="flex-1" />
      </div>
      {/* max-w-[190px] on mobile/tablet caps each participant photo's width;
          lg's own layout (fixed 243px column, flex-none) needs it
          cancelled, but lg:max-w-none didn't win the cascade against the
          arbitrary mobile value (computed max-width stuck at 0px) — an
          arbitrary lg value of its own avoids that named-vs-arbitrary-value
          ordering conflict. */}
      <div className="flex justify-center gap-r-2xs lg:w-[243px] lg:shrink-0 lg:flex-col">
        <div className="relative max-w-[190px] flex-1 aspect-[243/160] overflow-hidden rounded-lg lg:aspect-auto lg:h-[160px] lg:max-w-[400px] lg:flex-none">
          <Image src="/home/work/basis/basis-prototype-testing-participant.jpg" alt="Remote prototype test call with a participant, face blurred for privacy" fill quality={DEFAULT_QUALITY} sizes={sizesFor("/home/work/basis/basis-prototype-testing-participant.jpg")} placeholder="blur" blurDataURL={blurFor("/home/work/basis/basis-prototype-testing-participant.jpg")} className="object-cover" />
        </div>
        <div className="relative max-w-[190px] flex-1 aspect-[243/160] overflow-hidden rounded-lg lg:aspect-auto lg:h-[160px] lg:max-w-[400px] lg:flex-none">
          <Image src="/home/work/basis/basis-prototype-testing-facilitator.jpg" alt="Maryna Babych facilitating a remote prototype test call" fill quality={DEFAULT_QUALITY} sizes={sizesFor("/home/work/basis/basis-prototype-testing-facilitator.jpg")} placeholder="blur" blurDataURL={blurFor("/home/work/basis/basis-prototype-testing-facilitator.jpg")} className="object-cover" />
        </div>
      </div>
    </div>
  );
}

// §07 Outcome — a hero shot (BS20) above the screenshot strip. Strip is a
// single horizontal scroll row on mobile; from tablet up it splits into two
// centred, non-scrolling stacked rows (cards may bleed past the content edge
// since row 2's 5 cards don't fit the content width even at desktop).
const OUTCOME_ROW1 = ["basis-shipped-welcome", "basis-shipped-panel-activation", "basis-shipped-insights", "basis-shipped-monthly-cost"];
const OUTCOME_ROW2 = ["basis-shipped-usage-breakdown", "basis-shipped-circuits-list", "basis-shipped-hot-water-detail", "basis-shipped-routines", "basis-shipped-events-log"];

// All nine strip photos are ~390×844 (BS29 is 390×853) — near-identical
// ratios, so independent per-image aspectRatio (width-driven, no crop)
// naturally gives matching heights too, with no justified-row trick needed.
const OUTCOME_STRIP_RATIO: Record<string, string> = {
  "basis-shipped-welcome": "390/844",
  "basis-shipped-panel-activation": "390/844",
  "basis-shipped-insights": "390/844",
  "basis-shipped-monthly-cost": "390/844",
  "basis-shipped-usage-breakdown": "390/844",
  "basis-shipped-circuits-list": "390/844",
  "basis-shipped-hot-water-detail": "390/844",
  "basis-shipped-routines": "390/844",
  "basis-shipped-events-log": "390/853",
};

// One description per shipped screen. A single shared string here meant a
// screen reader announced the same nine words nine times in a row.
const OUTCOME_STRIP_ALT: Record<string, string> = {
  "basis-shipped-welcome": "Shipped app: welcome screen inviting a new user to start setup",
  "basis-shipped-panel-activation": "Shipped app: instructions for activating the smart panel",
  "basis-shipped-insights": "Shipped app: insights screen with estimated charges, total usage and energy sources",
  "basis-shipped-monthly-cost": "Shipped app: monthly cost with a daily usage bar chart",
  "basis-shipped-usage-breakdown": "Shipped app: usage breakdown ring with cost split by circuit",
  "basis-shipped-circuits-list": "Shipped app: circuits list showing each appliance and whether it is on",
  "basis-shipped-hot-water-detail": "Shipped app: hot water cylinder detail with live status and a standby control",
  "basis-shipped-routines": "Shipped app: routines screen with active and upcoming automations",
  "basis-shipped-events-log": "Shipped app: events log of circuit and panel activity",
};

function OutcomeStripImage({ name }: { name: string }) {
  return (
    <GlassImage
      src={`/home/work/basis/${name}.png`}
      alt={OUTCOME_STRIP_ALT[name]}
      aspectRatio={OUTCOME_STRIP_RATIO[name]}
      className="w-[220px] shrink-0 md:w-[281px] lg:w-[332px]"
    />
  );
}

export function BasisOutcomeMedia() {
  return (
    <div className="flex flex-col gap-r-2xs">
      <GlassImage src="/home/work/basis/basis-app-in-use-at-home.jpg" alt="Someone using the Basis app on a phone at home" className="h-[198px] w-full md:h-[331px] lg:h-[540px]" />
      {/* Mobile — single continuous scroll strip, bled full-bleed past
          <main>'s own px-md gutter (-mx-md) so cards aren't cropped at the
          page's edges and can scroll all the way to the true screen edge —
          same technique as ArtworkStrip's BLEED_CLASS. overflow-x-auto
          forces overflow-y to auto too (can't have one axis scrollable and
          the other visible), which clips each card's box-shadow at the top/
          bottom edge — py-sm gives the shadow's ~10px blur room to render
          inside the scroll box instead of being cut off. */}
      <div className="-mx-md flex gap-r-2xs overflow-x-auto py-sm md:hidden">
        {[...OUTCOME_ROW1, ...OUTCOME_ROW2].map((name) => (
          <OutcomeStripImage key={name} name={name} />
        ))}
      </div>
      {/* Tablet/desktop — two stacked rows, centred, no horizontal scroll */}
      <div className="hidden flex-col items-center gap-r-2xs md:flex">
        <div className="flex justify-center gap-r-2xs">
          {OUTCOME_ROW1.map((name) => (
            <OutcomeStripImage key={name} name={name} />
          ))}
        </div>
        <div className="flex justify-center gap-r-2xs">
          {OUTCOME_ROW2.map((name) => (
            <OutcomeStripImage key={name} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── FIRST TABLE case study media blocks ────────────────────────────────── */

// Figma "Case Study 3" (1394:101589). Every block below uses the Figma frame
// ratio per breakpoint (mobile 393 / tablet 1024 / desktop 1728 artboards) via
// aspect-* on the outer glass frame, so the photo crops exactly as designed.
const FT = "/home/work/first-table";

// §01 Problem — one full-width screenshot below the stats + key paragraph.
export function FTProblemMedia() {
  return (
    <GlassImage
      src={`${FT}/first-table-legacy-app-screens-light.png`}
      darkSrc={`${FT}/first-table-legacy-app-screens-dark.png`}
      alt="Board of the legacy First Table app screens, before the rebuild"
      className="w-full aspect-[361/134] md:aspect-[944/318] lg:aspect-[1584/514]"
    />
  );
}

// §02 Research — segmentation charts. Stacked through tablet, side by side at desktop.
export function FTResearchMedia() {
  return (
    <div className="flex gap-r-2xs flex-col lg:flex-row lg:items-start">
      <GlassImage
        src={`${FT}/first-table-diner-segmentation-light.png`}
        darkSrc={`${FT}/first-table-diner-segmentation-dark.png`}
        alt="Diner segments by size and recent activity: Casual Mainstream is the largest, Flash & Gone the least active"
        className="w-full aspect-[361/255] md:aspect-[944/628] lg:aspect-[782/502] lg:flex-1"
      />
      <GlassImage
        src={`${FT}/first-table-survey-findings.png`}
        alt="Casual Mainstream persona: about a third of diners, aged 40+, who struggle to find what they like and forget the app"
        className="w-full aspect-[361/231] md:aspect-[944/569] lg:aspect-[782/502] lg:flex-1"
      />
    </div>
  );
}

// §03 Design System — component library sheet above the token sheet. The token
// sheet ships as a light and a dark export (Figma node "8_Light"), so both are
// rendered and the `dark:` variant (see globals.css) swaps them with the theme.
export function FTDesignSystemMedia() {
  const tokenSheet = "w-full aspect-[361/180] md:aspect-[944/437] lg:aspect-[1584/796]";
  return (
    <div className="flex gap-r-2xs flex-col">
      <GlassImage
        src={`${FT}/first-table-design-tokens-light.png`}
        darkSrc={`${FT}/first-table-design-tokens-dark.png`}
        alt="Design system foundations: grid, radius, colour and typography tokens"
        className="w-full aspect-[361/227] md:aspect-[944/553] lg:aspect-[1584/993]"
      />
      <GlassImage
        src={`${FT}/first-table-component-library-light.png`}
        darkSrc={`${FT}/first-table-component-library-dark.png`}
        alt="Component library: buttons, filters, inputs, restaurant cards and alerts"
        className={tokenSheet}
      />
    </div>
  );
}

// §04 Redesign — the rebuilt core flow across the top, then three component
// details. Details stack on mobile (each keeps its own Figma height), sit in a
// single row from tablet up. Each detail frame is a flat Blue-100 fill with the
// component's screen recording looping on top, centred; the third frame stacks
// two. Video widths are a share of the frame so they scale with it — taken from
// each recording's size against its Figma still.
// Each recording is a white card on its own, so it gets the card's rounding and
// shadow here rather than in the file. video3/video4 carry a 2px black sliver
// along one edge from the capture — the box ratio is a couple of px tighter than
// the source and object-position pins the opposite edge, cropping it off.
const DETAIL_CARD = "rounded-sm shadow-[0_2px_20px_var(--shadows-shadow-02)]";

type DetailVideo = {
  src: string;
  label: string;
  width: string;
  aspectRatio: string;
  objectPosition?: string;
};

const REDESIGN_DETAILS: {
  key: string;
  ratio: string;
  videos: DetailVideo[];
}[] = [
  {
    key: "region-picker",
    ratio: "aspect-[361/363]",
    videos: [
      {
        src: `${FT}/first-table-region-picker-demo.mp4`,
        label: "First Table region picker",
        width: "w-[77%]",
        aspectRatio: "696/762",
      },
    ],
  },
  {
    key: "restaurant-card",
    ratio: "aspect-[361/279]",
    videos: [
      {
        src: `${FT}/first-table-restaurant-card-demo.mp4`,
        label: "First Table restaurant card",
        width: "w-[67%]",
        aspectRatio: "696/580",
      },
    ],
  },
  {
    key: "nav-and-tabs",
    ratio: "aspect-[361/210]",
    videos: [
      {
        src: `${FT}/first-table-bottom-nav-demo.mp4`,
        label: "First Table bottom navigation bar",
        width: "w-[80%]",
        aspectRatio: "782/208",
        objectPosition: "top",
      },
      {
        src: `${FT}/first-table-photos-menu-tabs-demo.mp4`,
        label: "First Table photos and menu tabs",
        width: "w-[80%]",
        aspectRatio: "778/202",
        objectPosition: "left",
      },
    ],
  },
];

export function FTRedesignMedia() {
  return (
    <div className="flex gap-r-2xs flex-col">
      <GlassImage
        src={`${FT}/first-table-booking-flow-single-step-light.png`}
        darkSrc={`${FT}/first-table-booking-flow-single-step-dark.png`}
        alt="Booking flow before and after: three legacy screens, then the rebuilt home, restaurant timeslots and booking sheet"
        /* The export is one wide strip of screens; the old per-breakpoint frame
           ratios were all narrower than the file, so object-cover shaved the
           outer screens off at every size. Sizing the inner box to the photo's
           own 2342x833 ratio keeps the whole flow visible as the frame scales. */
        aspectRatio="2342/833"
        className="w-full"
      />
      <div className="flex gap-r-2xs flex-col md:flex-row md:items-start">
        {REDESIGN_DETAILS.map((d) => (
          <GlassFrame
            key={d.key}
            className={`w-full ${d.ratio} md:aspect-[304/502] md:flex-1 lg:aspect-[514/502]`}
            innerClassName="flex flex-col items-center justify-center gap-sm bg-component-bg-detail-frame md:gap-lg lg:gap-3xl"
          >
            {d.videos.map((v) => (
              <LoopingVideo
                key={v.src}
                src={v.src}
                label={v.label}
                aspectRatio={v.aspectRatio}
                objectPosition={v.objectPosition}
                className={`${v.width} ${DETAIL_CARD}`}
              />
            ))}
          </GlassFrame>
        ))}
      </div>
    </div>
  );
}

// §05 Validation — six A/B test screens (1 col → 2 → 3) above a wider pair.
// Each shot was exported in whichever format came out smaller, and a light
// export's format doesn't always match its dark twin — so the pairs carry
// their own file names rather than a stem plus a fixed extension.
const VALIDATION_TESTS = [{ light: "first-table-ab-test-booking-payment-light.png", dark: "first-table-ab-test-booking-payment-dark.png" }, { light: "first-table-ab-test-home-offer-light.png", dark: "first-table-ab-test-home-offer-dark.png" }, { light: "first-table-ab-test-map-discovery-light.png", dark: "first-table-ab-test-map-discovery-dark.png" }, { light: "first-table-ab-test-time-picker-light.jpg", dark: "first-table-ab-test-time-picker-dark.jpg" }, { light: "first-table-ab-test-restaurant-detail-light.png", dark: "first-table-ab-test-restaurant-detail-dark.png" }, { light: "first-table-ab-test-restaurant-listing-light.png", dark: "first-table-ab-test-restaurant-listing-dark.png" }];

// One description per pair, keyed on the light-mode filename. Each board shows
// variant A beside variant B, so the alt names the screen under test rather
// than repeating "A/B test variant" six times.
const VALIDATION_ALT: Record<string, string> = {
  "first-table-ab-test-booking-payment-light.png": "A/B test pair: two versions of the booking confirmation and payment screen",
  "first-table-ab-test-home-offer-light.png": "A/B test pair: two versions of the home screen offer and booking prompt",
  "first-table-ab-test-map-discovery-light.png": "A/B test pair: two versions of the map discovery screen",
  "first-table-ab-test-time-picker-light.jpg": "A/B test pair: two versions of the Find a table time picker",
  "first-table-ab-test-restaurant-detail-light.png": "A/B test pair: two versions of the restaurant detail screen",
  "first-table-ab-test-restaurant-listing-light.png": "A/B test pair: two versions of the restaurant listing screen",
};

export function FTValidationMedia() {
  return (
    <div className="flex gap-r-2xs flex-col">
      <div className="grid gap-r-2xs grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {VALIDATION_TESTS.map((t) => (
          <GlassImage
            key={t.light}
            src={`${FT}/${t.light}`}
            darkSrc={`${FT}/${t.dark}`}
            alt={VALIDATION_ALT[t.light]}
            className="w-full aspect-[361/270] md:aspect-[464/400] lg:aspect-[514/400]"
          />
        ))}
      </div>
      <div className="flex gap-r-2xs flex-col lg:flex-row lg:items-start">
        <GlassImage
          src={`${FT}/first-table-usability-session-light.png`}
          darkSrc={`${FT}/first-table-usability-session-dark.png`}
          alt="A/B test of permission onboarding: separate notification and tracking screens (A) against one combined screen (B)"
          className="w-full aspect-[361/214] md:aspect-[944/473] lg:aspect-[782/473] lg:flex-1"
        />
        <GlassImage
          src={`${FT}/first-table-experiment-results-light.png`}
          darkSrc={`${FT}/first-table-experiment-results-dark.png`}
          alt="A/B/C test of home search: a compact search bar (A), stacked dropdowns (B) and quick search by meal (C)"
          className="w-full aspect-[361/210] md:aspect-[944/473] lg:aspect-[782/473] lg:flex-1"
        />
      </div>
    </div>
  );
}

// §06 Outcome — shipped app screens. From tablet up they sit in two centred
// rows (4 above 5), both wider than the content column so they bleed evenly
// past both edges exactly as in Figma (<body> already clips overflow-x). On
// mobile the two rows become one horizontal scroll strip, the same treatment
// the Basis outcome screens get.
const OUTCOME_ROW_1 = [{ light: "first-table-shipped-welcome-light.jpg", dark: "first-table-shipped-welcome-dark.jpg" }, { light: "first-table-shipped-home-light.png", dark: "first-table-shipped-home-dark.jpg" }, { light: "first-table-shipped-map-light.png", dark: "first-table-shipped-map-dark.png" }, { light: "first-table-shipped-filters-light.png", dark: "first-table-shipped-filters-dark.png" }];
const OUTCOME_ROW_2 = [{ light: "first-table-shipped-bookings-light.jpg", dark: "first-table-shipped-bookings-dark.jpg" }, { light: "first-table-shipped-booking-detail-light.jpg", dark: "first-table-shipped-booking-detail-dark.jpg" }, { light: "first-table-shipped-loyalty-light.png", dark: "first-table-shipped-loyalty-dark.png" }, { light: "first-table-shipped-wallet-light.png", dark: "first-table-shipped-wallet-dark.jpg" }, { light: "first-table-shipped-location-picker-light.png", dark: "first-table-shipped-location-picker-dark.png" }];

// Keyed on the light-mode filename, which is what identifies the screen; the
// dark export is the same screen in the other theme.
const FT_OUTCOME_ALT: Record<string, string> = {
  "first-table-shipped-welcome-light.jpg": "Shipped app: welcome screen offering 50% off the food bill",
  "first-table-shipped-home-light.png": "Shipped app: home screen with quick search and tonight's restaurants",
  "first-table-shipped-map-light.png": "Shipped app: map of nearby restaurants with prices and available times",
  "first-table-shipped-filters-light.png": "Shipped app: filter sheet for cuisine, time and suburb",
  "first-table-shipped-bookings-light.jpg": "Shipped app: bookings screen with upcoming, past and reviewable bookings",
  "first-table-shipped-booking-detail-light.jpg": "Shipped app: booking detail with restaurant, time, party size and conditions",
  "first-table-shipped-loyalty-light.png": "Shipped app: Frequent Foodies loyalty screen with status points and activity",
  "first-table-shipped-wallet-light.png": "Shipped app: wallet with dining credit, payment methods and vouchers",
  "first-table-shipped-location-picker-light.png": "Shipped app: location picker listing New Zealand regions",
};

function FTOutcomeScreen({ shot }: { shot: { light: string; dark: string } }) {
  return (
    <GlassImage
      src={`${FT}/${shot.light}`}
      darkSrc={`${FT}/${shot.dark}`}
      alt={FT_OUTCOME_ALT[shot.light]}
      className="w-[220px] shrink-0 aspect-[390/840] md:w-[281px] lg:w-[332px]"
    />
  );
}

export function FTOutcomeMedia() {
  return (
    // No `items-center` on this column: the mobile strip below has to stretch
    // for its negative margins to widen it rather than just shift it left.
    // The tablet/desktop group centres its own rows instead.
    <div className="flex flex-col gap-r-2xs">
      {/* Mobile — one continuous scroll strip, bled full-bleed past <main>'s
          own px-md gutter (-mx-md) so cards aren't cropped at the page's edges
          and can scroll to the true screen edge. overflow-x-auto forces
          overflow-y to auto too, which would clip each card's box-shadow at the
          top/bottom edge — py-sm gives the shadow's blur room inside the scroll
          box. Same treatment as BasisOutcomeMedia. */}
      <div className="-mx-md flex gap-r-2xs overflow-x-auto py-sm md:hidden">
        {[...OUTCOME_ROW_1, ...OUTCOME_ROW_2].map((shot) => (
          <FTOutcomeScreen key={shot.light} shot={shot} />
        ))}
      </div>
      {/* Tablet/desktop — two centred rows, no horizontal scroll */}
      <div className="hidden flex-col items-center gap-r-2xs md:flex">
        {[OUTCOME_ROW_1, OUTCOME_ROW_2].map((row, i) => (
          <div key={i} className="flex justify-center gap-r-2xs">
            {row.map((shot) => (
              <FTOutcomeScreen key={shot.light} shot={shot} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
