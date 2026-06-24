import { cn } from "../lib/cn";

export type KindFilter = "all" | "short-course" | "in-depth-course" | "case-study";
export type SortBy = "default" | "status" | "title";

const filters: { value: KindFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "short-course", label: "Short courses" },
  { value: "in-depth-course", label: "In-depth courses" },
  { value: "case-study", label: "Case studies" },
];

export function FilterBar({
  active,
  onChange,
  sortBy,
  onSortChange,
  counts,
}: {
  active: KindFilter;
  onChange: (f: KindFilter) => void;
  sortBy: SortBy;
  onSortChange: (s: SortBy) => void;
  counts: Record<KindFilter, number>;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        role="tablist"
        aria-label="Filter library by type"
      >
        {filters.map((f) => {
          const isActive = active === f.value;
          return (
            <button
              key={f.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(f.value)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ease-smooth",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs font-bold",
                  isActive ? "bg-white/25" : "bg-muted text-muted-foreground"
                )}
              >
                {counts[f.value]}
              </span>
            </button>
          );
        })}
      </div>

      <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
        <span className="hidden sm:inline">Sort by</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortBy)}
          className="h-9 rounded-md border border-input bg-card px-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="default">Recommended</option>
          <option value="status">Status</option>
          <option value="title">Title (A to Z)</option>
        </select>
      </label>
    </div>
  );
}
