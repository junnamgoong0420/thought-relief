import { cn } from "~/lib/utils";

export function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full opacity-35 blur-[19px]",
        "bg-[radial-gradient(circle,var(--color-primary)_0%,transparent_70%)]",
        className,
      )}
    />
  );
}
