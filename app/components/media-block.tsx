import Image from "next/image";
import { GlassImage } from "./work-image";

// Figma image collages for §02 (100:6005), §04 (100:6193), §06 (495:3594).
// Corner radius follows Figma: main image blocks are sharp; §06 phone frames are rounded.

const COVID_ALT = "NZ COVID Tracer app screen";

// §02 Approach — a phone screen beside a wide screenshot. Stacks on mobile.
export function ApproachMedia() {
  return (
    <div className="flex flex-col gap-xs md:flex-row md:items-stretch md:gap-md lg:gap-lg">
      <GlassImage
        src="/home/work/covid-tracer/MOH4.jpg"
        alt={COVID_ALT}
        className="mx-auto h-[290px] w-[165px] shrink-0 md:mx-0 lg:h-[500px] lg:w-[332px]"
      />
      <GlassImage
        src="/home/work/covid-tracer/MOH5.jpg"
        alt={COVID_ALT}
        className="h-[140px] w-full md:h-[290px] md:flex-1 lg:h-[500px]"
      />
    </div>
  );
}

// §04 Design — top-wide shot leading into the big-image-plus-stack row below.
export function FlowDiagram() {
  return (
    <GlassImage
      src="/home/work/covid-tracer/MOH6.jpg"
      alt={COVID_ALT}
      className="h-[112px] w-full md:h-[330px] lg:h-[540px]"
    />
  );
}

// §04 Design — big image beside a stacked pair, then a wide full-width shot below.
export function DesignMedia() {
  return (
    <div className="flex flex-col gap-xs md:gap-md lg:gap-xl">
      <div className="flex gap-xs md:gap-md lg:gap-lg">
        <GlassImage
          src="/home/work/covid-tracer/MOH7.jpg"
          alt={COVID_ALT}
          className="h-[308px] flex-[5] md:h-[400px] lg:h-[1024px] lg:flex-1"
        />
        <div className="flex flex-[4] flex-col gap-xs md:gap-md lg:flex-1 lg:gap-xl">
          <GlassImage
            src="/home/work/covid-tracer/MOH8.jpg"
            alt={COVID_ALT}
            className="h-[150px] flex-1 md:h-[192px] lg:h-[500px]"
          />
          <GlassImage
            src="/home/work/covid-tracer/MOH9.jpg"
            alt={COVID_ALT}
            className="h-[150px] flex-1 md:h-[192px] lg:h-[500px]"
          />
        </div>
      </div>
      <GlassImage
        src="/home/work/covid-tracer/MOH10.jpg"
        alt={COVID_ALT}
        className="aspect-[1584/790] w-full"
      />
    </div>
  );
}

// §06 Outcome — two rows: pair of wide shots, then phone frames + wide shot.
// (A third image, the section's "headline" shot, is inline in page.tsx.)
export function OutcomeMedia() {
  return (
    <div className="flex flex-col gap-xs md:gap-md lg:gap-xl">
      {/* Row 1 — stacks through tablet, side-by-side only at desktop */}
      <div className="flex flex-col gap-xs md:gap-md lg:flex-row lg:items-stretch lg:gap-lg">
        <GlassImage
          src="/home/work/covid-tracer/MOH12.jpg"
          alt={COVID_ALT}
          className="h-[244px] w-full md:h-[600px] lg:h-[444px] lg:flex-1"
        />
        <GlassImage
          src="/home/work/covid-tracer/MOH13.jpg"
          alt={COVID_ALT}
          className="h-[220px] w-full md:h-[480px] lg:h-[444px] lg:flex-1"
        />
      </div>
      {/* Row 2 */}
      <div className="flex flex-col gap-xs md:flex-row md:items-stretch md:gap-md lg:gap-lg">
        <div className="flex gap-xs md:gap-md lg:gap-xl">
          <GlassImage
            src="/home/work/covid-tracer/MOH14.jpg"
            alt={COVID_ALT}
            className="h-[300px] w-1/2 md:h-[494px] md:w-[250px]"
          />
          <GlassImage
            src="/home/work/covid-tracer/MOH15.jpg"
            alt={COVID_ALT}
            className="h-[300px] w-1/2 md:h-[494px] md:w-[250px]"
          />
        </div>
        <GlassImage
          src="/home/work/covid-tracer/MOH16.jpg"
          alt={COVID_ALT}
          className="h-[300px] w-full md:h-[494px] md:flex-1"
        />
      </div>
    </div>
  );
}

/* ── BASIS case study media blocks ──────────────────────────────────────── */

const BASIS_ALT = "Basis home app screen";

// §03 Research — a stacked column of 3 result shots beside a wide detail image.
// Column stacks above the detail image on mobile, sits beside it from tablet up.
export function ResearchMedia() {
  return (
    <div className="flex flex-col gap-xs md:flex-row md:items-stretch md:gap-md lg:gap-lg">
      <div className="flex flex-col gap-3xs md:w-[290px] md:shrink-0 lg:w-1/3 lg:gap-xs">
        <GlassImage src="/home/work/basis/BS4.jpg" alt={BASIS_ALT} className="h-[198px] w-full lg:h-auto lg:flex-1" />
        <GlassImage src="/home/work/basis/BS5.jpg" alt={BASIS_ALT} className="h-[198px] w-full lg:h-auto lg:flex-1" />
        <GlassImage src="/home/work/basis/BS6.jpg" alt={BASIS_ALT} className="h-[197px] w-full md:h-[165px] lg:h-auto lg:flex-1" />
      </div>
      <GlassImage
        src="/home/work/basis/BS7.jpg"
        alt={BASIS_ALT}
        className="h-[227px] w-full md:h-auto md:flex-1 lg:aspect-[931/601] lg:h-auto lg:w-2/3 lg:flex-none"
      />
    </div>
  );
}

