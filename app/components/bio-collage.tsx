"use client";

import { GlassImage } from "./work-image";
import { TiltIn } from "./tilt-in";
import { MeCat } from "./dynamic-visuals";
import { useInitialIsDark } from "./theme-context";
import { useIsDark } from "./use-is-dark";

// Figma "02 Biography" image collage (node 1144:9241/9251/18610) — two tilted
// glass-frame photo cards with the cat illustration layered on top. Outer wrapper divs are the post-rotation
// bounding boxes Figma computes, so flex layout reserves the right footprint
// for each tilted card without any manual offset math.
export function BioCollage() {
  // Unlike the Lottie visuals this one is server-rendered, so the SSR and
  // hydration passes must use the server-read theme cookie rather than the
  // live DOM: guessing client-side can already disagree with the server by
  // the time hydration runs (e.g. a returning dark-mode visitor) and — unlike
  // a plain re-render — React won't patch a hydration-mismatched <img src>.
  // Passing it as the server snapshot keeps that guarantee; any correction
  // after hydration arrives as an ordinary re-render, which does patch src.
  const dark = useIsDark(useInitialIsDark() ?? false);

  return (
    <div className="relative flex h-[314.422px] w-full items-center justify-center md:h-[496.967px] lg:h-[496.967px]">
      <div className="mr-[-56px] flex h-[314.422px] w-[220.524px] shrink-0 items-center justify-center md:h-[521.941px] md:w-[366.07px] lg:h-[521.941px] lg:w-[366.07px]">
        <TiltIn offset={8}>
          <div className="rotate-4">
            <GlassImage
              src="/home/about/ME1.JPG"
              alt="Maryna Babych"
              className="h-[301.205px] w-[200px] md:h-[500px] md:w-[332px] lg:h-[500px] lg:w-[332px]"
            />
          </div>
        </TiltIn>
      </div>
      <div className="flex h-[295.054px] w-[233.946px] shrink-0 items-center justify-center md:h-[489.79px] md:w-[388.351px] lg:h-[489.79px] lg:w-[388.351px]">
        {/* Radius-matched bg-bg-primary backer — same shape/rotation as the frame
            itself, sitting directly behind it. This card overlaps the photo
            card behind it, and the glass frame's translucent bg would
            otherwise blend with the photo instead of the plain page bg,
            bleeding its colours through at the seam. The backer gives the
            translucent glass something page-coloured to blend with instead,
            so it renders identically to every other (non-overlapping) glass
            card rather than needing an opaque one-off variant. Its radius has to
            track GlassImage's own outer radius (sm on mobile, md from md up),
            or the flatter backer corners poke out past the frame. */}
        <TiltIn offset={-8}>
          <div className="-rotate-[7.56deg] rounded-sm bg-bg-primary md:rounded-md">
            <GlassImage
              src={dark ? "/home/about/ABOUT2_Dark.jpg" : "/home/about/ABOUT2.jpg"}
              alt=""
              className="h-[271.084px] w-[200px] md:h-[450px] md:w-[332px] lg:h-[450px] lg:w-[332px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="-rotate-7">
                  <MeCat className="w-[140px] md:w-[200px] lg:w-[200px]" />
                </div>
              </div>
            </GlassImage>
          </div>
        </TiltIn>
      </div>
    </div>
  );
}
