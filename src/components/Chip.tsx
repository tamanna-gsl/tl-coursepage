import type { ReactNode } from "react";

// Minimal, uniform metadata chip, matching the landing page card style.
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}