// §05 Process — a wide flow diagram above a taller detail shot.
export function ProcessMedia() {
  return (
    <div className="flex flex-col gap-xs lg:gap-lg">
      <GlassImage src="/home/work/basis/BS8.jpg" alt={BASIS_ALT} className="aspect-[3168/1235] w-full" />
      <GlassImage src="/home/work/basis/BS9.jpg" alt={BASIS_ALT} className="h-[306px] w-full md:h-[524px] lg:h-[1414px]" />
    </div>
  );
}

// §06 Solution design — row of two shots, then (mobile/tablet only) two more side by side.
// Figma's desktop composition drops the second row entirely.
export function SolutionMedia() {
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex flex-col gap-xs md:flex-row md:items-stretch lg:h-[580px] lg:gap-lg">
        <GlassImage
          src="/home/work/basis/BS12.jpg"
          alt={BASIS_ALT}
          className="h-[224px] w-full md:h-[456px] md:w-[327px] md:shrink-0 lg:h-full lg:w-[646px]"
        />
        <GlassImage
          src="/home/work/basis/BS13.jpg"
          alt={BASIS_ALT}
          className="mx-auto h-[224px] w-[299px] md:mx-0 md:h-[456px] md:w-auto md:flex-1 lg:h-full"
        />
      </div>
      <div className="flex flex-col gap-xs md:flex-row md:items-stretch lg:hidden">
        <GlassImage
          src="/home/work/basis/BS12.jpg"
          alt={BASIS_ALT}
          className="mx-auto h-[288px] w-[295px] md:mx-0 md:h-[584px] md:w-auto md:flex-1"
        />
        <GlassImage
          src="/home/work/basis/BS13.jpg"
          alt={BASIS_ALT}
          className="h-[246px] w-full md:h-[584px] md:w-[260px] md:shrink-0"
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
    <div className="flex flex-col gap-xs md:flex-row md:items-end md:justify-between md:gap-xl lg:gap-2xl">
      <div className="flex gap-xs overflow-hidden md:gap-xl lg:max-w-[1183px] lg:flex-1 lg:gap-xs">
        <GlassImage src="/home/work/basis/BS14.jpg" alt={BASIS_ALT} className="h-[220px] w-1/4 md:h-[367px] md:w-[168px] md:shrink-0 lg:aspect-[180/367] lg:h-auto lg:w-auto lg:flex-1 lg:shrink" />
        <GlassImage src="/home/work/basis/BS15.jpg" alt={BASIS_ALT} className="h-[220px] w-1/4 md:h-[367px] md:w-[168px] md:shrink-0 lg:aspect-[180/367] lg:h-auto lg:w-auto lg:flex-1 lg:shrink" />
        <GlassImage src="/home/work/basis/BS16.jpg" alt={BASIS_ALT} className="h-[220px] w-1/4 md:h-[367px] md:w-[168px] md:shrink-0 lg:aspect-[180/367] lg:h-auto lg:w-auto lg:flex-1 lg:shrink" />
        <GlassImage src="/home/work/basis/BS17.jpg" alt={BASIS_ALT} className="h-[220px] w-1/4 md:h-[367px] md:w-[168px] md:shrink-0 lg:aspect-[180/367] lg:h-auto lg:w-auto lg:flex-1 lg:shrink" />
      </div>
      <div className="flex gap-xs md:w-[155px] md:shrink-0 md:flex-col md:gap-[10px] lg:w-[243px]">
        <div className="relative flex-1 aspect-[243/160] overflow-hidden rounded-lg md:aspect-auto md:h-[108px] md:flex-none lg:h-[160px]">
          <Image src="/home/work/basis/BS18.jpg" alt="Basis prototype testing participant" fill quality={100} sizes="243px" className="object-cover" />
        </div>
        <div className="relative flex-1 aspect-[243/160] overflow-hidden rounded-lg md:aspect-auto md:h-[105px] md:flex-none lg:h-[160px]">
          <Image src="/home/work/basis/BS19.jpg" alt="Basis prototype testing participant" fill quality={100} sizes="243px" className="object-cover" />
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

function OutcomeStripImage({ name }: { name: string }) {
  return (
    <GlassImage
      src={`/home/work/basis/${name}.jpg`}
      alt={BASIS_ALT}
      className="h-[300px] w-[220px] shrink-0 md:h-[454px] md:w-[330px] lg:h-[840px] lg:w-[390px]"
    />
  );
}

export function BasisOutcomeMedia() {
  return (
    <div className="flex flex-col gap-xl md:gap-2xl">
      <GlassImage src="/home/work/basis/BS20.jpg" alt={BASIS_ALT} className="h-[198px] w-full md:h-[331px] lg:h-[540px]" />
      {/* Mobile — single continuous scroll strip (unchanged behaviour) */}
      <div className="flex gap-xs overflow-x-auto md:hidden">
        {[...OUTCOME_ROW1, ...OUTCOME_ROW2].map((name) => (
          <OutcomeStripImage key={name} name={name} />
        ))}
      </div>
      {/* Tablet/desktop — two stacked rows, centred, no horizontal scroll */}
      <div className="hidden flex-col items-center gap-xs md:flex md:gap-lg">
        <div className="flex justify-center gap-xs md:gap-lg">
          {OUTCOME_ROW1.map((name) => (
            <OutcomeStripImage key={name} name={name} />
          ))}
        </div>
        <div className="flex justify-center gap-xs md:gap-lg">
          {OUTCOME_ROW2.map((name) => (
            <OutcomeStripImage key={name} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
}
