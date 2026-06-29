// Figma image collages for §02 (100:6005), §04 (100:6193), §06 (495:3594).
// Real imagery isn't available yet, so these reproduce the *layout* (rows, column
// proportions, gaps, heights) with bg-inverse placeholders. Drop real <img>s in later.
// Corner radius follows Figma: main image blocks are sharp; §06 phone frames are rounded.

function Ph({ className = "" }: { className?: string }) {
  return <div className={`bg-bg-inverse ${className}`} />;
}

// §02 Approach — a phone screen beside a wide screenshot. Stacks on mobile.
export function ApproachMedia() {
  return (
    <div className="flex flex-col gap-md md:flex-row md:items-stretch">
      <Ph className="mx-auto h-[200px] w-[112px] shrink-0 md:mx-0 md:h-[279px] md:w-[161px] lg:h-[492px] lg:w-[284px]" />
      <Ph className="h-[132px] w-full md:h-[279px] md:flex-1 lg:h-[492px]" />
    </div>
  );
}

// §04 user-onboarding flow diagram — placeholder for an exported diagram asset.
export function FlowDiagram() {
  return (
    <div className="flex h-[240px] w-full items-center justify-center bg-bg-inverse md:h-[360px] lg:h-[513px]">
      <p className="b-2xs uppercase text-bg-white/70">Onboarding flow diagram</p>
    </div>
  );
}

// §04 Design — big image · stacked pair · wide bleeding image. Stacks on mobile.
export function DesignMedia() {
  return (
    <div className="flex flex-col gap-md md:flex-row md:items-stretch">
      <Ph className="h-[320px] w-full md:h-[500px] md:flex-[781] lg:h-[802px]" />
      <div className="flex gap-md md:flex-col md:flex-[556]">
        <Ph className="h-[180px] flex-1 md:h-[397px] lg:h-[397px]" />
        <Ph className="h-[180px] flex-1 md:h-[397px] lg:h-[397px]" />
      </div>
      <Ph className="hidden md:block md:flex-[1000]" />
    </div>
  );
}

// §06 Outcome — two rows: pair of wide shots, then phone frames + wide shot.
export function OutcomeMedia() {
  return (
    <div className="flex flex-col gap-md">
      {/* Row 1 */}
      <div className="flex flex-col gap-md md:flex-row md:items-stretch">
        <Ph className="h-[300px] w-full md:h-auto md:flex-[616]" />
        <Ph className="h-[300px] w-full md:h-[512px] md:flex-[948]" />
      </div>
      {/* Row 2 */}
      <div className="flex flex-col gap-md md:flex-row md:items-stretch">
        <Ph className="h-[300px] w-full md:h-[494px] md:flex-1" />
      </div>
    </div>
  );
}

/* ── BASIS case study media blocks (placeholders) ──────────────────────────────
   Proportions sourced from the mobile frames (547:10xxx). Real imagery isn't
   exported yet; desktop column splits to be confirmed during visual QA. */

// §03 Research — a stacked trio of result shots above a beige-padded wide image.
export function ResearchMedia() {
  return (
    <div className="flex flex-col gap-3xs">
      <Ph className="h-[198px] w-full md:h-[300px]" />
      <Ph className="h-[198px] w-full md:h-[300px]" />
      <Ph className="h-[198px] w-full md:h-[300px]" />
    </div>
  );
}

// §05 Process — a wide flow diagram above a taller detail shot.
export function ProcessMedia() {
  return (
    <div className="flex flex-col gap-xs">
      <Ph className="aspect-[361/141] w-full" />
      <Ph className="h-[306px] w-full md:h-[460px]" />
    </div>
  );
}

// §06 Solution design — row of two shots, then two white-framed screens stacked.
export function SolutionMedia() {
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex flex-col items-center gap-xs md:flex-row md:items-stretch">
        <Ph className="h-[224px] w-full md:flex-1" />
        <Ph className="h-[224px] w-full md:w-[299px]" />
      </div>
      <div className="flex flex-col gap-xs md:flex-row md:items-stretch">
        <Ph className="h-[288px] w-[295px] max-w-full" />
        <Ph className="h-[246px] w-full md:h-auto" />
      </div>
    </div>
  );
}

// §06 Prototype testing — a wide screenshot strip above two rounded user thumbnails.
export function PrototypeMedia() {
  return (
    <div className="flex flex-col items-center gap-md">
      <Ph className="aspect-[361/177] w-full" />
      <div className="flex gap-sm">
        <Ph className="h-[92px] w-[131px] rounded-sm" />
        <Ph className="h-[92px] w-[131px] rounded-sm" />
      </div>
    </div>
  );
}

// §07 Outcome — a hero shot above a wide horizontal peek/scroll strip.
export function BasisOutcomeMedia() {
  return (
    <div className="flex flex-col gap-md">
      <Ph className="aspect-[361/198] w-full" />
      <div className="flex gap-xs overflow-hidden">
        <Ph className="h-[300px] w-full md:h-[454px]" />
      </div>
    </div>
  );
}
