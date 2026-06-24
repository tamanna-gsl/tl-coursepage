import type { MasteryBand, RadarPoint } from "../../data/reportData";
import { RADAR_MAX } from "../../data/reportData";

// Visually-hidden data table so each chart has a real text equivalent.
function DataTable({
  caption,
  cols,
  rows,
}: {
  caption: string;
  cols: [string, string];
  rows: [string, string | number][];
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{cols[0]}</th>
          <th scope="col">{cols[1]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <th scope="row">{k}</th>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function RadarChart({ data }: { data: RadarPoint[] }) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const R = 110;
  const n = data.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const point = (i: number, val: number) => {
    const radius = (val / RADAR_MAX) * R;
    return [cx + radius * Math.cos(angle(i)), cy + radius * Math.sin(angle(i))];
  };
  const polygon = (val: number) =>
    data.map((_, i) => point(i, val).join(",")).join(" ");
  const dataPolygon = data.map((d, i) => point(i, d.value).join(",")).join(" ");
  const rings = [1, 2, 3, 4, 5];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto h-auto w-full max-w-[340px]"
        role="img"
        aria-label="Participation profile radar chart"
      >
        {rings.map((ring) => (
          <polygon
            key={ring}
            points={polygon(ring)}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
        ))}
        {data.map((_, i) => {
          const [x, y] = point(i, RADAR_MAX);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={dataPolygon}
          fill="hsl(257 100% 75% / 0.35)"
          stroke="hsl(257 80% 60%)"
          strokeWidth="2"
        />
        {data.map((d, i) => {
          const [x, y] = point(i, RADAR_MAX * 1.16);
          const anchor = x < cx - 6 ? "end" : x > cx + 6 ? "start" : "middle";
          return (
            <text
              key={d.axis}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-muted-foreground text-[11px]"
            >
              {d.axis}
            </text>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        Participation across seven areas, each scored out of {RADAR_MAX}.
      </figcaption>
      <DataTable
        caption="Participation profile values, out of 5"
        cols={["Area", "Score"]}
        rows={data.map((d) => [d.axis, d.value])}
      />
    </figure>
  );
}

const BAND_COLOURS: Record<string, string> = {
  "Needs Improvement": "hsl(0 84% 60%)",
  Developing: "hsl(38 92% 50%)",
  Good: "hsl(221 91% 45%)",
  Excellent: "hsl(142 60% 42%)",
};

export function MasteryBarChart({ data }: { data: MasteryBand[] }) {
  const axisMax = 12;
  const ticks = [0, 4, 8, 12];

  return (
    <figure className="m-0">
      <div role="img" aria-label="Mastery profile bar chart" className="space-y-3">
        {data.map((band) => (
          <div key={band.band} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">
              {band.band}
            </span>
            <div className="relative h-7 flex-1 rounded bg-muted/60">
              <div
                className="h-full rounded"
                style={{
                  width: `${(band.count / axisMax) * 100}%`,
                  backgroundColor: BAND_COLOURS[band.band] ?? "hsl(var(--primary))",
                }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground">
                {band.count}
              </span>
            </div>
          </div>
        ))}
        <div className="flex gap-3">
          <span className="w-28 shrink-0" aria-hidden />
          <div className="flex flex-1 justify-between text-[11px] text-muted-foreground">
            {ticks.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        Number of skills in each mastery band.
      </figcaption>
      <DataTable
        caption="Mastery profile counts per band"
        cols={["Band", "Count"]}
        rows={data.map((b) => [b.band, b.count])}
      />
    </figure>
  );
}
