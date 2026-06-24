import type { ReactNode } from "react";
import type { LearningKind } from "../types";
import { cn } from "../lib/cn";

// Chips are tinted by kind so the metadata row itself signals course type:
// teal for short courses, orange for in-depth courses, magenta for case studies.
const tones: Record<LearningKind, string> = {
  "short-course": "bg-[hsl(171_100%_95%)] text-[hsl(171_100%_28%)]",
  "in-depth-course": "bg-[hsl(23_100%_94%)] text-[hsl(23_90%_38%)]",
  "case-study": "bg-[hsl(319_100%_95%)] text-[hsl(319_75%_40%)]",
};

export function Chip({
  kind,
  children,
}: {
  kind: LearningKind;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tones[kind]
      )}
    >
      {children}
    </span>
  );
}
