import { cn } from "../lib/cn";

// Prototype-only control so reviewers can preview each screen state
// (Loading, Ready, Empty, Error) and open the pre-session modal in its
// ready / error states without touching code. Not part of the production screen.
export type Phase = "loading" | "ready" | "empty" | "error";

const options: { value: Phase; label: string }[] = [
  { value: "ready", label: "Ready" },
  { value: "loading", label: "Loading" },
  { value: "empty", label: "Empty" },
  { value: "error", label: "Error" },
];

export function PreviewSwitcher({
  phase,
  onChange,
  onOpenCase,
}: {
  phase: Phase;
  onChange: (p: Phase) => void;
  onOpenCase: (state: "ready" | "error") => void;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2 sm:flex-row">
      <div className="flex items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-module backdrop-blur">
        <span className="px-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          List
        </span>
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200",
              phase === o.value
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-module backdrop-blur">
        <span className="px-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Case modal
        </span>
        <button
          onClick={() => onOpenCase("ready")}
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors duration-200 hover:bg-muted"
        >
          Open
        </button>
        <button
          onClick={() => onOpenCase("error")}
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors duration-200 hover:bg-muted"
        >
          Error
        </button>
      </div>
    </div>
  );
}
