import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "./button";
import { ImageCarousel, type WorkImageData, type WorkImageSize } from "./work-image";

// Figma "Work item" component.
// Layout per breakpoint:
//   mobile  — flex-col, gap-lg; number+name share a row, then desc/roles/View stacked
//   tablet  — 9-col grid (number c1, name c2-3, desc c5-9 with View inside)
//   desktop — 12-col grid (number c1, name c3-4, desc c6-11, View standalone c12)
// Type scales: number/name B-xs→B-sm→B-md; desc/roles/View M-xs→M-sm→M-md.
// Image carousel: a full-bleed row of cards looping right-to-left.
export function WorkItem({
  number,
  name,
  description,
  roles,
  href = "#",
  images,
  imageSize = "md",
  reverseMarquee = false,
  comingSoon = false,
}: {
  number: string;
  name: ReactNode;
  description: string;
  roles: string;
  href?: string;
  images: WorkImageData[];
  imageSize?: WorkImageSize;
  /** Loop this item's carousel left-to-right, so adjacent items counter-scroll. */
  reverseMarquee?: boolean;
  comingSoon?: boolean;
}) {
  const wrapperClassName = "flex w-full flex-col items-center gap-lg md:gap-2xl lg:gap-3xl";

  const content = (
    <>
      {/* Text container: stack (mobile) → 9-col grid (tablet) → 12-col grid (desktop) */}
      <div className="flex w-full flex-col gap-xs md:grid md:grid-cols-9 md:items-start md:gap-lg lg:grid-cols-12 lg:items-start">
        {/* number + name — one row on mobile; individual grid cells on md+ (via contents) */}
        <div className="flex items-center gap-xl md:contents">
          <p className="b-xs text-text-primary md:col-start-1 md:b-xs lg:b-sm">{number}</p>
          <p className="flex-1 b-xs text-text-primary md:col-start-2 md:col-span-2 md:whitespace-nowrap md:b-xs lg:col-start-3 lg:whitespace-normal lg:b-sm">
            {name}
          </p>
        </div>

        {/* description block — holds desc + roles, and the View label on mobile/tablet */}
        <div className="flex flex-col gap-xs md:col-start-5 md:col-span-5 lg:col-start-6 lg:col-span-6 lg:self-start">
          <div className="flex flex-col gap-xs">
            <p className="b-xs text-text-primary lg:b-sm">{description}</p>
            <p className="b-xs text-text-tertiary lg:b-sm">{roles}</p>
            {comingSoon && <p className="b-xs text-text-tertiary lg:b-sm">COMING SOON</p>}
          </div>
          {/* View — wrapper controls visibility so it doesn't fight Button's display */}
          {!comingSoon && (
            <div className="w-full pt-3xs lg:hidden">
              <Button as="span" variant="view" label="View" href={href} />
            </div>
          )}
        </div>

        {/* View — standalone column on desktop only */}
        {!comingSoon && (
          <div className="hidden lg:col-start-12 lg:flex lg:justify-self-end lg:self-start">
            <Button as="span" variant="view" label="View" href={href} className="lg:items-start" />
          </div>
        )}
      </div>

      {/* Image carousel */}
      <ImageCarousel images={images} size={imageSize} marquee reverse={reverseMarquee} />
    </>
  );

  if (comingSoon) {
    return <article className={wrapperClassName}>{content}</article>;
  }

  return (
    <Link href={href} className={wrapperClassName}>
      {content}
    </Link>
  );
}
