"use client";

import { useEffect, useState } from "react";
import { GlassImage } from "./work-image";
import { MeCat } from "./dynamic-visuals";
import { isDarkTheme } from "./lottie-utils";
import { useInitialIsDark } from "./theme-context";

// Figma "02 Biography" image collage (node 1144:9241/9251/18610) — two tilted
// glass-frame photo cards with the cat illustration layered on top. Outer wrapper divs are the post-rotation
// bounding boxes Figma computes, so flex layout reserves the right footprint
// for each tilted card without any manual offset math.
export function BioCollage() {
  // Same fix as ThemeToggle's hydration mismatch: seed from the server-read
  // theme cookie (matches SSR exactly) instead of guessing client-side via
  // isDarkTheme() on mount, which can already disagree with the server by
  // the time hydration runs (e.g. a returning dark-mode visitor) and — unlike
  // a plain re-render — React won't patch a hydration-mismatched <img src>.
  const initialFromServer = useInitialIsDark();
  const [dark, setDark] = useState(() => initialFromServer ?? false);

  useEffect(() => {
    setDark(isDarkTheme());
    const observer = new MutationObserver(() => setDark(isDarkTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

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
        {/* rounded-sm bg-bg-primary backer — same shape/rotation as the frame
            itself, sitting directly behind it. This card overlaps the photo
            card behind it, and the glass frame's translucent bg would
            otherwise blend with the photo instead of the plain page bg,
            bleeding its colours through at the seam. The backer gives the
            translucent glass something page-coloured to blend with instead,
            so it renders identically to every other (non-overlapping) glass
            card rather than needing an opaque one-off variant. */}
        <div className="-rotate-[7.56deg] rounded-sm bg-bg-primary">
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
      </div>
    </div>
  );
}
