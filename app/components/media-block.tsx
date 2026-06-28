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
    <div className="flex flex-col gap-md md:flex-row md:items-stretch md:gap-lg">
      <Ph className="mx-auto h-[200px] w-[112px] shrink-0 md:mx-0 md:h-[279px] md:w-[161px] lg:h-[492px] lg:w-[284px]" />
      <Ph className="h-[132px] w-full md:h-[279px] md:flex-1 lg:h-[492px]" />
    </div>
  );
}

// §04 user-onboarding flow diagram — placeholder for an exported diagram asset.
export function FlowDiagram() {
  return (
    <div className="flex h-[240px] w-full items-center justify-center bg-bg-inverse md:h-[360px] lg:h-[513px]">
      <p className="m-xs uppercase text-bg-white/70">Onboarding flow diagram</p>
    </div>
  );
}

// §04 Design — big image · stacked pair · wide bleeding image. Stacks on mobile.
export function DesignMedia() {
  return (
    <div className="flex flex-col gap-xs md:flex-row md:items-stretch">
      <Ph className="h-[320px] w-full md:h-[500px] md:flex-[781] lg:h-[802px]" />
      <div className="flex gap-xs md:flex-col md:flex-[556]">
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
    <div className="flex flex-col gap-lg">
      {/* Row 1 */}
      <div className="flex flex-col gap-lg md:flex-row md:items-stretch">
        <Ph className="h-[300px] w-full md:h-[400px] md:flex-[616]" />
        <Ph className="h-[300px] w-full md:h-[512px] md:flex-[948]" />
      </div>
      {/* Row 2 */}
      <div className="flex flex-col gap-lg md:flex-row md:items-stretch">
        <div className="flex shrink-0 gap-lg">
          <Ph className="h-[323px] w-[110px] rounded-[40px] md:h-[494px] md:w-[251px]" />
          <Ph className="h-[323px] w-[110px] rounded-[40px] md:h-[494px] md:w-[251px]" />
        </div>
        <Ph className="h-[300px] w-full md:h-[494px] md:flex-1" />
      </div>
    </div>
  );
}
