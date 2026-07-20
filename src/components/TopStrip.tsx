import { CHART_MEASURE_IDS, measureById, type MeasureId } from "../data/measures";
import { useReport } from "../state/ReportContext";
import { MeasureSlicer, type SlicerOption } from "./Slicer";

/**
 * The strip above the canvas: the Set Lines / Set Bars measure slicers on the
 * left (the two headline series, each a Power BI dropdown slicer), and the
 * version tag, logo mark and the hamburger button on the right - matching the
 * target report's top row.
 */

const MEASURE_OPTIONS: SlicerOption[] = CHART_MEASURE_IDS.map((id) => ({
  key: id,
  label: measureById.get(id)!.label,
}));

export function TopStrip({
  onToggleMenu,
  menuOpen,
}: {
  onToggleMenu: () => void;
  menuOpen: boolean;
}) {
  const { selection, setLineMeasure, setBarMeasure } = useReport();
  return (
    <div className="top-strip">
      <div className="top-strip-selectors">
        <MeasureSlicer
          label="Set Lines"
          tour="set-lines"
          value={selection.lineMeasure}
          onChange={(k) => setLineMeasure(k as MeasureId | null)}
          options={MEASURE_OPTIONS}
        />
        <MeasureSlicer
          label="Set Bars"
          tour="set-bars"
          value={selection.barMeasure}
          onChange={(k) => setBarMeasure(k as MeasureId | null)}
          options={MEASURE_OPTIONS}
        />
      </div>
      <div className="top-strip-brand">
        <span className="version-tag">v1.0</span>
        <span className="logo-mark" aria-hidden>
          <svg width="26" height="26" viewBox="0 0 26 26" role="img" aria-label="Report logo">
            <rect x="1.5" y="1.5" width="23" height="23" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M6 17.5 L10.5 11 L14 14.5 L20 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <button
          type="button"
          className="hamburger"
          onClick={onToggleMenu}
          aria-label="Report views menu"
          aria-expanded={menuOpen}
          aria-controls="report-menu"
          data-tour="menu"
        >
          ☰
        </button>
      </div>
    </div>
  );
}
