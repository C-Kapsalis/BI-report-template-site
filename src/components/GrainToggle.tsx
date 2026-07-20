import { GRAINS } from "../data/measures";
import { useReport } from "../state/ReportContext";

/**
 * The time-grain pill under the chart: Year | Quarter | Month | Week | Date.
 * It sets the x-axis grain when plotting by a time field (Month is the
 * default and, like the target, starts active).
 */
export function GrainToggle() {
  const { selection, setGrain } = useReport();
  const disabled = selection.plotBy !== "month";
  return (
    <div className="grain-toggle" data-tour="grain">
      <div className="grain-pill" role="radiogroup" aria-label="Time grain">
        {GRAINS.map((g) => (
          <button
            key={g.id}
            type="button"
            role="radio"
            aria-checked={selection.grain === g.id}
            className={selection.grain === g.id ? "grain-item active" : "grain-item"}
            onClick={() => setGrain(g.id)}
            disabled={disabled}
            title={disabled ? "Plot by Email Sent Month to change the time grain" : g.label}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}
