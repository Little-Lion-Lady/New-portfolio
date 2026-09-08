import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "./button";
import { ImageCarousel } from "./image-carousel";
import type { WorkImageData, WorkImageSize } from "./work-image";

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
  imagePriority,
}: {
  number: string;
  name: ReactNode;
  /** ReactNode rather than string so a call site can mark a phrase with
   *  text-text-primary-highlight — see the home page's work cards. */
  description: ReactNode;
  roles: string;
  href?: string;
  images: WorkImageData[];
  imageSize?: WorkImageSize;
  /** Loop this item's carousel left-to-right, so adjacent items counter-scroll. */
  reverseMarquee?: boolean;
  comingSoon?: boolean;
  /**
   * Bandwidth hint for this item's carousel. The rails load eagerly by
   * necessity (see ImageCarousel), so on a page stacking several of them the
   * only way to keep the first row from queueing behind the third is to rank
   * them relative to each other: "auto" on the item nearest the top, "low" on
   * the ones below it.
   *
   * "high" is available but reach for it carefully. It ranks the row against
   * the whole page rather than against its siblings, and these rails are
   * decorative — on the homepage it put 738KB of photography ahead of the JS
   * and the fonts the hero was waiting on.
   */
  imagePriority?: "high" | "low" | "auto";
}) {
  const wrapperClassName = "flex w-full flex-col items-center gap-lg md:gap-2xl lg:gap-3xl";

  const content = (
    <>
      {/* Text container: stack (mobile) → 9-col grid (tablet) → 12-col grid
          (desktop). On mobile the SW/xx + name row sits 4px above the body
          copy. From tablet up every cell shares one grid row, so only the 20px
          column gutter is doing anything; gap-y is pinned to 0 so that stays
          true if the row ever wraps. */}
      <div className="flex w-full flex-col gap-3xs md:grid md:grid-cols-9 md:items-start md:gap-x-lg md:gap-y-0 lg:grid-cols-12 lg:items-start">
        {/* number + name — one row on mobile; individual grid cells on md+ (via contents) */}
        <div className="flex items-center gap-xl md:contents">
          <p className="b-xs text-text-primary md:col-start-1 md:b-xs lg:b-sm">{number}</p>
          <p className="flex-1 b-xs text-text-primary md:col-start-2 md:col-span-2 md:whitespace-nowrap md:b-xs lg:col-start-3 lg:whitespace-normal lg:b-sm">
            {name}
          </p>
        </div>

        {/* description block — holds desc + roles, and the View label on
            mobile/tablet. Gap 0: the View carries its own 4px of top padding,
            and this gap is only ever seen below lg anyway — from lg the View
            moves to its own grid cell and this collapses to a single child. */}
        <div className="flex flex-col gap-0 md:col-start-5 md:col-span-5 lg:col-start-6 lg:col-span-6 lg:self-start">
          {/* Body copy, roles and the optional COMING SOON line stack flush —
              their line boxes carry the separation. */}
          <div className="flex flex-col gap-0">
            <p className="b-xs text-text-primary lg:b-sm">{description}</p>
            <p className="b-xs text-text-tertiary lg:b-sm">{roles}</p>
            {comingSoon && <p className="b-xs text-text-tertiary lg:b-sm">COMING SOON</p>}
          </div>
          {/* View — wrapper controls visibility so it doesn't fight Button's
              display. Its top padding is the only thing separating it from the
              roles line now that the column stacks flush. */}
          {!comingSoon && (
            <div className="w-full pt-xs lg:hidden">
              <Button as="span" variant="view" label="View" href={href} />
            </div>
          )}
        </div>

        {/* View — standalone column on desktop only.
            lg:self-start on the cell is what top-aligns the View against the
            row; the Button must NOT also carry items-start, or the arrow
            top-aligns against the label's 32px line box and sits 4px high. */}
        {!comingSoon && (
          <div className="hidden lg:col-start-12 lg:flex lg:justify-self-end lg:self-start">
            <Button as="span" variant="view" label="View" href={href} />
          </div>
        )}
      </div>

      {/* Image carousel */}
      <ImageCarousel
        images={images}
        size={imageSize}
        marquee
        reverse={reverseMarquee}
        fetchPriority={imagePriority}
        hoverScale
      />
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
