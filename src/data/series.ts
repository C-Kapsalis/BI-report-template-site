/**
 * The aggregation engine: turns a Selection (axis + legend + measures +
 * timeframe) into a chart model and a matrix model. Rates are always
 * recomputed from summed numerators and denominators - never averaged.
 */

import { campaigns } from "./campaigns";
import { listMonths, MONTHS } from "./listHealth";
import {
  AXES,
  legendById,
  measureById,
  PALETTE,
  TIMEFRAMES,
  type AxisId,
  type LegendId,
  type MeasureId,
  type TimeframeId,
  type Unit,
} from "./measures";
import type { CampaignSend, ListMonth } from "./types";

export interface Selection {
  axis: AxisId | null;
  legend: LegendId | null;
  measures: MeasureId[];
  timeframe: TimeframeId;
}

export const EMPTY_SELECTION: Selection = {
  axis: null,
  legend: null,
  measures: [],
  timeframe: "12m",
};

export interface SeriesModel {
  key: string;
  label: string;
  color: string;
  mark: "col" | "line";
  measureId: MeasureId;
  points: (number | null)[];
}

export interface PaneModel {
  unit: Unit;
  title: string;
  series: SeriesModel[];
  /** Draw the 2-5% per-send CTR benchmark band. */
  ctrBand: boolean;
}

export interface ChartModel {
  buckets: { key: string; label: string; sublabel?: string }[];
  panes: PaneModel[];
  notices: string[];
}

export interface MatrixColumn {
  measureId: MeasureId;
  label: string;
  unit: Unit;
}

export interface MatrixFlag {
  label: string;
  severity: "warning" | "serious" | "critical";
}

export interface MatrixRow {
  key: string;
  label: string;
  sublabel?: string;
  values: (number | null)[];
  flags: MatrixFlag[];
}

export interface MatrixModel {
  title: string;
  columns: MatrixColumn[];
  rows: MatrixRow[];
  total: (number | null)[] | null;
}

/* ---------- helpers ---------- */

const monthKey = (isoDate: string) => isoDate.slice(0, 7);
const quarterKey = (mk: string) => {
  const [y, m] = mk.split("-").map(Number);
  return `${y}-Q${Math.ceil(m / 3)}`;
};
const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
  "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
};
const monthLabel = (mk: string) => `${MONTH_LABELS[mk.slice(5)]} ${mk.slice(2, 4)}`;

function activeMonths(timeframe: TimeframeId): string[] {
  const start = TIMEFRAMES.find((t) => t.id === timeframe)!.startMonth;
  return MONTHS.filter((m) => m >= start);
}

function activeCampaigns(timeframe: TimeframeId): CampaignSend[] {
  const months = new Set(activeMonths(timeframe));
  return campaigns
    .filter((c) => months.has(monthKey(c.sentDate)))
    .sort((a, b) => a.sentDate.localeCompare(b.sentDate));
}

function activeListMonths(timeframe: TimeframeId): ListMonth[] {
  const months = new Set(activeMonths(timeframe));
  return listMonths.filter((l) => months.has(l.month));
}

/** Aggregate a set of sends into a measure value. Rates from summed parts. */
export function sendAggregate(rows: CampaignSend[], id: MeasureId): number | null {
  if (rows.length === 0) return null;
  const sum = (f: (c: CampaignSend) => number) => rows.reduce((a, c) => a + f(c), 0);
  switch (id) {
    case "sent": return sum((c) => c.sent);
    case "delivered": return sum((c) => c.delivered);
    case "bounces": return sum((c) => c.bounces);
    case "opens": return sum((c) => c.opens);
    case "clicks": return sum((c) => c.clicks);
    case "unsubscribes": return sum((c) => c.unsubscribes);
    case "complaints": return sum((c) => c.complaints);
    case "revenue": return sum((c) => c.revenue);
    case "deliveryRate": return sum((c) => c.sent) ? sum((c) => c.delivered) / sum((c) => c.sent) : null;
    case "openRate": return sum((c) => c.delivered) ? sum((c) => c.opens) / sum((c) => c.delivered) : null;
    case "ctr": return sum((c) => c.delivered) ? sum((c) => c.clicks) / sum((c) => c.delivered) : null;
    case "ctor": return sum((c) => c.opens) ? sum((c) => c.clicks) / sum((c) => c.opens) : null;
    case "unsubRate": return sum((c) => c.delivered) ? sum((c) => c.unsubscribes) / sum((c) => c.delivered) : null;
    default: return null;
  }
}

