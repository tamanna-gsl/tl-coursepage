import { cn } from "../lib/cn";

// Prototype-only control so reviewers can preview each screen state
// (Loading, Ready, Empty, Error) without touching code. Not part of the
// production screen.
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
}: {
  phase: Phase;
  onChange: (p: Phase) => void;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-module backdrop-blur">
        <span className="px-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Preview
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
    </div>
  );
}
