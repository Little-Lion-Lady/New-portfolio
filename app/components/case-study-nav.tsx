import { Button } from "./button";

// Figma "Case study nav" (741:7085 desktop / 741:7096 tablet / 741:7199 mobile).
// A "Next case study" footer link: thumbnail + subtitle/heading + View.
//   mobile  — flex row: image 80² · text column (subtitle+heading stacked, then View)
//   tablet  — 9-col grid: image c1-2 (h80) · title block c4-7 · View c8-9
//   desktop — 12-col grid: image c1-2 (h100) · subtitle c4 · heading c7-10 · View c12
// Type scale subtitle/heading B-xs→B-sm→B-md; subtitle is "Next" until desktop
// where it reads "Next case study". Image is a bg-inverse placeholder (rounded-sm).
export function CaseStudyNav({
  title,
  href = "#",
}: {
  title: string;
  href?: string;
}) {
  return (
    <div className="flex w-full items-center gap-lg md:grid md:grid-cols-9 md:items-center lg:grid-cols-12 lg:items-center">
      {/* Thumbnail */}
      <div className="h-[80px] w-[80px] shrink-0 bg-bg-inverse md:col-start-1 md:col-span-2 md:w-full lg:h-[100px]" />

      {/* Text column — on mobile this also holds the View button; from md it flattens
          (lg:contents) so subtitle/heading become direct grid cells on desktop. */}
      <div className="flex min-w-0 flex-1 flex-col gap-md md:col-start-3 md:col-span-4 md:self-center lg:contents">
        <div className="flex flex-col gap-sm md:gap-md lg:contents">
          <p className="b-xs text-text-tertiary md:b-sm lg:b-md lg:col-start-3 lg:col-span-2 lg:self-center">
            Next<span className="lg:hidden"> case study</span>
          </p>
          <p className="b-xs text-text-primary md:b-sm lg:b-md lg:col-start-6 lg:col-span-4 lg:self-center">
            {title}
          </p>
        </div>
        {/* View — mobile only (nested in text column) */}
        <div className="md:hidden">
          <Button variant="view" label="View" href={href} />
        </div>
      </div>

      {/* View — tablet + desktop (own grid cell) */}
      <div className="hidden md:col-start-8 md:col-span-2 md:flex md:justify-end md:self-center lg:col-start-12 lg:col-span-1 lg:self-center">
        <Button variant="view" size="md" label="View" href={href} />
      </div>
    </div>
  );
}
