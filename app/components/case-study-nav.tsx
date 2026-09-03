"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "./icons";
import { GlassImage } from "./work-image";

const MotionLink = m.create(Link);

const arrowVariantsRight = {
  rest: { x: 0, y: 0 },
  hover: { x: 4, y: 0 },
};

// Visual match for Button's "view" variant, but as a plain span — the whole
// row is now the link, so this can't be its own nested <a>.
function ViewLabel({ size = "sm" }: { size?: "sm" | "md" }) {
  // Both sizes share one text ramp — Figma draws "View" at B-xs on mobile and
  // tablet and B-sm on desktop in every variant; only the gap and arrow differ.
  const viewText = "b-xs lg:b-sm";
  const viewGap = size === "md" ? "gap-xs" : "gap-3xs md:gap-2xs lg:gap-3xs";
  const arrowSize = size === "md" ? "size-xl" : "size-md md:size-lg";
  return (
    <span
      /* No colour shift on hover: the frames draw View at text-primary in the
         hover state too, so the row's background fill carries it alone — the
         same call as the nav's links. */
      className={`inline-flex items-center ${viewGap} ${viewText} text-text-primary`}
    >
      <span>View</span>
      <m.span
        variants={arrowVariantsRight}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="inline-flex shrink-0"
      >
        <ArrowRight className={arrowSize} />
      </m.span>
    </span>
  );
}

// Figma "Case study nav" (741:7028 desktop / 741:7030 tablet / 741:7052 mobile).
// A "Next case study" footer link: glass-frame thumbnail + subtitle/heading + View.
// The whole row is the click target (not just the View label).
//   mobile  — flex row: mini thumbnail 80² · text column (subtitle+heading, then View)
//   tablet  — 9-col grid: thumbnail c1-2 (h80) · title block c4-7 · View c8-9
//   desktop — 12-col grid: thumbnail c1-2 (h140) · subtitle c4 · heading c7-10 · View c12
// Type scale subtitle/heading B-xs→B-sm→B-md; subtitle is "Next" until desktop
// where it reads "Next case study". Thumbnail padding (p-3xs, 4px) is fixed
// across breakpoints — same compact "mini" glass frame as the carousel/hero cards.
// (Figma flips this thumbnail vertically on tablet/desktop; skipped here since
// it renders the actual photo upside down.)
export function CaseStudyNav({
  title,
  href = "#",
  image,
}: {
  title: string;
  href?: string;
  image: { src: string; alt: string };
}) {
  return (
    <MotionLink
      href={href}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      animate="rest"
      /*
        Figma 1107:11261 draws the hover fill as an 8px border in the fill's own
        colour — i.e. 8px of colour around the content, at a 4px radius.

        Written as padding plus a matching negative margin rather than padding
        alone. Padding by itself would inset the row's content 8px from the
        content column, so the thumbnail would stop lining up with the divider
        above it and every other section on the page — in the RESTING state,
        where there is no fill to justify it. This way the resting row is
        pixel-identical to before and the fill grows outward on hover.
      */
      className="group -m-xs flex w-full items-center gap-lg rounded-2xs p-xs transition-colors duration-200 hover:bg-utility-gray-100 active:bg-utility-gray-200 md:grid md:grid-cols-9 md:items-center lg:grid-cols-12 lg:items-center"
    >
      {/* Thumbnail */}
      <div className="shrink-0 md:col-start-1 md:col-span-2 md:pr-md lg:pr-2xl">
        <GlassImage
          src={image.src}
          alt={image.alt}
          mini
          sizes="140px"
          className="h-[80px] w-[80px] md:h-[80px] md:w-full lg:h-[140px]"
        />
      </div>

      {/* Text column — on mobile this also holds the View label; from md it flattens
          (lg:contents) so subtitle/heading become direct grid cells on desktop. */}
      <div className="flex min-w-0 flex-1 flex-col gap-3xs md:col-start-3 md:col-span-4 md:self-center lg:contents">
        <div className="flex flex-col lg:contents">
          <p className="b-xs text-text-tertiary md:b-sm lg:b-md lg:col-start-3 lg:col-span-3 lg:self-center">
            Next<span className="lg:hidden"> case study</span>
          </p>
          <p className="b-xs text-text-primary md:b-sm lg:b-md lg:col-start-6 lg:col-span-4 lg:self-center">
            {title}
          </p>
        </div>
        {/* View — mobile only (nested in text column) */}
        <div className="md:hidden">
          <ViewLabel />
        </div>
      </div>

      {/* View — tablet + desktop (own grid cell) */}
      <div className="hidden md:col-start-8 md:col-span-2 md:flex md:justify-end md:self-center lg:col-start-12 lg:col-span-1 lg:self-center">
        <ViewLabel size="md" />
      </div>
    </MotionLink>
  );
}
