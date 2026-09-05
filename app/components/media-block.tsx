import Image from "next/image";
import { GlassFrame, GlassImage, DEFAULT_QUALITY } from "./work-image";
import { LoopingVideo } from "./looping-video";

// Figma image collages for §02 (100:6005), §04 (100:6193), §06 (495:3594).
// Corner radius follows Figma: main image blocks are sharp; §06 phone frames are rounded.

const COVID_ALT = "NZ COVID Tracer app screen";

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
        src="/home/work/covid-tracer/MOH4.jpg"
        alt={COVID_ALT}
        frameAspectRatio="260/460"
        className="mx-auto w-[165px] shrink-0 md:mx-0 md:w-auto md:min-w-0 md:shrink md:flex-[0.5652]"
      />
      <GlassImage
        src="/home/work/covid-tracer/MOH5.jpg"
        alt={COVID_ALT}
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
      src="/home/work/covid-tracer/MOH6.jpg"
      alt={COVID_ALT}
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
          src="/home/work/covid-tracer/MOH_33.png"
          alt="Five dashboard variants showing every Bluetooth Tracing status state"
          frameAspectClassName="aspect-[361/220] md:aspect-[944/500] lg:aspect-[818/500]"
          className="w-full lg:min-w-0 lg:flex-1"
        />
        <GlassImage
          src="/home/work/covid-tracer/MOH_34.png"
          alt="Poster scan sign-in screen, before and after the redesign"
          frameAspectClassName="aspect-[361/200] md:aspect-[944/500] lg:aspect-[818/500]"
          className="w-full lg:min-w-0 lg:flex-1"
        />
      </div>
      <GlassImage
        src="/home/work/covid-tracer/MOH10.jpg"
        alt={COVID_ALT}
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
          src="/home/work/covid-tracer/MOH_29.png"
          alt="Click heatmap over the poster scan screen from the first test round"
          frameAspectRatio="560/947"
          className="w-full md:w-auto md:min-w-0 md:flex-[0.5913]"
        />
        <GlassImage
          src="/home/work/covid-tracer/MOH_30.png"
          alt="Test round metrics — mislick rate, duration, success and bounce — above the two-screen funnel"
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
        src="/home/work/covid-tracer/MOH_31.png"
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
  "Launch numbers: 2.8+ million registered users, 300,000,000+ poster scans and manual entries, 1.5+ million users with active Bluetooth tracing";
const OUTCOME_SCREENS_ALT = "The shipped NZ COVID Tracer onboarding and dashboard screens";

export function OutcomeMedia() {
  return (
    <div className="flex gap-2xs md:gap-sm lg:gap-md flex-col">
      {/* Mobile + tablet — one full-width column, screens split across two shots */}
      <div className="flex gap-2xs md:gap-sm flex-col lg:hidden">
        <GlassImage
          src="/home/work/covid-tracer/MOH11.jpg"
          alt={OUTCOME_RATINGS_ALT}
          frameAspectClassName="aspect-[361/225] md:aspect-[944/500]"
          className="w-full"
        />
        <GlassImage
          src="/home/work/covid-tracer/Mobile_screenshots_1.png"
          alt={OUTCOME_SCREENS_ALT}
          sizes="(min-width: 1024px) 64px, (min-width: 768px) 829px, 362px"
          frameAspectClassName="aspect-[361/225] md:aspect-[944/583]"
          className="w-full"
        />
        <GlassImage
          src="/home/work/covid-tracer/Mobile_screenshots_2.png"
          alt={OUTCOME_SCREENS_ALT}
          sizes="(min-width: 1024px) 64px, (min-width: 768px) 829px, 362px"
          frameAspectClassName="aspect-[361/225] md:aspect-[944/583]"
          className="w-full"
        />
        <GlassImage
          src="/home/work/covid-tracer/MOH12.jpg"
          alt={OUTCOME_NUMBERS_ALT}
          frameAspectClassName="aspect-[361/225] md:aspect-[944/600]"
          className="w-full"
        />
      </div>
      {/* Desktop — the wide six-screen strip, then ratings beside the numbers */}
      <div className="hidden lg:flex lg:flex-col lg:gap-md">
        <GlassImage
          src="/home/work/covid-tracer/Desktop_screenshots.png"
          alt={OUTCOME_SCREENS_ALT}
          sizes="(min-width: 1024px) 1374px, 64px"
          frameAspectClassName="lg:aspect-[1648/574]"
          className="w-full"
        />
        <div className="flex gap-md">
          <GlassImage
            src="/home/work/covid-tracer/MOH11.jpg"
            alt={OUTCOME_RATINGS_ALT}
            frameAspectClassName="lg:aspect-[818/500]"
            className="min-w-0 flex-1"
          />
          <GlassImage
            src="/home/work/covid-tracer/MOH12.jpg"
            alt={OUTCOME_NUMBERS_ALT}
            frameAspectClassName="lg:aspect-[818/500]"
            className="min-w-0 flex-1"
          />
        </div>
      </div>
      <GlassImage
        src="/home/work/covid-tracer/MOH16.jpg"
        alt="Dr Ashley Bloomfield holding up the NZ COVID Tracer app at a Ministry of Health briefing"
        frameAspectClassName="aspect-[361/200] md:aspect-[944/455] lg:aspect-[1648/710]"
        objectPosition="left"
        className="w-full"
      />
    </div>
  );
}

