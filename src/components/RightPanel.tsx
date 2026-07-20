import { useMemo } from "react";
import { PLOT_BY, TIMEFRAMES, type PlotById } from "../data/measures";
import { MONTHS } from "../data/listHealth";
import type { ListName } from "../data/types";
import { useReport } from "../state/ReportContext";
import { GrainToggle } from "./GrainToggle";
import { ListSlicer, type SlicerOption } from "./Slicer";

/**
 * The top-right control column, matching Maya's report layout:
 *   1. the timeframe (time-grain) toggle - the first thing, top-right;
 *   2. the Plot By slicer (the chart legend / dimension);
 *   3. two dimension slicers - Email Sent Date and Mailing List - the two
 *      dimensions the matrix drills into, straight off the data model
 *      (CampaignSend.sentDate and CampaignSend.list).
 * Every slicer is a live page filter: it drives both the chart and the matrix
 * through the shared report selection, exactly like a Power BI slicer.
 */

const PLOT_OPTIONS: SlicerOption[] = PLOT_BY.map((p) => ({ key: p.id, label: p.label }));

/** Mailing List - the ListName dimension and its values (data/types.ts). */
const MAILING_LISTS: { key: ListName; label: string }[] = [
  { key: "Main newsletter", label: "Main newsletter" },
  { key: "VIP customers", label: "VIP customers" },
  { key: "Legacy blog signups", label: "Legacy blog signups" },
];
const ALL_LISTS = MAILING_LISTS.map((o) => o.key);

const MONTH_FULL: Record<string, string> = {
  "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June",
  "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December",
};
const monthLabel = (mk: string) => `${MONTH_FULL[mk.slice(5)]} ${mk.slice(0, 4)}`;

/** Toggle one value in a "null = all" filter, normalising a full set to null. */
function toggled<T>(current: T[] | null, universe: T[], value: T): T[] | null {
  const base = current ?? universe;
  const next = base.includes(value) ? base.filter((v) => v !== value) : [...base, value];
  return universe.every((v) => next.includes(v)) ? null : next;
}

export function RightPanel() {
  const { selection, setPlotBy, setMonths, setLists } = useReport();

  // Email Sent Date values: the months inside the current timeframe.
  const monthOptions = useMemo<SlicerOption[]>(() => {
    const start = TIMEFRAMES.find((t) => t.id === selection.timeframe)!.startMonth;
    return (MONTHS as readonly string[])
      .filter((m) => m >= start)
      .map((m) => ({ key: m, label: monthLabel(m) }));
  }, [selection.timeframe]);
  const monthKeys = monthOptions.map((o) => o.key);

  // null in the selection means "all selected" (no filter applied).
  const monthSelected = new Set<string>(selection.months ?? monthKeys);
  const listSelected = new Set<string>(selection.lists ?? ALL_LISTS);

  return (
    <aside className="right-panel" aria-label="Chart controls">
      {/* Timeframe - the first thing on the top-right of the plot. */}
      <div className="timeframe-slot">
        <span className="selector-label">Timeframe</span>
        <GrainToggle />
      </div>

      {/* Plot By - the dimension the chart is drawn across (the legend). */}
      <ListSlicer
        title="Plot By"
        tour="plot-by"
        options={PLOT_OPTIONS}
        select="single"
        selected={new Set([selection.plotBy])}
        onToggle={(k) => setPlotBy(k as PlotById)}
        search
      />

      {/* Dimension filters, as Power BI vertical-list slicers - they filter the
          whole page (chart + matrix) through the shared selection. */}
      <ListSlicer
        title="Email Sent Date"
        options={monthOptions}
        select="multi"
        selectAll
        search
        selected={monthSelected}
        onToggle={(k) => setMonths(toggled(selection.months, monthKeys, k))}
        onToggleAll={() => setMonths(selection.months === null ? [] : null)}
      />
      <ListSlicer
        title="Mailing List"
        options={MAILING_LISTS}
        select="multi"
        selectAll
        selected={listSelected}
        onToggle={(k) => setLists(toggled(selection.lists, ALL_LISTS, k as ListName))}
        onToggleAll={() => setLists(selection.lists === null ? [] : null)}
      />
    </aside>
  );
}
