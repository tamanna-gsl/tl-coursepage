import { useState } from "react";
import type { LearningItem, LearningKind, LearningStatus } from "../types";
import { statusLabel } from "../lib/labels";
import { cn } from "../lib/cn";
import { BookIcon, SparklesIcon } from "./icons";

const statusDot: Record<LearningStatus, string> = {
  "not-started": "bg-muted-foreground/50",
  "in-progress": "bg-primary",
  completed: "bg-secondary",
};

// Soft single-tone tints for the placeholder (no gradients).
const tint: Record<LearningKind, string> = {
  "short-course": "bg-[hsl(171_100%_96%)] text-[hsl(171_100%_32%)]",
  "in-depth-course": "bg-[hsl(23_100%_95%)] text-[hsl(23_90%_42%)]",
  "case-study": "bg-[hsl(319_100%_96%)] text-[hsl(319_75%_45%)]",
};

function KindGlyph({ kind, className }: { kind: LearningKind; className?: string }) {
  return kind === "case-study" ? (
    <SparklesIcon className={className} />
  ) : (
    <BookIcon className={className} />
  );
}

// Image-led card header: a real photo when available, otherwise a clean
// single-tone placeholder. Carries the status pill (and placeholder tag).
export function Thumbnail({ item }: { item: LearningItem }) {
  const [broken, setBroken] = useState(false);
  const showImage = item.imageUrl && !broken;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
      {showImage ? (
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center",
            tint[item.kind]
          )}
        >
          <KindGlyph kind={item.kind} className="h-12 w-12 opacity-50" />
        </div>
      )}

      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground shadow-sm backdrop-blur">
        <span
          className={cn("h-1.5 w-1.5 rounded-full", statusDot[item.status])}
          aria-hidden
        />
        {statusLabel[item.status]}
      </span>

      {item.isPlaceholder && (
        <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground shadow-sm">
          Placeholder
        </span>
      )}
    </div>
  );
}
