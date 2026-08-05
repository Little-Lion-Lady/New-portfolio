import type { ReactNode } from "react";
import { Button } from "./button";
import { WorkImage, type WorkImageData, type WorkImageSize } from "./work-image";

// Figma "Work item" component.
// Layout per breakpoint:
//   mobile  — flex-col, gap-lg; number+name share a row, then desc/roles/View stacked
//   tablet  — 9-col grid (number c1, name c2-3, desc c5-9 with View inside)
//   desktop — 12-col grid (number c1, name c3-4, desc c6-11, View standalone c12)
// Type scales: number/name B-xs→B-sm→B-md; desc/roles/View M-xs→M-sm→M-md.
// Image carousel: WorkImage cards (frosted glass, tilted, overlapping).
export function WorkItem({
  number,
  name,
  description,
  roles,
  href = "#",
  images,
  imageSize = "md",
}: {
  number: string;
  name: ReactNode;
  description: string;
  roles: string;
  href?: string;
  images: WorkImageData[];
  imageSize?: WorkImageSize;
}) {
  const total = images.length as 3 | 4;
  return (
    <article className="flex w-full flex-col items-center gap-lg md:gap-2xl lg:gap-4xl">
      {/* Text container: stack (mobile) → 9-col grid (tablet) → 12-col grid (desktop) */}
      <div className="flex w-full flex-col gap-lg md:grid md:grid-cols-9 md:items-start md:gap-lg lg:grid-cols-12 lg:items-start">
        {/* number + name — one row on mobile; individual grid cells on md+ (via contents) */}
        <div className="flex items-center gap-xl md:contents">
          <p className="b-xs text-text-primary md:col-start-1 md:b-xs lg:b-sm">{number}</p>
          <p className="flex-1 b-xs text-text-primary md:col-start-2 md:col-span-2 md:whitespace-nowrap md:b-xs lg:col-start-3 lg:whitespace-normal lg:b-sm">
            {name}
          </p>
        </div>

        {/* description block — holds desc + roles, and the View link on mobile/tablet */}
        <div className="flex flex-col gap-sm md:col-start-5 md:col-span-5 md:gap-xs lg:col-start-6 lg:col-span-6 lg:gap-md lg:self-start">
          <div className="flex flex-col gap-lg lg:gap-xl">
            <p className="b-xs text-text-primary lg:b-sm">{description}</p>
            <p className="b-xs text-text-tertiary lg:b-sm">{roles}</p>
          </div>
          {/* View — wrapper controls visibility so it doesn't fight Button's display */}
          <div className="w-full lg:hidden">
            <Button variant="view" label="View" href={href} />
          </div>
        </div>

        {/* View — standalone column on desktop only */}
        <div className="hidden lg:col-start-12 lg:flex lg:justify-self-end lg:self-start">
          <Button variant="view" label="View" href={href} className="lg:items-start" />
        </div>
      </div>

      {/* Image carousel */}
      <div className="flex w-full items-center justify-center">
        {images.map((image, i) => (
          <WorkImage
            key={image.src}
            src={image.src}
            alt={image.alt}
            index={i}
            total={total}
            size={imageSize}
          />
        ))}
      </div>
    </article>
  );
}
