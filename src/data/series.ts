/**
 * The aggregation engine: turns a Selection (Set Bars + Set Lines + Plot By +
 * grain + matrix measures + filters) into a dual-axis chart model and a
 * drilldown matrix model. Rates are always recomputed from summed numerators
 * and denominators - never averaged.
 */

import { campaigns } from "./campaigns";
import { listMonths, MONTHS } from "./listHealth";
import {
  BAR_COLOR,
  LINE_COLOR,
  measureById,
  TIMEFRAMES,
  type GrainId,
  type MatrixLevel,
  type MeasureId,
  type PlotById,
  type TimeframeId,
  type Unit,
} from "./measures";
import type { CampaignSend, ListMonth, ListName } from "./types";

export interface Selection {
  /** Set Bars: the measure drawn as clustered columns (left axis). */
  barMeasure: MeasureId | null;
  /** Set Lines: the measure drawn as a line (right axis). */
  lineMeasure: MeasureId | null;
  /** Time grain for the x axis when plotting by a date field. */
  grain: GrainId;
  /** Plot By: the dimension the chart is plotted across. */
  plotBy: PlotById;
  /** Extra columns appended to the matrix (beyond the fixed six). */
  matrixMeasures: MeasureId[];
  /**
   * Drilldown levels for the matrix, outer level first. Both levels =
   * months expanding to their sends; a single level flattens to that
   * level; an empty array collapses the matrix to the Total row only.
   */
  matrixDrilldown: MatrixLevel[];
  /** Email Sent Date filter (month keys); null = every month in the timeframe. */
  months: string[] | null;
  /** Mailing List slicer; null = every list (the whole page is filtered). */
  lists: ListName[] | null;
  timeframe: TimeframeId;
}

export const EMPTY_SELECTION: Selection = {
  barMeasure: null,
  lineMeasure: null,
  grain: "month",
  plotBy: "month",
  matrixMeasures: [],
  matrixDrilldown: ["month", "send"],
  months: null,
  lists: null,
  timeframe: "12m",
};

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
const MONTH_FULL: Record<string, string> = {
  "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June",
  "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December",
};
const monthLabel = (mk: string) => `${MONTH_LABELS[mk.slice(5)]} ${mk.slice(0, 4)}`;
const monthFull = (mk: string) => `${MONTH_FULL[mk.slice(5)]} ${mk.slice(0, 4)}`;

