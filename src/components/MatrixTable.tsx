import { useState } from "react";
import { fmtCell } from "../data/measures";
import type { MatrixColumn, MatrixModel } from "../data/series";

/**
 * The drilldown matrix. Rows follow the Set Drilldown Matrix Dimensions
 * selection: months expanding (+/-) to their sends, months only, a flat list
 * of sends, or - with no dimension selected - the Total row alone. Columns are
 * exactly the measures picked in Set Additional Matrix Measures.
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
              <th scope="col" className="row-label-col">{model.rowLabelHeader}</th>
              {model.columns.map((c) => (
                <th key={c.measureId} scope="col" className="num">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.rows.map((row) => {
              const hasChildren = !!row.children && row.children.length > 0;
              const open = hasChildren && expanded.has(row.key);
              return (
                <FragmentRows key={row.key}>
                  <tr className={hasChildren ? "matrix-month-row" : "matrix-send-row"}>
                    {hasChildren ? (
                      <th scope="row" className="row-label-col">
                        <button
                          type="button"
                          className="matrix-expand"
                          aria-expanded={open}
                          aria-label={`${open ? "Collapse" : "Expand"} ${row.label} (${row.children!.length} sends)`}
                          onClick={() => toggle(row.key)}
                        >
                          <span className="matrix-expand-icon" aria-hidden>{open ? "−" : "+"}</span>
                          <span className="matrix-month-name">{row.label}</span>
                        </button>
                      </th>
                    ) : (
                      <td className="row-label-col send-label">{row.label}</td>
                    )}
                    <Cells values={row.values} columns={model.columns} />
                  </tr>
                  {open &&
                    row.children!.map((child) => (
                      <tr key={child.key} className="matrix-send-row">
                        <td className="row-label-col send-label">{child.label}</td>
                        <Cells values={child.values} columns={model.columns} />
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
            </tr>
          </tfoot>
        </table>
        <p className="visually-hidden">Table has {colCount} measure columns across {model.rows.length} rows.</p>
      </div>
    </div>
  );
}

function Cells({ values, columns }: { values: (number | null)[]; columns: MatrixColumn[] }) {
  return (
    <>
      {values.map((v, i) => (
        <td key={i} className="num">{fmtCell(v, columns[i].measureId, columns[i].unit)}</td>
      ))}
    </>
  );
}

/** Group sibling rows without introducing a wrapping element in the table. */
function FragmentRows({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
