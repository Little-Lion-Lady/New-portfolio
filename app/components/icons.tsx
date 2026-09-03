// Shared inline icons. Drawn with currentColor so they inherit text colour and
// theme correctly in both light and dark — no per-theme asset swaps needed.

export function ArrowRight({ className }: { className?: string }) {
  // Geometry is public/home/arrow-view.svg verbatim, on its own 32×32 viewBox so
  // it stays diffable against the export. The export's shortened tail (starts at
  // x=8, was x=5) and round cap are both taken as-is. Only the stroke is ours: 2
  // instead of the export's 1.7, which reads too thin next to the button label.
  // Rendered size comes from the caller's className, so the viewBox is immaterial.
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <path
        d="M19.2284 7.75L26.9999 16.0002L19.2288 24.25M8 15.9392H26.5068"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  // Geometry is public/home/Arrow-small.svg verbatim, on its own 24×24 viewBox
  // (was a hand-built 20×20 pair of paths). The export's own stroke-width of 2 is
  // dropped on purpose: non-scaling-stroke below makes these literal rendered
  // widths rather than viewBox units, so the icon keeps one line weight at every
  // size it is used at — this renders large in the footer links, where a scaling
  // stroke would come out roughly twice as heavy.
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`[stroke-width:2px] md:[stroke-width:2.5px] lg:[stroke-width:3px] ${className ?? ""}`}>
      <path
        d="M5 19L18 6M5 6H18V19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}


export function ArrowUpRightSmall({ className }: { className?: string }) {
  // Geometry is public/home/Arrow-small.svg verbatim, on its own 24×24 viewBox;
  // only the hard-coded white is swapped for currentColor. Same asset as
  // ArrowUpRight, drawn small: this one keeps the export's stroke of 2 and has no
  // non-scaling-stroke, so the weight scales with the rendered size — 1.67px at
  // size-lg, 2px at size-xl.
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M5 19L18 6M5 6H18V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M13.4 9.4A5.4 5.4 0 1 1 6.6 2.6 4.4 4.4 0 0 0 13.4 9.4Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <circle cx="8" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 1.4v1.4M8 13.2v1.4M1.4 8h1.4M13.2 8h1.4M3.3 3.3l1 1M11.7 11.7l1 1M12.7 3.3l-1 1M4.3 11.7l-1 1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
