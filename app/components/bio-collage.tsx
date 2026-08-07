import { GlassImage } from "./work-image";
import { MeCat } from "./dynamic-visuals";

// Figma "02 Biography" image collage (node 1144:9241/9251/18610) — two tilted
// glass-frame cards (a real photo + a decorative gradient card) with the cat
// illustration layered on top. Outer wrapper divs are the post-rotation
// bounding boxes Figma computes, so flex layout reserves the right footprint
// for each tilted card without any manual offset math.
export function BioCollage() {
  return (
    <div className="relative flex h-[314.422px] w-full items-center justify-center md:h-[496.967px] lg:h-[496.967px]">
      <div className="mr-[-56px] flex h-[314.422px] w-[220.524px] shrink-0 items-center justify-center md:h-[521.941px] md:w-[366.07px] lg:h-[521.941px] lg:w-[366.07px]">
        <div className="rotate-4">
          <GlassImage
            src="/home/about/ME1.JPG"
            alt="Maryna Babych"
            className="h-[301.205px] w-[200px] md:h-[500px] md:w-[332px] lg:h-[500px] lg:w-[332px]"
          />
        </div>
      </div>
      <div className="flex h-[295.054px] w-[233.946px] shrink-0 items-center justify-center md:h-[489.79px] md:w-[388.351px] lg:h-[489.79px] lg:w-[388.351px]">
        <div className="-rotate-[7.56deg]">
          <div className="flex h-[271.084px] w-[200px] flex-col rounded-sm border border-border-overlay bg-utility-inverses-glass p-2xs shadow-[0_2px_10px_var(--shadows-shadow-02)] backdrop-blur-[10px] md:h-[450px] md:w-[332px] md:p-xs lg:h-[450px] lg:w-[332px] lg:p-sm">
            <div className="h-full w-full flex-1 rounded-xs border border-border-overlay bg-gradient-to-b from-[var(--colour-blue-200)] to-[var(--colour-red-light-200)]" />
          </div>
        </div>
      </div>
      <div className="absolute left-[164.63px] top-[38.52px] flex h-[237.38px] w-[196.273px] items-center justify-center md:left-[341.03px] md:top-[78.77px] md:h-[339.428px] md:w-[280.65px] lg:left-[341.03px] lg:top-[78.77px] lg:h-[339.428px] lg:w-[280.65px]">
        <div className="-rotate-7">
          <MeCat className="w-[170.959px] md:w-[244.454px] lg:w-[244.454px]" />
        </div>
      </div>
    </div>
  );
}