/* ── BASIS case study media blocks ──────────────────────────────────────── */

const BASIS_ALT = "Basis home app screen";

// §03 Research — a stacked column of 3 result shots beside a wide detail image.
// Column stacks above the detail image through tablet, sits beside it only from desktop up.
export function ResearchMedia() {
  return (
    <div className="flex gap-r-2xs flex-col lg:flex-row lg:items-stretch">
      <div className="flex gap-r-2xs flex-col lg:w-1/3">
        <GlassImage src="/home/work/basis/BS4.jpg" alt={BASIS_ALT} className="h-[158px] w-full lg:h-auto lg:flex-1" />
        <GlassImage src="/home/work/basis/BS5.jpg" alt={BASIS_ALT} className="h-[158px] w-full lg:h-auto lg:flex-1" />
        <GlassImage src="/home/work/basis/BS6.jpg" alt={BASIS_ALT} className="h-[158px] w-full lg:h-auto lg:flex-1" />
      </div>
      {/* 931×601 is BS7's real ratio — aspect-[931/601] through tablet
          (matching lg's already-correct value) shows the whole photo
          instead of cropping to a fixed 227px. */}
      <GlassImage
        src="/home/work/basis/BS7.png"
        alt={BASIS_ALT}
        className="aspect-[931/601] w-full lg:aspect-[931/601] lg:h-auto lg:w-2/3 lg:flex-none"
      />
    </div>
  );
}