/** Aggregate list months into a measure value. Members = end of period. */
function listAggregate(rows: ListMonth[], id: MeasureId): number | null {
  if (rows.length === 0) return null;
  const sum = (f: (l: ListMonth) => number) => rows.reduce((a, l) => a + f(l), 0);
  switch (id) {
    case "listMembers": {
      const sorted = rows.map((r) => r.month).sort();
      const lastMonth = sorted[sorted.length - 1];
      return rows.filter((r) => r.month === lastMonth).reduce((a, l) => a + l.endMembers, 0);
    }
    case "listSubscribes": return sum((l) => l.subscribes);
    case "listUnsubscribes": return sum((l) => l.unsubscribes);
    case "listCleaned": return sum((l) => l.cleaned);
    case "listNetChange": return sum((l) => l.subscribes - l.unsubscribes - l.cleaned);
    default: return null;
  }
}

/* ---------- chart ---------- */

export function buildChart(sel: Selection): ChartModel {
  const notices: string[] = [];
  if (!sel.axis || sel.measures.length === 0) {
    return { buckets: [], panes: [], notices };
  }

  const legend = sel.legend && sel.legend !== "none" ? legendById.get(sel.legend)! : null;
  const sends = activeCampaigns(sel.timeframe);
  const lists = activeListMonths(sel.timeframe);

  // Buckets
  let buckets: ChartModel["buckets"];
  if (sel.axis === "month") {
    buckets = activeMonths(sel.timeframe).map((m) => ({ key: m, label: monthLabel(m) }));
  } else if (sel.axis === "quarter") {
    const qs = [...new Set(activeMonths(sel.timeframe).map(quarterKey))];
    buckets = qs.map((q) => ({ key: q, label: q }));
  } else {
    buckets = sends.map((c) => ({
      key: c.id,
      label: c.sentDate.slice(5).replace("-", "/"),
      sublabel: c.name,
    }));
  }

  const selected = sel.measures
    .map((id) => measureById.get(id)!)
    .filter(Boolean);

  // Validity: list measures never attach to individual sends.
  let usable = selected;
  if (sel.axis === "send" && selected.some((m) => m.kind === "list")) {
    usable = selected.filter((m) => m.kind !== "list");
    notices.push(
      "List measures describe the audience, not a send - they are hidden on the Individual send axis. Switch the plot axis to Month to see them.",
    );
  }
  // Validity: campaign-type legend doesn't slice list measures.
  if (legend && legend.id === "type" && usable.some((m) => m.kind === "list")) {
    usable = usable.filter((m) => m.kind !== "list");
    notices.push(
      "Campaign type doesn't slice list measures (a list isn't a campaign). Use the Mailing list legend, or None.",
    );
  }
  // Guidance: CTR is a per-send verdict.
  if (usable.some((m) => m.id === "ctr") && sel.axis !== "send") {
    notices.push(
      "CTR is judged per send against the 2-5% band. On an aggregated axis, sends and their clicks blur together - read CTOR here instead, and switch to the Individual send axis to judge CTR.",
    );
  }

  const rowsFor = (bucketKey: string, legendKey?: string) => {
    if (sel.axis === "send") {
      return sends.filter((c) => c.id === bucketKey);
    }
    const inBucket =
      sel.axis === "month"
        ? sends.filter((c) => monthKey(c.sentDate) === bucketKey)
        : sends.filter((c) => quarterKey(monthKey(c.sentDate)) === bucketKey);
    if (!legendKey || !legend) return inBucket;
    return inBucket.filter((c) =>
      legend.id === "type" ? c.type === legendKey : c.list === legendKey,
    );
  };

  const listRowsFor = (bucketKey: string, legendKey?: string) => {
    const inBucket =
      sel.axis === "month"
        ? lists.filter((l) => l.month === bucketKey)
        : lists.filter((l) => quarterKey(l.month) === bucketKey);
    if (!legendKey) return inBucket;
    return inBucket.filter((l) => l.list === legendKey);
  };

  // Group usable measures by unit -> panes (never two scales on one axis).
  const unitOrder: Unit[] = ["count", "percent", "currency"];
  const panes: PaneModel[] = [];
  const paneTitles: Record<Unit, string> = {
    count: "Volume",
    percent: "Rates",
    currency: "Revenue",
  };

  for (const unit of unitOrder) {
    const paneMeasures = usable.filter((m) => m.unit === unit);
    if (paneMeasures.length === 0) continue;

    let series: SeriesModel[];
    if (legend) {
      // Legend splits the first measure of the pane; the rest go to the matrix.
      const first = paneMeasures[0];
      if (paneMeasures.length > 1) {
        notices.push(
          `With a legend, the chart splits ${first.label} by ${legend.label.toLowerCase()}; the other ${paneTitles[unit].toLowerCase()} measures stay in the matrix below.`,
        );
      }
      const legendValues =
        first.kind === "list" ? legendById.get("list")!.values : legend.values;
      series = legendValues.map((v) => ({
        key: `${first.id}:${v.key}`,
        label: v.label,
        color: PALETTE[(v.slot - 1) % PALETTE.length],
        mark: "col" as const,
        measureId: first.id,
        points: buckets.map((b) => {
          if (first.kind === "list") {
            if (sel.axis === "send") return null;
            return listAggregate(listRowsFor(b.key, v.key), first.id);
          }
          return sendAggregate(rowsFor(b.key, v.key), first.id);
        }),
      }));
    } else {
      series = paneMeasures.map((m, i) => ({
        key: m.id,
        label: m.label,
        color: PALETTE[(m.slot - 1) % PALETTE.length],
        // Rates read as lines; volumes and money as columns. Within a
        // mixed-volume pane the first measure takes columns, the rest lines
        // (the classic line-and-column combo, one scale per pane).
        mark: unit === "percent" ? ("line" as const) : i === 0 ? ("col" as const) : ("line" as const),
        measureId: m.id,
        points: buckets.map((b) => {
          if (m.kind === "list") {
            if (sel.axis === "send") return null;
            return listAggregate(listRowsFor(b.key), m.id);
          }
          return sendAggregate(rowsFor(b.key), m.id);
        }),
      }));
    }

    panes.push({
      unit,
      title: paneTitles[unit],
      series,
      ctrBand:
        unit === "percent" &&
        sel.axis === "send" &&
        paneMeasures.some((m) => m.id === "ctr"),
    });
  }

  return { buckets, panes, notices };
}

