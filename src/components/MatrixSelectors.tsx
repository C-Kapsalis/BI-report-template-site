import { ADDITIONAL_MATRIX_IDS, MATRIX_LEVELS, measureById } from "../data/measures";
import { MAX_ADDITIONAL_MEASURES, useReport } from "../state/ReportContext";
import { Dropdown } from "./Dropdown";

/**
 * The two matrix selectors above the drilldown table: the drilldown dimensions
 * (Email Sent Month and/or Individual Send, or neither for a totals-only view)
 * and the additional-measure picker. Additional measures append columns to the
 * matrix; every column also honours the totals when no dimension is chosen.
 */
export function MatrixSelectors() {
  const { selection, toggleMatrixMeasure, clearMatrixMeasures, toggleMatrixLevel } = useReport();
  const additional = selection.matrixMeasures;
  const full = additional.length >= MAX_ADDITIONAL_MEASURES;
  const levels = selection.matrixDrilldown;

  const drilldownValue =
    levels.length === 0
      ? "(None)"
      : levels.length === MATRIX_LEVELS.length
        ? "Multiple selections"
        : MATRIX_LEVELS.find((l) => l.id === levels[0])!.label;

  return (
    <div className="matrix-selectors">
      <div className="matrix-selector-block">
        <span className="selector-label">Set Drilldown Matrix Dimensions</span>
        <Dropdown label="Drilldown matrix dimensions" value={drilldownValue}>
          {() => (
            <ul className="check-list" role="list">
              {MATRIX_LEVELS.map((l) => (
                <li key={l.id}>
                  <label className="check-item">
                    <input
                      type="checkbox"
                      checked={levels.includes(l.id)}
                      onChange={() => toggleMatrixLevel(l.id)}
                    />
                    {l.label}
                  </label>
                </li>
              ))}
              <li className="check-note">
                {levels.length === 0
                  ? "No drilldown - the matrix shows the Total row only."
                  : "Clear both to collapse the matrix to totals."}
              </li>
            </ul>
          )}
        </Dropdown>
      </div>

      <div className="matrix-selector-block">
        <span className="selector-label">Set Additional Matrix Measures</span>
        <Dropdown
          label="Additional matrix measures"
          value={additional.length ? "Multiple selections" : "(None)"}
          tourId="matrix-measures"
        >
          {() => (
            <ul className="check-list" role="list">
              <li>
                <label className="check-item">
                  <input
                    type="checkbox"
                    checked={additional.length === 0}
                    onChange={clearMatrixMeasures}
                    aria-label="No additional measures"
                  />
                  (None)
                </label>
              </li>
              {ADDITIONAL_MATRIX_IDS.map((id) => {
                const checked = additional.includes(id);
                const disabled = !checked && full;
                return (
                  <li key={id}>
                    <label className={disabled ? "check-item disabled" : "check-item"}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleMatrixMeasure(id)}
                      />
                      {measureById.get(id)!.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </Dropdown>
      </div>
    </div>
  );
}
