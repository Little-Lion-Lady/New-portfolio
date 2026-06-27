export function Divider({ className }: { className?: string }) {
  return <div className={`h-px bg-border-primary ${className ?? "w-full"}`} />;
}
