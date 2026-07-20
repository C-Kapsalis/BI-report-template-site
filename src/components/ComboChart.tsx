import { useEffect, useRef, useState } from "react";
import { fmtValue } from "../data/measures";
import type { ChartModel } from "../data/series";

/**
 * The single-canvas combo chart, dual-axis to match the target report:
 * clustered columns (Set Bars) on the left axis, a line (Set Lines) on the
 * right axis, with a data label above each column and a rounded pill label at
 * each line point. The matrix below is the accessible data alternative.
 */

const INK = "#1f2a24";
const MUTED = "#6e6c66";
const GRID = "#e1e0d9";
const BASELINE = "#b9b8ad";
const BAND_FILL = "rgba(42, 120, 214, 0.08)";

function useContainerWidth(): [React.RefObject<HTMLDivElement>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(820);
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

function niceTicks(min: number, max: number, count = 5): number[] {
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
}

export function ComboChart({ model }: { model: ChartModel }) {
  const [ref, width] = useContainerWidth();
  const [hover, setHover] = useState<HoverState | null>(null);

  const { buckets, bar, line } = model;
  const n = buckets.length;
  const dense = n > 14;

  const H = 380;
  const M = { top: 30, right: 66, bottom: 46, left: 68 };
  const plotW = Math.max(120, width - M.left - M.right);
  const plotH = H - M.top - M.bottom;

  // Independent scales for the two axes.
  const barVals = bar ? bar.points.filter((v): v is number => v !== null) : [];
  const lineVals = line ? line.points.filter((v): v is number => v !== null) : [];
  const barTicks = niceTicks(Math.min(0, ...barVals, 0), Math.max(0, ...barVals, 1));
  const lineTicks = niceTicks(Math.min(0, ...lineVals, 0), Math.max(0, ...lineVals, 1));
  const bMin = barTicks[0], bMax = barTicks[barTicks.length - 1];
  const lMin = lineTicks[0], lMax = lineTicks[lineTicks.length - 1];
  const yBar = (v: number) => M.top + plotH - ((v - bMin) / (bMax - bMin || 1)) * plotH;
  const yLine = (v: number) => M.top + plotH - ((v - lMin) / (lMax - lMin || 1)) * plotH;

  const band = plotW / Math.max(1, n);
  const xCenter = (i: number) => M.left + band * i + band / 2;
  const barW = Math.max(3, Math.min(band * 0.5, 46));
  const zeroBar = yBar(0);

  const roundedBar = (cx: number, v: number): string => {
    const x0 = cx - barW / 2;
    const yv = yBar(v);
    const r = Math.min(3, barW / 2);
    if (v >= 0) {
      const h = Math.max(0, zeroBar - yv);
      if (h <= r) return `M${x0},${zeroBar} h${barW} v${-h} h${-barW} Z`;
      return `M${x0},${zeroBar} v${-(h - r)} q0,${-r} ${r},${-r} h${barW - 2 * r} q${r},0 ${r},${r} v${h - r} Z`;
    }
    const h = Math.max(0, yv - zeroBar);
    if (h <= r) return `M${x0},${zeroBar} h${barW} v${h} h${-barW} Z`;
    return `M${x0},${zeroBar} v${h - r} q0,${r} ${r},${r} h${barW - 2 * r} q${r},0 ${r},${-r} v${-(h - r)} Z`;
  };

  const linePath = (() => {
    if (!line) return "";
    const parts: string[] = [];
    let started = false;
    line.points.forEach((v, i) => {
      if (v === null) { started = false; return; }
      parts.push(`${started ? "L" : "M"}${xCenter(i)},${yLine(v)}`);
      started = true;
    });
    return parts.join(" ");
  })();

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    if (px < M.left || px > M.left + plotW) { setHover(null); return; }
    const i = Math.min(n - 1, Math.max(0, Math.floor((px - M.left) / band)));
    setHover({ bucketIndex: i, x: px });
  };

  const ctrBand = bar?.measureId === "ctr" || line?.measureId === "ctr";
  const hoverBucket = hover ? buckets[hover.bucketIndex] : null;

  const seriesNames = [bar?.label, line?.label].filter(Boolean).join(" and ");

  return (
    <div ref={ref} className="combo-chart">
      <div className="chart-legend" role="list" aria-label="Series">
        {bar && (
          <span className="legend-item" role="listitem">
            <span className="legend-swatch" style={{ background: bar.color }} /> {bar.label} <span className="legend-axis">(bars, left)</span>
          </span>
        )}
        {line && (
          <span className="legend-item" role="listitem">
            <span className="legend-swatch line" style={{ background: line.color }} /> {line.label} <span className="legend-axis">(line, right)</span>
          </span>
        )}
      </div>
      <div className="pane-plot">
        <svg
          width={width}
          height={H}
          role="img"
          aria-label={`Combo chart of ${seriesNames || "no measures"} across ${n} points, plotted by ${model.plotByLabel}. The matrix table below lists the same values.`}
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        >
          {/* left-axis gridlines + labels */}
          {bar && barTicks.map((t) => (
            <g key={`b${t}`}>
              <line x1={M.left} x2={M.left + plotW} y1={yBar(t)} y2={yBar(t)} stroke={GRID} strokeWidth={1} />
              <text x={M.left - 8} y={yBar(t) + 3.5} textAnchor="end" fontSize={10} fill={MUTED}>
                {fmtValue(t, bar.unit, false)}
              </text>
            </g>
          ))}
          {/* right-axis labels */}
          {line && lineTicks.map((t) => (
            <text key={`l${t}`} x={M.left + plotW + 8} y={yLine(t) + 3.5} textAnchor="start" fontSize={10} fill={MUTED}>
              {fmtValue(t, line.unit, false)}
            </text>
          ))}

          {/* CTR benchmark band */}
          {ctrBand && line?.unit === "percent" && (
            <rect x={M.left} y={yLine(0.05)} width={plotW} height={Math.max(0, yLine(0.02) - yLine(0.05))} fill={BAND_FILL} />
          )}

          {/* baseline */}
          <line x1={M.left} x2={M.left + plotW} y1={zeroBar} y2={zeroBar} stroke={BASELINE} strokeWidth={1} />

          {/* columns */}
          {bar && bar.points.map((v, i) => {
            if (v === null) return null;
            return (
              <path key={`bar${i}`} d={roundedBar(xCenter(i), v)} fill={bar.color}
                opacity={hover && hover.bucketIndex !== i ? 0.5 : 1} />
            );
          })}

          {/* column data labels */}
          {bar && !dense && bar.points.map((v, i) =>
            v === null ? null : (
              <text key={`bl${i}`} x={xCenter(i)} y={yBar(v) - 6} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={INK}>
                {fmtValue(v, bar.unit, false)}
              </text>
            ),
          )}

          {/* line */}
          {line && linePath && (
            <path d={linePath} fill="none" stroke={line.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          )}

          {/* line pill labels */}
          {line && !dense && line.points.map((v, i) => {
            if (v === null) return null;
            const text = fmtValue(v, line.unit, false);
            const w = text.length * 6.1 + 12;
            const cx = xCenter(i);
            const cy = yLine(v);
            return (
              <g key={`lp${i}`}>
                <rect x={cx - w / 2} y={cy - 9} width={w} height={18} rx={9} fill={line.color} />
                <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize={10} fontWeight={600} fill="#fff">{text}</text>
              </g>
            );
          })}
          {/* line point markers (dense mode: no pills, keep dots) */}
          {line && dense && line.points.map((v, i) =>
            v === null ? null : <circle key={`ld${i}`} cx={xCenter(i)} cy={yLine(v)} r={2.5} fill={line.color} />,
          )}

          {/* crosshair */}
          {hover && (
            <line x1={xCenter(hover.bucketIndex)} x2={xCenter(hover.bucketIndex)} y1={M.top} y2={M.top + plotH}
              stroke={BASELINE} strokeWidth={1} strokeDasharray="3 3" pointerEvents="none" />
          )}

          {/* x labels */}
          {buckets.map((b, i) => {
            const every = Math.ceil((n * 46) / plotW);
            if (dense && i % Math.max(1, every) !== 0) return null;
            return (
              <text key={b.key} x={xCenter(i)} y={H - 24} textAnchor="middle" fontSize={10} fill={MUTED}>
                {b.label}
              </text>
            );
          })}

          {/* axis titles */}
          {bar && (
            <text transform={`translate(14 ${M.top + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill={MUTED}>{bar.label}</text>
          )}
          {line && (
            <text transform={`translate(${width - 12} ${M.top + plotH / 2}) rotate(90)`} textAnchor="middle" fontSize={11} fill={MUTED}>{line.label}</text>
          )}
          <text x={M.left + plotW / 2} y={H - 6} textAnchor="middle" fontSize={11} fill={MUTED}>{model.plotByLabel}</text>
        </svg>

        {hover && hoverBucket && (bar || line) && (
          <div className="chart-tooltip" style={{ left: Math.min(width - 230, Math.max(0, hover.x + 14)), top: 8 }}>
            <div className="tooltip-title">
              {hoverBucket.sublabel ?? hoverBucket.label}
              {hoverBucket.sublabel && <span className="tooltip-sub">{hoverBucket.label}</span>}
            </div>
            {bar && (
              <div className="tooltip-row">
                <span className="legend-swatch" style={{ background: bar.color }} />
                <span className="tooltip-label">{bar.label}</span>
                <span className="tooltip-value">{fmtValue(bar.points[hover.bucketIndex], bar.unit)}</span>
              </div>
            )}
            {line && (
              <div className="tooltip-row">
                <span className="legend-swatch line" style={{ background: line.color }} />
                <span className="tooltip-label">{line.label}</span>
                <span className="tooltip-value">{fmtValue(line.points[hover.bucketIndex], line.unit)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
