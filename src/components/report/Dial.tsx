// Donut score dial. The percentage is shown as real text in the centre, so it
// is never conveyed by the arc alone.
export function Dial({
  label,
  percent,
  color,
}: {
  label: string;
  percent: number;
  color: string;
}) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.max(0, Math.min(100, percent)) / 100);

  return (
    <div className="flex flex-col items-center rounded-xl border border-border bg-card p-5 shadow-card">
      <p
        className="text-center text-xs font-bold uppercase tracking-wide"
        style={{ color }}
      >
        {label}
      </p>
      <div className="relative mt-3 h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-heading text-2xl font-extrabold"
            style={{ color }}
          >
            {percent}%
          </span>
        </div>
      </div>
    </div>
  );
}
