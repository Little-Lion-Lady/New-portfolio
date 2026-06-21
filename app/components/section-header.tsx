// Figma "Section header" component. Layout is flex justify-between at every
// breakpoint; only the type scale changes:
//   mobile  B-sm  (text-sm 20)
//   tablet  D-xs  (display-xs 44)
//   desktop D-sm  (display-sm 60)
// Number = text-decorative (fixed 110px width); name = text-quaternary.
export function SectionHeader({ number, name }: { number: string; name: string }) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="w-[110px] b-sm text-text-decorative md:d-xs lg:d-sm">{number}</p>
      <p className="b-sm text-text-quaternary text-center md:d-xs lg:d-sm">{name}</p>
    </div>
  );
}
