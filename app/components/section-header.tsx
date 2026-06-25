// Figma "Section header" component. Layout is flex justify-between at every
// breakpoint; only the type scale changes:
//   mobile  B-lg  (text-xl 32)
//   tablet  D-xs  (display-xs 44)
//   desktop D-sm  (display-sm 60)
// Number = text-decorative (fixed 110px width); name = text-quaternary.
export function SectionHeader({ number, name }: { number: string; name: string }) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="w-[110px] b-md text-text-decorative md:d-2xs lg:d-sm">{number}</p>
      <p className="b-md text-text-quaternary text-center md:d-2xs lg:d-sm">{name}</p>
    </div>
  );
}
