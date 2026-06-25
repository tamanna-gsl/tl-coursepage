import { STAGES } from "../JourneyStepper";
import { CheckIcon, ChevronRightIcon } from "../icons";
import { cn } from "../../lib/cn";

export type StageKey = "reading" | "discussion" | "evaluation";

// Session progress stepper. Same three-stage model as the modal's journey
// graphic. Pass the active stage; earlier stages render complete. Reused by
// the Reading, Discussion, and Evaluation screens.
export function ProgressStepper({
  active,
  compact = false,
}: {
  active: StageKey;
  compact?: boolean;
}) {
  const activeIndex = STAGES.findIndex((s) => s.key === active);
  const tile = compact ? "h-7 w-7" : "h-9 w-9";
  const glyph = compact ? "h-4 w-4" : "h-5 w-5";

  return (
    <nav aria-label="Session progress">
      {/* Desktop: full horizontal stepper */}
      <ol
        className={cn(
          "hidden items-center gap-1 rounded-xl border border-border bg-card shadow-sm sm:flex",
          compact ? "p-1" : "p-2"
        )}
      >
        {STAGES.map((stage, i) => {
          const isActive = i === activeIndex;
          const isComplete = i < activeIndex;
          return (
            <li
              key={stage.key}
              aria-current={isActive ? "step" : undefined}
              className="flex flex-1 items-center"
            >
              <div
                className={cn(
                  "flex flex-1 items-center rounded-lg",
                  compact ? "gap-2 px-2 py-1" : "gap-3 px-3 py-2",
                  isActive && "bg-primary/10"
                )}
              >
                <span
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-full",
                    tile,
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isComplete
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <CheckIcon className={glyph} aria-hidden />
                  ) : (
                    <stage.Icon className={glyph} aria-hidden />
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block truncate font-bold leading-tight",
                      compact ? "text-xs" : "text-sm",
                      isActive || isComplete
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {stage.label}
                  </span>
                  {!compact && (
                    <span className="block truncate text-xs leading-tight text-muted-foreground">
                      {stage.sub}
                    </span>
                  )}
                </span>
                <span className="sr-only">
                  {isActive
                    ? "current step"
                    : isComplete
                      ? "completed"
                      : "not started"}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <ChevronRightIcon
                  className="mx-0.5 h-4 w-4 shrink-0 text-muted-foreground/40"
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: condensed to the active stage plus step dots */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-sm sm:hidden">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">
            Step {activeIndex + 1} of {STAGES.length}
          </p>
          <span className="flex items-center gap-1.5" aria-hidden>
            {STAGES.map((s, i) => (
              <span
                key={s.key}
                className={cn(
                  "h-2 w-2 rounded-full",
                  i < activeIndex
                    ? "bg-primary/40"
                    : i === activeIndex
                      ? "bg-primary"
                      : "bg-muted"
                )}
              />
            ))}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            {(() => {
              const Active = STAGES[activeIndex].Icon;
              return <Active className="h-5 w-5" aria-hidden />;
            })()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold leading-tight text-foreground">
              {STAGES[activeIndex].label}
            </span>
            <span className="block truncate text-xs leading-tight text-muted-foreground">
              {STAGES[activeIndex].sub}
            </span>
          </span>
        </div>
      </div>
    </nav>
  );
}
