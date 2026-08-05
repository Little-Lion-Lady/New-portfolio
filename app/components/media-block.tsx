import { GlassImage } from "./work-image";

// Figma image collages for §02 (100:6005), §04 (100:6193), §06 (495:3594).
// Corner radius follows Figma: main image blocks are sharp; §06 phone frames are rounded.

const COVID_ALT = "NZ COVID Tracer app screen";

// §02 Approach — a phone screen beside a wide screenshot. Stacks on mobile.
export function ApproachMedia() {
  return (
    <div className="flex flex-col gap-md md:flex-row md:items-stretch">
      <GlassImage
        src="/home/work/covid-tracer/MOH4.jpg"
        alt={COVID_ALT}
        className="mx-auto h-[200px] w-[112px] shrink-0 md:mx-0 md:h-[279px] md:w-[161px] lg:h-[492px] lg:w-[284px]"
      />
      <GlassImage
        src="/home/work/covid-tracer/MOH5.jpg"
        alt={COVID_ALT}
        className="h-[132px] w-full md:h-[279px] md:flex-1 lg:h-[492px]"
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
      className="h-[240px] w-full md:h-[360px] lg:h-[513px]"
    />
  );
}

// §04 Design — big image · stacked pair · wide bleeding image. Stacks on mobile.
export function DesignMedia() {
  return (
    <div className="flex flex-col gap-md md:flex-row md:items-stretch">
      <GlassImage
        src="/home/work/covid-tracer/MOH7.jpg"
        alt={COVID_ALT}
        className="h-[320px] w-full md:h-[500px] md:flex-[781] lg:h-[802px]"
      />
      <div className="flex gap-md md:flex-col md:flex-[556]">
        <GlassImage
          src="/home/work/covid-tracer/MOH8.jpg"
          alt={COVID_ALT}
          className="h-[180px] flex-1 md:h-[397px] lg:h-[397px]"
        />
        <GlassImage
          src="/home/work/covid-tracer/MOH9.jpg"
          alt={COVID_ALT}
          className="h-[180px] flex-1 md:h-[397px] lg:h-[397px]"
        />
      </div>
      <GlassImage
        src="/home/work/covid-tracer/MOH10.jpg"
        alt={COVID_ALT}
        className="hidden md:block md:flex-[1000]"
      />
    </div>
  );
}

// §06 Outcome — two rows: pair of wide shots, then phone frames + wide shot.
// (A third image, the section's "headline" shot, is inline in page.tsx.)
export function OutcomeMedia() {
  return (
    <div className="flex flex-col gap-md">
      {/* Row 1 */}
      <div className="flex flex-col gap-md md:flex-row md:items-stretch">
        <GlassImage
          src="/home/work/covid-tracer/MOH12.jpg"
          alt={COVID_ALT}
          className="h-[300px] w-full md:h-auto md:flex-[616]"
        />
        <GlassImage
          src="/home/work/covid-tracer/MOH13.jpg"
          alt={COVID_ALT}
          className="h-[300px] w-full md:h-[512px] md:flex-[948]"
        />
      </div>
      {/* Row 2 */}
      <div className="flex flex-col gap-md md:flex-row md:items-stretch">
        <div className="flex gap-md md:shrink-0">
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

// §03 Research — a stacked group of result shots above a wide detail image.
export function ResearchMedia() {
  return (
    <div className="flex flex-col gap-3xs">
      <GlassImage src="/home/work/basis/BS4.jpg" alt={BASIS_ALT} className="h-[198px] w-full md:h-[300px]" />
      <GlassImage src="/home/work/basis/BS5.jpg" alt={BASIS_ALT} className="h-[198px] w-full md:h-[300px]" />
      <GlassImage src="/home/work/basis/BS6.jpg" alt={BASIS_ALT} className="h-[198px] w-full md:h-[300px]" />
      <GlassImage src="/home/work/basis/BS7.jpg" alt={BASIS_ALT} className="h-[198px] w-full md:h-[300px]" />
    </div>
  );
}

// §05 Process — a wide flow diagram above a taller detail shot.
export function ProcessMedia() {
  return (
    <div className="flex flex-col gap-xs">
      <GlassImage src="/home/work/basis/BS8.jpg" alt={BASIS_ALT} className="aspect-[361/141] w-full" />
      <GlassImage src="/home/work/basis/BS9.jpg" alt={BASIS_ALT} className="h-[306px] w-full md:h-[460px]" />
    </div>
  );
}

// §06 Solution design — row of two shots, then two screens side by side.
export function SolutionMedia() {
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex flex-col items-center gap-xs md:flex-row md:items-stretch">
        <GlassImage src="/home/work/basis/BS10.jpg" alt={BASIS_ALT} className="h-[224px] w-full md:flex-1" />
        <GlassImage src="/home/work/basis/BS11.jpg" alt={BASIS_ALT} className="h-[224px] w-full md:w-[299px]" />
      </div>
      <div className="flex flex-col gap-xs md:flex-row md:items-stretch">
        <GlassImage src="/home/work/basis/BS12.jpg" alt={BASIS_ALT} className="h-[288px] w-[295px] max-w-full" />
        <GlassImage src="/home/work/basis/BS13.jpg" alt={BASIS_ALT} className="h-[246px] w-full md:h-auto" />
      </div>
    </div>
  );
}

// §06 Prototype testing — a strip of four screenshots.
export function PrototypeMedia() {
  return (
    <div className="flex gap-sm overflow-hidden">
      <GlassImage src="/home/work/basis/BS14.jpg" alt={BASIS_ALT} className="h-[220px] w-1/4 md:h-[280px]" />
      <GlassImage src="/home/work/basis/BS15.jpg" alt={BASIS_ALT} className="h-[220px] w-1/4 md:h-[280px]" />
      <GlassImage src="/home/work/basis/BS16.jpg" alt={BASIS_ALT} className="h-[220px] w-1/4 md:h-[280px]" />
      <GlassImage src="/home/work/basis/BS17.jpg" alt={BASIS_ALT} className="h-[220px] w-1/4 md:h-[280px]" />
    </div>
  );
}

// §07 Outcome — a hero shot above a wide horizontal peek/scroll strip.
const OUTCOME_STRIP = [
  "BS19",
  "BS20",
  "BS21",
  "BS22",
  "BS23",
  "BS24",
  "BS25",
  "BS26",
  "BS27",
  "BS28",
  "BS29",
];

export function BasisOutcomeMedia() {
  return (
    <div className="flex flex-col gap-md">
      <GlassImage src="/home/work/basis/BS18.jpg" alt={BASIS_ALT} className="aspect-[361/198] w-full" />
      <div className="flex gap-xs overflow-x-auto">
        {OUTCOME_STRIP.map((name) => (
          <GlassImage
            key={name}
            src={`/home/work/basis/${name}.jpg`}
            alt={BASIS_ALT}
            className="h-[300px] w-[220px] shrink-0 md:h-[454px] md:w-[330px]"
          />
        ))}
      </div>
    </div>
  );
}
