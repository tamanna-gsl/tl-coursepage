import { STAGES } from "../JourneyStepper";
import { CheckIcon, ChevronRightIcon } from "../icons";
import { cn } from "../../lib/cn";

export type StageKey = "reading" | "discussion" | "evaluation";

// Session progress stepper. Same three-stage model as the modal's journey
// graphic. Pass the active stage; earlier stages render complete. Reused by
// the Reading, Discussion, and Evaluation screens.
export function ProgressStepper({ active }: { active: StageKey }) {
  const activeIndex = STAGES.findIndex((s) => s.key === active);

  return (
    <nav aria-label="Session progress">
      {/* Desktop: full horizontal stepper */}
      <ol className="hidden items-stretch rounded-xl border border-border bg-card p-1.5 shadow-sm sm:flex">
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
                  "flex flex-1 items-center gap-3 rounded-lg px-4 py-2.5",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <span
                  className={cn(
                    "shrink-0",
                    isActive
                      ? "text-primary-foreground"
                      : isComplete
                        ? "text-primary"
                        : "text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <CheckIcon className="h-5 w-5" aria-hidden />
                  ) : (
                    <stage.Icon className="h-5 w-5" aria-hidden />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold leading-tight">
                    {stage.label}
                  </span>
                  <span
                    className={cn(
                      "block truncate text-xs leading-tight",
                      isActive
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {stage.sub}
                  </span>
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
                  className="mx-0.5 h-4 w-4 shrink-0 text-muted-foreground"
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
                  i <= activeIndex ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
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
