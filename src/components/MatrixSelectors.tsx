import { ADDITIONAL_MATRIX_IDS, measureById } from "../data/measures";
import { MAX_ADDITIONAL_MEASURES, useReport } from "../state/ReportContext";
import { Dropdown } from "./Dropdown";

/**
 * The two matrix selectors above the drilldown table: the (fixed) drilldown
 * dimensions and the additional-measure picker. Additional measures append
 * columns to the matrix; the drilldown is fixed at Month -> Send.
 */
export function MatrixSelectors() {
  const { selection, toggleMatrixMeasure } = useReport();
  const additional = selection.matrixMeasures;
  const full = additional.length >= MAX_ADDITIONAL_MEASURES;

  return (
    <div className="matrix-selectors">
      <div className="matrix-selector-block">
        <span className="selector-label">Set Drilldown Matrix Dimensions</span>
        <Dropdown label="Drilldown matrix dimensions" value="Multiple selections">
          {() => (
            <ul className="check-list" role="list">
              {["Email Sent Month", "Individual Send"].map((d) => (
                <li key={d}>
                  <label className="check-item">
                    <input type="checkbox" checked readOnly aria-label={`${d} (fixed drilldown level)`} />
                    {d}
                  </label>
                </li>
              ))}
              <li className="check-note">The drilldown is fixed: months expand to their sends.</li>
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
