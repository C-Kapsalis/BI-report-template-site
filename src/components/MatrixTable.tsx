import { useState } from "react";
import { fmtCell } from "../data/measures";
import type { MatrixModel } from "../data/series";

const SEVERITY_ICON: Record<string, string> = {
  warning: "▲",
  serious: "▲",
  critical: "●",
};

/**
 * The drilldown matrix: one row per Email Sent Month, expandable (+/-) to the
 * individual sends within that month, with a recomputed Total row. Columns are
 * the fixed six email metrics plus any additional measures. Status flags always
 * pair an icon with a label (never color alone).
 */
export function MatrixTable({ model }: { model: MatrixModel }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const colCount = model.columns.length;

  return (
    <div className="matrix">
      <div className="matrix-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col" className="row-label-col">Email Sent Month</th>
              {model.columns.map((c) => (
                <th key={c.measureId} scope="col" className="num">{c.label}</th>
              ))}
              <th scope="col" className="flags-head">Flags</th>
            </tr>
          </thead>
          <tbody>
            {model.months.map((m) => {
              const open = expanded.has(m.key);
              return (
                <FragmentRows key={m.key}>
                  <tr className="matrix-month-row">
                    <th scope="row" className="row-label-col">
                      <button
                        type="button"
                        className="matrix-expand"
                        aria-expanded={open}
                        aria-label={`${open ? "Collapse" : "Expand"} ${m.label} (${m.sends.length} sends)`}
                        onClick={() => toggle(m.key)}
                      >
                        <span className="matrix-expand-icon" aria-hidden>{open ? "−" : "+"}</span>
                        <span className="matrix-month-name">{m.label}</span>
                      </button>
                    </th>
                    {m.values.map((v, i) => (
                      <td key={i} className="num">{fmtCell(v, model.columns[i].measureId, model.columns[i].unit)}</td>
                    ))}
                    <td className="flags-col">
                      {m.flags.map((f) => (
                        <span key={f.label} className={`flag flag-${f.severity}`}>
                          <span aria-hidden>{SEVERITY_ICON[f.severity]}</span> {f.label}
                        </span>
                      ))}
                    </td>
                  </tr>
                  {open &&
                    m.sends.map((s) => (
                      <tr key={s.key} className="matrix-send-row">
                        <td className="row-label-col send-label">{s.name}</td>
                        {s.values.map((v, i) => (
                          <td key={i} className="num">{fmtCell(v, model.columns[i].measureId, model.columns[i].unit)}</td>
                        ))}
                        <td className="flags-col">
                          {s.flags.map((f) => (
                            <span key={f.label} className={`flag flag-${f.severity}`}>
                              <span aria-hidden>{SEVERITY_ICON[f.severity]}</span> {f.label}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                </FragmentRows>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="row-label-col">Total</th>
              {model.total.map((v, i) => (
                <td key={i} className="num">{fmtCell(v, model.columns[i].measureId, model.columns[i].unit)}</td>
              ))}
              <td />
            </tr>
          </tfoot>
        </table>
        <p className="visually-hidden">Table has {colCount} measure columns across {model.months.length} months.</p>
      </div>
    </div>
  );
}

/** Group sibling rows without introducing a wrapping element in the table. */
function FragmentRows({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
