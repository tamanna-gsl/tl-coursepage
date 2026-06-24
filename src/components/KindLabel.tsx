import type { LearningKind } from "../types";
import { cn } from "../lib/cn";

// Coloured-dot kind label, matching the landing page card style.
// This label is what marks case study cards as distinct from courses.
const styles: Record<LearningKind, { label: string; dot: string; text: string }> = {
  "short-course": {
    label: "Short Course",
    dot: "bg-[hsl(171_100%_42%)]",
    text: "text-[hsl(171_100%_30%)]",
  },
  "in-depth-course": {
    label: "In-Depth Course",
    dot: "bg-[hsl(23_100%_55%)]",
    text: "text-[hsl(23_90%_40%)]",
  },
  "case-study": {
    label: "Case Study",
    dot: "bg-[hsl(319_85%_55%)]",
    text: "text-[hsl(319_75%_42%)]",
  },
};

export function KindLabel({ kind }: { kind: LearningKind }) {
  const s = styles[kind];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide",
        s.text
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", s.dot)} aria-hidden />
      {s.label}
    </span>
  );
}
