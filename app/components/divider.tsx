// Section rules default to border-secondary. `tone="primary"` picks the heavier
// stroke, used for the rule that closes the hero on the home page.
// It's a prop rather than a className override because the tone class lives in
// the base string — passing bg-border-primary alongside it would leave the
// winner down to Tailwind's utility order, not the call site.
export function Divider({
  className,
  tone = "secondary",
}: {
  className?: string;
  tone?: "primary" | "secondary";
}) {
  const bg = tone === "primary" ? "bg-border-primary" : "bg-border-secondary";
  return <div className={`h-px ${bg} ${className ?? "w-full"}`} />;
}
