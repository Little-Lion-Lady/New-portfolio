// Shared inline icons. Drawn with currentColor so they inherit text colour and
// theme correctly in both light and dark — no per-theme asset swaps needed.

export function ArrowRight({ className }: { className?: string }) {
  // Geometry is public/home/arrow-view.svg verbatim, on its own 32×32 viewBox so
  // it stays diffable against the export. Only the stroke is ours: 2 instead of
  // the export's 1.7, which reads too thin next to the button label. Rendered
  // size comes from the caller's className, so the viewBox size is immaterial.
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <path
        d="M19.2285 7.75L27 16.0002L19.2289 24.25M5.00012 15.9392H26.5069"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  // non-scaling-stroke means these are literal rendered widths, not viewBox
  // units, so the icon keeps the same line weight at every size it is used at.
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={`[stroke-width:2px] md:[stroke-width:2.5px] lg:[stroke-width:3px] ${className ?? ""}`}>
      <path d="M4.82177 2.66699H16.8216V14.667" stroke="currentColor" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d="M4.82173 14.5782L16.3966 3.00333" stroke="currentColor" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}


export function ArrowUpRightSmall({ className }: { className?: string }) {
  // Geometry is public/home/work/firsttable/Arrow-small.svg verbatim, on its own
  // 24×24 viewBox; only the hard-coded white is swapped for currentColor. Unlike
  // ArrowUpRight this has no non-scaling-stroke, so the 2 stroke scales with the
  // rendered size — 1.67px at size-lg, 2px at size-xl.
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M5 19L18 6M18 19L18 6H5"
        stroke="currentColor"
        strokeWidth="2"
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
