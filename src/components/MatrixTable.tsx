import { useState } from "react";
import { fmtValue } from "../data/measures";
import type { MatrixModel } from "../data/series";

const SEVERITY_ICON: Record<string, string> = {
  warning: "▲",
  serious: "▲",
  critical: "●",
};

/**
 * The matrix visual: one row per campaign send (or mailing list), one column
 * per selected measure, a recomputed total row, and status flags that always
 * pair an icon with a label (never color alone).
 */
export function MatrixTable({ model }: { model: MatrixModel }) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDesc, setSortDesc] = useState(true);

  const rows = [...model.rows];
  if (sortCol !== null) {
    rows.sort((a, b) => {
      const av = a.values[sortCol] ?? -Infinity;
      const bv = b.values[sortCol] ?? -Infinity;
      return sortDesc ? bv - av : av - bv;
    });
  }

  const onSort = (i: number) => {
    if (sortCol === i) {
      if (sortDesc) setSortDesc(false);
      else {
        setSortCol(null);
        setSortDesc(true);
      }
    } else {
      setSortCol(i);
      setSortDesc(true);
    }
  };

  return (
    <div className="matrix">
      <div className="matrix-head-row">
        <h3 className="matrix-title">{model.title}</h3>
        <span className="matrix-hint">Select a column header to sort</span>
      </div>
      <div className="matrix-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col" className="row-label-col">
                {model.title === "Mailing lists" ? "List" : "Send"}
              </th>
              {model.columns.map((c, i) => (
                <th
                  key={c.measureId}
                  scope="col"
                  className="num"
                  aria-sort={
                    sortCol === i ? (sortDesc ? "descending" : "ascending") : undefined
                  }
                >
                  <button
                    className="sort-btn"
                    onClick={() => onSort(i)}
                    title={`Sort by ${c.label}`}
                  >
                    {c.label}
                    {sortCol === i && <span aria-hidden> {sortDesc ? "↓" : "↑"}</span>}
                  </button>
                </th>
              ))}
              <th scope="col">Flags</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <td className="row-label-col">
                  <span className="row-label">{r.label}</span>
                  {r.sublabel && <span className="row-sublabel">{r.sublabel}</span>}
                </td>
                {r.values.map((v, i) => (
                  <td key={i} className="num">
                    {fmtValue(v, model.columns[i].unit)}
                  </td>
                ))}
                <td className="flags-col">
                  {r.flags.map((f) => (
                    <span key={f.label} className={`flag flag-${f.severity}`}>
                      <span aria-hidden>{SEVERITY_ICON[f.severity]}</span> {f.label}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
          {model.total && (
            <tfoot>
              <tr>
                <td className="row-label-col">Total</td>
                {model.total.map((v, i) => (
                  <td key={i} className="num">
                    {fmtValue(v, model.columns[i].unit)}
                  </td>
                ))}
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