/* ---------- matrix ---------- */

export function buildMatrices(sel: Selection): MatrixModel[] {
  if (!sel.axis || sel.measures.length === 0) return [];
  const models: MatrixModel[] = [];
  const selected = sel.measures.map((id) => measureById.get(id)!).filter(Boolean);
  const sendMeasures = selected.filter((m) => m.kind === "send");
  const listMeasures = selected.filter((m) => m.kind === "list");
  const sends = activeCampaigns(sel.timeframe);
  const lists = activeListMonths(sel.timeframe);

  if (sendMeasures.length > 0) {
    const columns = sendMeasures.map((m) => ({ measureId: m.id, label: m.label, unit: m.unit }));
    const rows: MatrixRow[] = sends.map((c) => {
      const flags: MatrixFlag[] = [];
      const delivery = c.delivered / c.sent;
      const openRate = c.opens / c.delivered;
      const ctr = c.clicks / c.delivered;
      const complaintRate = c.complaints / c.delivered;
      if (delivery < 0.95) flags.push({ label: "Delivery below 95%", severity: "critical" });
      if (complaintRate >= 0.001) flags.push({ label: "Complaints at alarm level", severity: "serious" });
      if (openRate < 0.25 && delivery >= 0.95) flags.push({ label: "Low opens - subject line", severity: "warning" });
      if (ctr < 0.02 && openRate >= 0.25) flags.push({ label: "Low CTR - body / CTA", severity: "warning" });
      return {
        key: c.id,
        label: c.name,
        sublabel: c.subject,
        values: sendMeasures.map((m) => sendAggregate([c], m.id)),
        flags,
      };
    });
    models.push({
      title: "Campaign sends",
      columns,
      rows,
      total: sendMeasures.map((m) => sendAggregate(sends, m.id)),
    });
  }

  if (listMeasures.length > 0) {
    const columns = listMeasures.map((m) => ({ measureId: m.id, label: m.label, unit: m.unit }));
    const listNames = [...new Set(lists.map((l) => l.list))];
    const rows: MatrixRow[] = listNames.map((name) => {
      const rowsForList = lists.filter((l) => l.list === name);
      const net = rowsForList.reduce((a, l) => a + l.subscribes - l.unsubscribes - l.cleaned, 0);
      const flags: MatrixFlag[] =
        net < 0 ? [{ label: "Eroding - net loss over the period", severity: "serious" }] : [];
      return {
        key: name,
        label: name,
        values: listMeasures.map((m) => listAggregate(rowsForList, m.id)),
        flags,
      };
    });
    models.push({
      title: "Mailing lists",
      columns,
      rows,
      total: listMeasures.map((m) => listAggregate(lists, m.id)),
    });
  }

  return models;
}

export function axisLabel(axis: AxisId | null): string {
  return AXES.find((a) => a.id === axis)?.label ?? "";
}
