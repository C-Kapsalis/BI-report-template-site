import { useEffect, useRef, useState } from "react";
import { fmtValue, type Unit } from "../data/measures";
import type { ChartModel, PaneModel } from "../data/series";

/**
 * The single-canvas combo chart. Measures are grouped into panes by unit
 * (volume / rates / revenue) sharing one x axis - one scale per pane, never
 * a second y axis. Columns carry volumes, lines carry rates.
 */

const INK_2 = "#52514e";
const MUTED = "#6e6c66";
const GRID = "#e1e0d9";
const BASELINE = "#c3c2b7";
const BAND_FILL = "rgba(42, 120, 214, 0.08)";

function useContainerWidth(): [React.RefObject<HTMLDivElement>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(860);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) {
    if (max === 0) return [0, 1];
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  const span = max - min;
  const step = Math.pow(10, Math.floor(Math.log10(span / count)));
  const err = span / count / step;
  const mult = err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1;
  const s = step * mult;
  const start = Math.floor(min / s) * s;
  const ticks: number[] = [];
  for (let v = start; v <= max + s * 0.5; v += s) ticks.push(Math.round(v * 1e9) / 1e9);
  return ticks;
}

interface HoverState {
  bucketIndex: number;
  x: number;
  y: number;
}

function Pane({
  pane,
  buckets,
  width,
  showXLabels,
}: {
  pane: PaneModel;
  buckets: ChartModel["buckets"];
  width: number;
  showXLabels: boolean;
}) {
  const [hover, setHover] = useState<HoverState | null>(null);

  const M = { top: 14, right: 12, bottom: showXLabels ? 26 : 8, left: 52 };
  const H = 190;
  const plotW = Math.max(80, width - M.left - M.right);
  const plotH = H - M.top - M.bottom;

  const values = pane.series.flatMap((s) => s.points.filter((v): v is number => v !== null));
  let vMin = Math.min(0, ...values);
  let vMax = Math.max(0, ...values);
  if (pane.ctrBand) vMax = Math.max(vMax, 0.055);
  if (values.length === 0) {
    vMin = 0;
    vMax = 1;
  }
  const ticks = niceTicks(vMin, vMax);
  const tMin = ticks[0];
  const tMax = ticks[ticks.length - 1];
  const y = (v: number) => M.top + plotH - ((v - tMin) / (tMax - tMin || 1)) * plotH;

  const n = buckets.length;
  const band = plotW / Math.max(1, n);
  const xCenter = (i: number) => M.left + band * i + band / 2;

  const colSeries = pane.series.filter((s) => s.mark === "col");
  const lineSeries = pane.series.filter((s) => s.mark === "line");
  const nCols = colSeries.length;
  const clusterW = Math.min(band * 0.72, nCols * 42);
  const barW = nCols > 0 ? Math.max(3, (clusterW - 2 * (nCols - 1)) / nCols) : 0;

  const zeroY = y(0);

  const roundedBar = (cx: number, v: number): string => {
    const x0 = cx;
    const yv = y(v);
    const r = Math.min(3, barW / 2);
    if (v >= 0) {
      const h = Math.max(0, zeroY - yv);
      if (h <= r) return `M${x0},${zeroY} h${barW} v${-h} h${-barW} Z`;
      return `M${x0},${zeroY} v${-(h - r)} q0,${-r} ${r},${-r} h${barW - 2 * r} q${r},0 ${r},${r} v${h - r} Z`;
    }
    const h = Math.max(0, yv - zeroY);
    if (h <= r) return `M${x0},${zeroY} h${barW} v${h} h${-barW} Z`;
    return `M${x0},${zeroY} v${h - r} q0,${r} ${r},${r} h${barW - 2 * r} q${r},0 ${r},${-r} v${-(h - r)} Z`;
  };

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (px < M.left || px > M.left + plotW) {
      setHover(null);
      return;
    }
    const i = Math.min(n - 1, Math.max(0, Math.floor((px - M.left) / band)));
    setHover({ bucketIndex: i, x: px, y: py });
  };

  const hoverBucket = hover ? buckets[hover.bucketIndex] : null;

  return (
    <div className="pane">
      <div className="pane-head">
        <span className="pane-title">{pane.title}</span>
        {pane.series.length >= 2 && (
          <div className="legend" role="list" aria-label={`${pane.title} series`}>
            {pane.series.map((s) => (
              <span key={s.key} className="legend-item" role="listitem">
                <span
                  className={s.mark === "line" ? "legend-swatch line" : "legend-swatch"}
                  style={{ background: s.color }}
                />
                {s.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="pane-plot">
        <svg
          width={width}
          height={H}
          role="img"
          aria-label={`${pane.title} chart: ${pane.series
            .map((s) => s.label)
            .join(", ")} across ${buckets.length} points. The matrix table below the chart lists the same values.`}
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        >
          {/* gridlines + y labels */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={M.left + plotW} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} />
              <text x={M.left - 8} y={y(t) + 3.5} textAnchor="end" fontSize={10} fill={MUTED}>
                {fmtValue(t, pane.unit, true)}
              </text>
            </g>
          ))}

          {/* CTR benchmark band */}
          {pane.ctrBand && (
            <g>
              <rect
                x={M.left}
                y={y(0.05)}
                width={plotW}
                height={Math.max(0, y(0.02) - y(0.05))}
                fill={BAND_FILL}
              />
              <text x={M.left + plotW - 6} y={y(0.05) + 11} textAnchor="end" fontSize={9.5} fill={INK_2}>
                CTR benchmark 2–5% (per send)
              </text>
            </g>
          )}

          {/* baseline */}
          <line x1={M.left} x2={M.left + plotW} y1={zeroY} y2={zeroY} stroke={BASELINE} strokeWidth={1} />

          {/* columns */}
          {colSeries.map((s, si) =>
            s.points.map((v, i) => {
              if (v === null) return null;
              const cx = xCenter(i) - clusterW / 2 + si * (barW + 2);
              return (
                <path
                  key={`${s.key}-${i}`}
                  d={roundedBar(cx, v)}
                  fill={s.color}
                  opacity={hover && hover.bucketIndex !== i ? 0.45 : 1}
                />
              );
            }),
          )}

          {/* lines */}
          {lineSeries.map((s) => {
            const segs: string[] = [];
            let cur: string[] = [];
            s.points.forEach((v, i) => {
              if (v === null) {
                if (cur.length > 1) segs.push(cur.join(" "));
                cur = [];
              } else {
                cur.push(`${cur.length === 0 ? "M" : "L"}${xCenter(i)},${y(v)}`);
              }
            });
            if (cur.length > 1) segs.push(cur.join(" "));
            return (
              <g key={s.key}>
                {segs.map((d, i) => (
                  <path key={i} d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" />
                ))}
                {s.points.map((v, i) =>
                  v === null ? null : (
                    <circle
                      key={i}
                      cx={xCenter(i)}
                      cy={y(v)}
                      r={hover?.bucketIndex === i ? 4.5 : segs.length === 0 ? 3 : 0}
                      fill={s.color}
                      stroke="#fcfcfb"
                      strokeWidth={2}
                    />
                  ),
                )}
              </g>
            );
          })}

          {/* crosshair */}
          {hover && (
            <line
              x1={xCenter(hover.bucketIndex)}
              x2={xCenter(hover.bucketIndex)}
              y1={M.top}
              y2={M.top + plotH}
              stroke={BASELINE}
              strokeWidth={1}
              strokeDasharray="3 3"
              pointerEvents="none"
            />
          )}

          {/* x labels */}
          {showXLabels &&
            buckets.map((b, i) => {
              const every = Math.ceil((n * 34) / plotW);
              if (i % Math.max(1, every) !== 0) return null;
              return (
                <text key={b.key} x={xCenter(i)} y={H - 8} textAnchor="middle" fontSize={10} fill={MUTED}>
                  {b.label}
                </text>
              );
            })}
        </svg>

        {hover && hoverBucket && (
          <div
            className="chart-tooltip"
            style={{
              left: Math.min(width - 230, Math.max(0, hover.x + 14)),
              top: 10,
            }}
          >
            <div className="tooltip-title">
              {hoverBucket.sublabel ?? hoverBucket.label}
              {hoverBucket.sublabel && <span className="tooltip-sub">{hoverBucket.label}</span>}
            </div>
            {pane.series.map((s) => {
              const v = s.points[hover.bucketIndex];
              return (
                <div key={s.key} className="tooltip-row">
                  <span className="legend-swatch" style={{ background: s.color }} />
                  <span className="tooltip-label">{s.label}</span>
                  <span className="tooltip-value">{fmtValue(v, pane.unit)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function ComboChart({ model }: { model: ChartModel }) {
  const [ref, width] = useContainerWidth();
  return (
    <div ref={ref} className="combo-chart">
      {model.panes.map((pane, i) => (
        <Pane
          key={`${pane.unit}`}
          pane={pane}
          buckets={model.buckets}
          width={width}
          showXLabels={i === model.panes.length - 1}
        />
      ))}
    </div>
  );
}

export type { Unit };
