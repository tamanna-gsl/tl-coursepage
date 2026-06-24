import type { LearningStatus } from "../types";
import { statusLabel } from "../lib/labels";
import { cn } from "../lib/cn";
import { CheckIcon, PlayIcon } from "./icons";

const styles: Record<LearningStatus, string> = {
  "not-started": "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/10 text-primary-dark",
  completed: "bg-secondary/10 text-secondary",
};

export function StatusBadge({ status }: { status: LearningStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[status]
      )}
    >
      {status === "completed" ? (
        <CheckIcon className="h-3.5 w-3.5" />
      ) : status === "in-progress" ? (
        <PlayIcon className="h-3 w-3" />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      )}
      {statusLabel[status]}
    </span>
  );
}
