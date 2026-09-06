import { Reveal } from "./reveal";

// Figma "Section header" component. Layout is flex justify-between at every
// breakpoint; only the type scale changes:
//   mobile  B-md  (text-md 24 / 36)
//   tablet+ D-xs (display-xs 44 / 1.1) — desktop shares the tablet step
//           rather than stepping up to D-sm, so the heading stays a label
//           beside the content instead of competing with the page title.
// Number = text-decorative (fixed 110px width); name = text-quaternary.
// The two items carry their own reveals — number first, name one STAGGER
// (90ms) behind. Do NOT wrap this in another <Reveal>: nested reveals multiply
// their opacity curves, and the heading then lags anything beside it that only
// fades once.
export function SectionHeader({ number, name }: { number: string; name: string }) {
  return (
    <div className="flex w-full items-center justify-between">
      <Reveal index={0} as="p" className="w-[110px] b-md text-text-decorative md:d-xs">{number}</Reveal>
      <Reveal index={1} as="h2" className="b-md text-text-quaternary text-center md:d-xs">{name}</Reveal>
    </div>
  );
}
