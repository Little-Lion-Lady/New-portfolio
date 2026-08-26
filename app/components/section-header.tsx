import { Reveal } from "./reveal";

// Figma "Section header" component. Layout is flex justify-between at every
// breakpoint; only the type scale changes:
//   mobile  B-md  (text-md 24 / 36)
//   tablet  D-xs  (display-xs 44 / 1.1)
//   desktop D-sm  (display-sm 60 / 1.15)
// Number = text-decorative (fixed 110px width); name = text-quaternary.
// The two items stagger by 0.5 s — number first, name second.
export function SectionHeader({ number, name }: { number: string; name: string }) {
  return (
    <div className="flex w-full items-center justify-between">
      <Reveal index={0} as="p" className="w-[110px] b-md text-text-decorative md:d-xs lg:d-sm">{number}</Reveal>
      <Reveal index={1} as="h2" className="b-md text-text-quaternary text-center md:d-xs lg:d-sm">{name}</Reveal>
    </div>
  );
}