// §05 Process — a wide flow diagram above a taller detail shot.
export function ProcessMedia() {
  return (
    <div className="flex flex-col gap-2xs md:gap-sm lg:gap-md">
      <GlassImage src="/home/work/basis/BS8.jpg" alt={BASIS_ALT} className="aspect-[3168/1235] w-full" />
      {/* BS9's real ratio is 1600×1395 — aspect-[1600/1395] replaces the
          fixed heights (306/524px mobile/tablet, 1414px desktop) that were
          cropping it at every breakpoint. */}
      <GlassImage src="/home/work/basis/BS9.png" alt={BASIS_ALT} className="aspect-[1600/1395] w-full" />
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
          src="/home/work/basis/BS12.png"
          alt={BASIS_ALT}
          frameAspectRatio="1866/1812"
          className="w-full lg:w-auto lg:flex-[1.0298]"
        />
        <GlassImage
          src="/home/work/basis/BS13.png"
          alt={BASIS_ALT}
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
        <GlassImage src="/home/work/basis/BS14.png" alt={BASIS_ALT} aspectRatio="219/478" className="flex-1" />
        <GlassImage src="/home/work/basis/BS15.png" alt={BASIS_ALT} aspectRatio="219/478" className="flex-1" />
        <GlassImage src="/home/work/basis/BS16.jpg" alt={BASIS_ALT} aspectRatio="219/478" className="flex-1" />
        <GlassImage src="/home/work/basis/BS17.png" alt={BASIS_ALT} aspectRatio="219/477" className="flex-1" />
      </div>
      {/* max-w-[190px] on mobile/tablet caps each participant photo's width;
          lg's own layout (fixed 243px column, flex-none) needs it
          cancelled, but lg:max-w-none didn't win the cascade against the
          arbitrary mobile value (computed max-width stuck at 0px) — an
          arbitrary lg value of its own avoids that named-vs-arbitrary-value
          ordering conflict. */}
      <div className="flex justify-center gap-r-2xs lg:w-[243px] lg:shrink-0 lg:flex-col">
        <div className="relative max-w-[190px] flex-1 aspect-[243/160] overflow-hidden rounded-lg lg:aspect-auto lg:h-[160px] lg:max-w-[400px] lg:flex-none">
          <Image src="/home/work/basis/BS18.jpg" alt="Basis prototype testing participant" fill quality={DEFAULT_QUALITY} sizes="243px" className="object-cover" />
        </div>
        <div className="relative max-w-[190px] flex-1 aspect-[243/160] overflow-hidden rounded-lg lg:aspect-auto lg:h-[160px] lg:max-w-[400px] lg:flex-none">
          <Image src="/home/work/basis/BS19.jpg" alt="Basis prototype testing participant" fill quality={DEFAULT_QUALITY} sizes="243px" className="object-cover" />
        </div>
      </div>
    </div>
  );
}

// §07 Outcome — a hero shot (BS20) above the screenshot strip. Strip is a
// single horizontal scroll row on mobile; from tablet up it splits into two
// centred, non-scrolling stacked rows (cards may bleed past the content edge
// since row 2's 5 cards don't fit the content width even at desktop).
const OUTCOME_ROW1 = ["BS21", "BS22", "BS23", "BS24"];
const OUTCOME_ROW2 = ["BS25", "BS26", "BS27", "BS28", "BS29"];

// All nine strip photos are ~390×844 (BS29 is 390×853) — near-identical
// ratios, so independent per-image aspectRatio (width-driven, no crop)
// naturally gives matching heights too, with no justified-row trick needed.
const OUTCOME_STRIP_RATIO: Record<string, string> = {
  BS21: "390/844",
  BS22: "390/844",
  BS23: "390/844",
  BS24: "390/844",
  BS25: "390/844",
  BS26: "390/844",
  BS27: "390/844",
  BS28: "390/844",
  BS29: "390/853",
};

function OutcomeStripImage({ name }: { name: string }) {
  return (
    <GlassImage
      src={`/home/work/basis/${name}.png`}
      alt={BASIS_ALT}
      aspectRatio={OUTCOME_STRIP_RATIO[name]}
      className="w-[220px] shrink-0 md:w-[281px] lg:w-[332px]"
    />
  );
}

