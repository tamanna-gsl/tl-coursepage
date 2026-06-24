import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export function Chip({
  children,
  icon,
  tone = "neutral",
}: {
  children: ReactNode;
  icon?: ReactNode;
  tone?: "neutral" | "accent" | "subject";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "accent" && "bg-accent/15 text-foreground",
        tone === "subject" && "bg-secondary/10 text-secondary"
      )}
    >
      {icon}
      {children}
    </span>
  );
}
