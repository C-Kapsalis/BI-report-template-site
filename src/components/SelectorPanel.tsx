import {
  AXES,
  LEGENDS,
  MEASURES,
  TIMEFRAMES,
  type MeasureDef,
} from "../data/measures";
import { MAX_MEASURES, useReport } from "../state/ReportContext";

/**
 * The field-parameter selector panel: Plot axis (x1), Legend (x2) and
 * Measures (y). Bookmarks are saved values of exactly these controls.
 */

const MEASURE_GROUPS: { title: string; filter: (m: MeasureDef) => boolean }[] = [
  { title: "Send funnel", filter: (m) => m.kind === "send" && m.unit === "count" },
  { title: "Send rates", filter: (m) => m.kind === "send" && m.unit === "percent" },
  { title: "Revenue", filter: (m) => m.kind === "send" && m.unit === "currency" },
  { title: "List health", filter: (m) => m.kind === "list" },
];

export function SelectorPanel() {
  const { selection, setAxis, setLegend, toggleMeasure, setTimeframe } = useReport();

  return (
    <aside className="selector-panel" aria-label="Field parameter selectors">
      <section className="selector-group" data-tour="axis">
        <h2>
          Plot axis <span className="selector-code">x1</span>
        </h2>
        <div className="chip-row" role="radiogroup" aria-label="Plot axis">
          {AXES.map((a) => (
            <button
              key={a.id}
              role="radio"
              aria-checked={selection.axis === a.id}
              className={selection.axis === a.id ? "chip selected" : "chip"}
              title={a.hint}
              onClick={() => setAxis(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>
        {!selection.axis && <p className="selector-empty">Nothing is plotted yet. Pick a plot axis - Month is the usual starting point.</p>}
      </section>

      <section className="selector-group" data-tour="legend">
        <h2>
          Legend <span className="selector-code">x2</span>
        </h2>
        <div className="chip-row" role="radiogroup" aria-label="Legend dimension">
          {LEGENDS.map((l) => (
            <button
              key={l.id}
              role="radio"
              aria-checked={selection.legend === l.id}
              className={selection.legend === l.id ? "chip selected" : "chip"}
              title={l.hint}
              onClick={() => setLegend(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <section className="selector-group" data-tour="measures">
        <h2>
          Measures <span className="selector-code">y</span>
          <span className="selector-count">
            {selection.measures.length}/{MAX_MEASURES}
          </span>
        </h2>
        {MEASURE_GROUPS.map((g) => (
          <div key={g.title} className="measure-group">
            <h3>{g.title}</h3>
            <div className="measure-list">
              {MEASURES.filter(g.filter).map((m) => {
                const checked = selection.measures.includes(m.id);
                const full = !checked && selection.measures.length >= MAX_MEASURES;
                return (
                  <label
                    key={m.id}
                    className={
                      checked ? "measure-item checked" : full ? "measure-item disabled" : "measure-item"
                    }
                    title={m.hint}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={full}
                      onChange={() => toggleMeasure(m.id)}
                    />
                    {m.label}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="selector-group" data-tour="timeframe">
        <h2>Timeframe</h2>
        <div className="timeframe-list" role="radiogroup" aria-label="Timeframe">
          {TIMEFRAMES.map((t) => (
            <button
              key={t.id}
              role="radio"
              aria-checked={selection.timeframe === t.id}
              className={selection.timeframe === t.id ? "timeframe-row selected" : "timeframe-row"}
              onClick={() => setTimeframe(t.id)}
            >
              <span className="timeframe-check" aria-hidden>
                {selection.timeframe === t.id ? "✓" : ""}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