export function BasisOutcomeMedia() {
  return (
    <div className="flex flex-col gap-r-2xs">
      <GlassImage src="/home/work/basis/BS20.jpg" alt={BASIS_ALT} className="h-[198px] w-full md:h-[331px] lg:h-[540px]" />
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
const FT_ALT = "First Table app screen";
const FT = "/home/work/firsttable";

// §01 Problem — one full-width screenshot below the stats + key paragraph.
export function FTProblemMedia() {
  return (
    <GlassImage
      src={`${FT}/4.png`}
      darkSrc={`${FT}/4_dark.png`}
      alt={FT_ALT}
      sizes="100vw"
      className="w-full aspect-[361/134] md:aspect-[944/318] lg:aspect-[1584/514]"
    />
  );
}

// §02 Research — segmentation charts. Stacked through tablet, side by side at desktop.
export function FTResearchMedia() {
  return (
    <div className="flex gap-r-2xs flex-col lg:flex-row lg:items-start">
      <GlassImage
        src={`${FT}/5.png`}
        darkSrc={`${FT}/5_dark.png`}
        alt="First Table diner segmentation analysis"
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="w-full aspect-[361/255] md:aspect-[944/628] lg:aspect-[782/502] lg:flex-1"
      />
      <GlassImage
        src={`${FT}/6.png`}
        alt="First Table survey research findings"
        sizes="(min-width: 1024px) 50vw, 100vw"
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
        src={`${FT}/7_light.png`}
        darkSrc={`${FT}/7_dark.png`}
        alt="First Table design system component library"
        sizes="100vw"
        className="w-full aspect-[361/227] md:aspect-[944/553] lg:aspect-[1584/993]"
      />
      <GlassImage
        src={`${FT}/8_light.png`}
        darkSrc={`${FT}/8_dark.png`}
        alt="First Table design tokens"
        sizes="100vw"
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
        src: `${FT}/video1.mp4`,
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
        src: `${FT}/video2.mp4`,
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
        src: `${FT}/video3.mp4`,
        label: "First Table bottom navigation bar",
        width: "w-[80%]",
        aspectRatio: "782/208",
        objectPosition: "top",
      },
      {
        src: `${FT}/video4.mp4`,
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
        src={`${FT}/9.png`}
        darkSrc={`${FT}/9_dark.png`}
        alt="First Table single-step booking flow"
        sizes="100vw"
        className="w-full aspect-[361/148] md:aspect-[944/342] lg:aspect-[1584/609]"
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
const VALIDATION_TESTS = [{ light: "10.png", dark: "10_dark.png" }, { light: "11.png", dark: "11_dark.png" }, { light: "12.png", dark: "12_dark.png" }, { light: "13.jpg", dark: "13_dark.jpg" }, { light: "14.png", dark: "14_dark.png" }, { light: "15.png", dark: "15_dark.png" }];

export function FTValidationMedia() {
  return (
    <div className="flex gap-r-2xs flex-col">
      <div className="grid gap-r-2xs grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {VALIDATION_TESTS.map((t) => (
          <GlassImage
            key={t.light}
            src={`${FT}/${t.light}`}
            darkSrc={`${FT}/${t.dark}`}
            alt="First Table A/B test variant"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="w-full aspect-[361/270] md:aspect-[464/400] lg:aspect-[514/400]"
          />
        ))}
      </div>
      <div className="flex gap-r-2xs flex-col lg:flex-row lg:items-start">
        <GlassImage
          src={`${FT}/16.png`}
          darkSrc={`${FT}/16_dark.png`}
          alt="First Table usability research session"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="w-full aspect-[361/214] md:aspect-[944/473] lg:aspect-[782/473] lg:flex-1"
        />
        <GlassImage
          src={`${FT}/17.png`}
          darkSrc={`${FT}/17_dark.png`}
          alt="First Table experiment results"
          sizes="(min-width: 1024px) 50vw, 100vw"
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
const OUTCOME_ROW_1 = [{ light: "18_light.jpg", dark: "18_dark.jpg" }, { light: "19_light.png", dark: "19_dark.jpg" }, { light: "20_light.png", dark: "20_dark.png" }, { light: "21_light.png", dark: "21_dark.png" }];
const OUTCOME_ROW_2 = [{ light: "22_light.jpg", dark: "22_dark.jpg" }, { light: "23_light.jpg", dark: "23_dark.jpg" }, { light: "24_light.png", dark: "24_dark.png" }, { light: "25_light.png", dark: "25_dark.jpg" }, { light: "26_light.png", dark: "26_dark.png" }];

function FTOutcomeScreen({ shot }: { shot: { light: string; dark: string } }) {
  return (
    <GlassImage
      src={`${FT}/${shot.light}`}
      darkSrc={`${FT}/${shot.dark}`}
      alt={FT_ALT}
      sizes="332px"
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