function isoWeekKey(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day + 3);
  const firstThu = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((d.getTime() - firstThu.getTime()) / 86400000 - 3 + ((firstThu.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function activeMonths(sel: Selection): string[] {
  const start = TIMEFRAMES.find((t) => t.id === sel.timeframe)!.startMonth;
  let ms = MONTHS.filter((m) => m >= start);
  if (sel.months && sel.months.length > 0) ms = ms.filter((m) => sel.months!.includes(m));
  return ms as unknown as string[];
}

function activeCampaigns(sel: Selection): CampaignSend[] {
  const months = new Set(activeMonths(sel));
  return campaigns
    .filter((c) => months.has(monthKey(c.sentDate)))
    .filter((c) => !sel.lists || sel.lists.includes(c.list))
    .sort((a, b) => a.sentDate.localeCompare(b.sentDate));
}

function activeListMonths(sel: Selection): ListMonth[] {
  const months = new Set(activeMonths(sel));
  return listMonths
    .filter((l) => months.has(l.month))
    .filter((l) => !sel.lists || sel.lists.includes(l.list));
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
    case "bounceRate": return sum((c) => c.sent) ? sum((c) => c.bounces) / sum((c) => c.sent) : null;
    case "openRate": return sum((c) => c.delivered) ? sum((c) => c.opens) / sum((c) => c.delivered) : null;
    case "ctr": return sum((c) => c.delivered) ? sum((c) => c.clicks) / sum((c) => c.delivered) : null;
    case "ctor": return sum((c) => c.opens) ? sum((c) => c.clicks) / sum((c) => c.opens) : null;
    case "unsubRate": return sum((c) => c.delivered) ? sum((c) => c.unsubscribes) / sum((c) => c.delivered) : null;
    case "complaintRate": return sum((c) => c.delivered) ? sum((c) => c.complaints) / sum((c) => c.delivered) : null;
    default: return null;
  }
}

/** Aggregate list months into a measure value. Members = end of period. */
function listAggregate(rows: ListMonth[], id: MeasureId): number | null {
  if (rows.length === 0) return null;
  const sum = (f: (l: ListMonth) => number) => rows.reduce((a, l) => a + f(l), 0);
  switch (id) {
    case "listMembers": {
      const last = rows.map((r) => r.month).sort().pop();
      return rows.filter((r) => r.month === last).reduce((a, l) => a + l.endMembers, 0);
    }
    case "listSubscribes": return sum((l) => l.subscribes);
    case "listUnsubscribes": return sum((l) => l.unsubscribes);
    case "listCleaned": return sum((l) => l.cleaned);
    case "listNetChange": return sum((l) => l.subscribes - l.unsubscribes - l.cleaned);
    default: return null;
  }
}

/* ---------- chart ---------- */

export interface ChartSeries {
  measureId: MeasureId;
  label: string;
  unit: Unit;
  color: string;
  points: (number | null)[];
}

export interface ChartBucket {
  key: string;
  label: string;
  sublabel?: string;
}

export interface ChartModel {
  buckets: ChartBucket[];
  bar: ChartSeries | null;
  line: ChartSeries | null;
  notices: string[];
  plotByLabel: string;
}

const timeBucketKey = (isoDate: string, grain: GrainId): string => {
  const mk = monthKey(isoDate);
  switch (grain) {
    case "year": return mk.slice(0, 4);
    case "quarter": return quarterKey(mk);
    case "month": return mk;
    case "week": return isoWeekKey(isoDate);
    case "date": return isoDate;
  }
};

const timeBucketLabel = (key: string, grain: GrainId): string => {
  switch (grain) {
    case "year": return key;
    case "quarter": return key.replace("-", " ");
    case "month": return monthLabel(key);
    case "week": return key.replace("-", " ");
    case "date": return `${key.slice(8)}/${key.slice(5, 7)}`;
  }
};

export function buildChart(sel: Selection): ChartModel {
  const notices: string[] = [];
  const plotByLabelText =
    sel.plotBy === "month" ? "Email Sent Month"
    : sel.plotBy === "send" ? "Individual Send"
    : sel.plotBy === "list" ? "Mailing List"
    : "Campaign Type";

  if (!sel.barMeasure && !sel.lineMeasure) {
    return { buckets: [], bar: null, line: null, notices, plotByLabel: plotByLabelText };
  }

  const sends = activeCampaigns(sel);
  const lists = activeListMonths(sel);

  // Build the buckets and, for each, a way to fetch the sends / list-months in it.
  let buckets: ChartBucket[];
  let sendsIn: (key: string) => CampaignSend[];
  let listsIn: (key: string) => ListMonth[];

  if (sel.plotBy === "send") {
    buckets = sends.map((c) => ({ key: c.id, label: c.sentDate.slice(5).replace("-", "/"), sublabel: c.name }));
    sendsIn = (k) => sends.filter((c) => c.id === k);
    listsIn = () => [];
  } else if (sel.plotBy === "list") {
    const names = [...new Set([...sends.map((c) => c.list), ...lists.map((l) => l.list)])];
    buckets = names.map((n) => ({ key: n, label: n }));
    sendsIn = (k) => sends.filter((c) => c.list === k);
    listsIn = (k) => lists.filter((l) => l.list === k);
  } else if (sel.plotBy === "type") {
    const types = [...new Set(sends.map((c) => c.type))];
    buckets = types.map((t) => ({ key: t, label: t }));
    sendsIn = (k) => sends.filter((c) => c.type === k);
    listsIn = () => [];
  } else {
    const keys = [...new Set(sends.map((c) => timeBucketKey(c.sentDate, sel.grain)))].sort();
    buckets = keys.map((k) => ({ key: k, label: timeBucketLabel(k, sel.grain) }));
    sendsIn = (k) => sends.filter((c) => timeBucketKey(c.sentDate, sel.grain) === k);
    listsIn = (k) => (sel.grain === "month" ? lists.filter((l) => l.month === k) : lists.filter((l) => quarterKey(l.month) === k || l.month.slice(0, 4) === k));
  }

  const seriesFor = (id: MeasureId | null, color: string): ChartSeries | null => {
    if (!id) return null;
    const def = measureById.get(id)!;
    const listKind = def.kind === "list";
    if (listKind && (sel.plotBy === "send" || sel.plotBy === "type")) {
      notices.push(`${def.label} describes the audience, not a send - plot by Email Sent Month or Mailing List to see it.`);
      return null;
    }
    return {
      measureId: id,
      label: def.label,
      unit: def.unit,
      color,
      points: buckets.map((b) => (listKind ? listAggregate(listsIn(b.key), id) : sendAggregate(sendsIn(b.key), id))),
    };
  };

  const bar = seriesFor(sel.barMeasure, BAR_COLOR);
  const line = seriesFor(sel.lineMeasure, LINE_COLOR);

  if (sel.barMeasure === "ctr" && sel.plotBy !== "send") {
    notices.push("CTR is judged per send against the 2-5% band. On an aggregated axis, read CTOR instead, or plot by Individual Send.");
  }

  return { buckets, bar, line, notices, plotByLabel: plotByLabelText };
}

/* ---------- matrix (fixed columns, configurable drilldown) ---------- */

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
  values: (number | null)[];
  flags: MatrixFlag[];
  /** Child rows the caller can expand into; absent for a leaf row. */
  children?: MatrixRow[];
}

export interface MatrixModel {
  columns: MatrixColumn[];
  /** Header for the row-label column, reflecting the outer drilldown level. */
  rowLabelHeader: string;
  rows: MatrixRow[];
  total: (number | null)[];
}

const FIXED_MATRIX_IDS: MeasureId[] = [
  "sent", "delivered", "deliveryRate", "bounces", "bounceRate", "complaints",
];

function sendFlags(c: CampaignSend): MatrixFlag[] {
  const flags: MatrixFlag[] = [];
  const delivery = c.sent ? c.delivered / c.sent : 1;
  const openRate = c.delivered ? c.opens / c.delivered : 0;
  const ctr = c.delivered ? c.clicks / c.delivered : 0;
  const complaintRate = c.delivered ? c.complaints / c.delivered : 0;
  if (delivery < 0.95) flags.push({ label: "Delivery below 95%", severity: "critical" });
  if (complaintRate >= 0.001) flags.push({ label: "Complaints at alarm level", severity: "serious" });
  if (openRate < 0.25 && delivery >= 0.95) flags.push({ label: "Low opens - subject line", severity: "warning" });
  if (ctr < 0.02 && openRate >= 0.25) flags.push({ label: "Low CTR - body / CTA", severity: "warning" });
  return flags;
}

function monthDeliveryFlags(rows: CampaignSend[]): MatrixFlag[] {
  const delivery = sendAggregate(rows, "deliveryRate");
  return delivery !== null && delivery < 0.95
    ? [{ label: "Delivery below 95%", severity: "critical" }]
    : [];
}

export function buildMatrix(sel: Selection): MatrixModel {
  const ids = [...FIXED_MATRIX_IDS];
  for (const m of sel.matrixMeasures) if (!ids.includes(m)) ids.push(m);
  const columns: MatrixColumn[] = ids.map((id) => {
    const d = measureById.get(id)!;
    return { measureId: id, label: d.colLabel, unit: d.unit };
  });

  const sends = activeCampaigns(sel);
  const total = ids.map((id) => sendAggregate(sends, id));

  const byMonth = sel.matrixDrilldown.includes("month");
  const bySend = sel.matrixDrilldown.includes("send");
  const rowLabelHeader = byMonth ? "Email Sent Month" : bySend ? "Individual Send" : "";

  const sendRow = (c: CampaignSend): MatrixRow => ({
    key: c.id,
    label: c.name,
    values: ids.map((id) => sendAggregate([c], id)),
    flags: sendFlags(c),
  });

  // No drilldown: the Total row alone carries the numbers.
  if (!byMonth && !bySend) {
    return { columns, rowLabelHeader, rows: [], total };
  }

  // Individual Send only: a flat, chronological list of sends.
  if (!byMonth) {
    return { columns, rowLabelHeader, rows: sends.map(sendRow), total };
  }

  const monthKeys = [...new Set(sends.map((c) => monthKey(c.sentDate)))].sort();
  const rows: MatrixRow[] = monthKeys.map((mk) => {
    const inMonth = sends.filter((c) => monthKey(c.sentDate) === mk);
    return {
      key: mk,
      label: monthFull(mk),
      values: ids.map((id) => sendAggregate(inMonth, id)),
      flags: monthDeliveryFlags(inMonth),
      // Expandable to its sends only when the send level is also on.
      children: bySend ? inMonth.map(sendRow) : undefined,
    };
  });

  return { columns, rowLabelHeader, rows, total };
}
