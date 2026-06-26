// Shared inline icons. Drawn with currentColor so they inherit text colour and
// theme correctly in both light and dark — no per-theme asset swaps needed.

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M3 12 H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="butt" />
      <path d="M14 7 L20 12 L14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="butt" strokeLinejoin="miter" />
    </svg>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M5 19 17 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="butt" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
      <path d="M8.5 7H17v8.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="butt" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
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
