"use client";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <span className="text-xl font-semibold tracking-tight text-foreground">
          ThoughtRelief
        </span>
        <a
          href="#waitlist"
          className="rounded-lg border border-primary px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Join the waitlist
        </a>
      </div>
    </nav>
  );
}
