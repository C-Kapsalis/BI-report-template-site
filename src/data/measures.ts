/**
 * The selector model. The canvas is driven by a handful of field-parameter
 * style selectors:
 *   - Set Bars   -> the measure drawn as clustered columns (left axis)
 *   - Set Lines  -> the measure drawn as a line (right axis)
 *   - Plot By    -> the dimension the chart is plotted across
 *   - grain      -> the time grain when plotting by a time field
 *   - additional matrix measures -> extra columns appended to the matrix
 * Bookmarks are nothing more than saved values of these selectors - see
 * docs/explanation/one-canvas-philosophy.md.
 */

export type Unit = "count" | "percent" | "currency";
export type MeasureKind = "send" | "list";

export type MeasureId =
  | "sent"
  | "delivered"
  | "bounces"
  | "opens"
  | "clicks"
  | "unsubscribes"
  | "complaints"
  | "revenue"
  | "deliveryRate"
  | "bounceRate"
  | "openRate"
  | "ctr"
  | "ctor"
  | "unsubRate"
  | "complaintRate"
  | "listMembers"
  | "listSubscribes"
  | "listUnsubscribes"
  | "listCleaned"
  | "listNetChange";

/** Time grain for the x axis when plotting by a date field. */
export type GrainId = "year" | "quarter" | "month" | "week" | "date";

/** The "Plot By" field parameter: which dimension the chart is plotted across. */
export type PlotById = "month" | "send" | "list" | "type";

export type TimeframeId = "3m" | "6m" | "12m";

/**
 * Categorical palette (light mode), validated slot order - assigned to each
 * measure and legend value by identity, never by position in the current
 * selection, so colors stay stable when the selection changes. Blue carries
 * the columns; a deep green carries the line - the target report's pairing.
 */
export const PALETTE = [
  "#2a78d6", // 1 blue
  "#00701f", // 2 deep green
  "#e87ba4", // 3 magenta
  "#eda100", // 4 yellow
  "#1baf7a", // 5 aqua
  "#eb6834", // 6 orange
  "#4a3aa7", // 7 violet
  "#e34948", // 8 red
] as const;

/** The two headline series colors, fixed to match the target's blue/green. */
export const BAR_COLOR = "#2a78d6";
export const LINE_COLOR = "#1e5631";

export const STATUS = {
  good: "#0ca30c",
  warning: "#fab219",
  serious: "#ec835a",
  critical: "#d03b3b",
} as const;

export interface MeasureDef {
  id: MeasureId;
  /** Short label used in the selector menus. */
  label: string;
  /** Label used as a matrix column header, matching the report's wording. */
  colLabel: string;
  unit: Unit;
  kind: MeasureKind;
  /** One-line meaning. The canonical definition lives in docs/reference/glossary.md. */
  hint: string;
  /** Fixed palette slot (1-based). */
  slot: number;
}

/** Catalog order is also the display order in the selector menus. */
export const MEASURES: MeasureDef[] = [
  { id: "sent", label: "Emails Sent #", colLabel: "Emails Sent #", unit: "count", kind: "send", hint: "Emails handed to the sending server.", slot: 1 },
  { id: "delivered", label: "Emails Delivered #", colLabel: "Emails Delivered #", unit: "count", kind: "send", hint: "Sent minus bounces - what reached an inbox.", slot: 2 },
  { id: "bounces", label: "Email Bounces #", colLabel: "Email Bounces #", unit: "count", kind: "send", hint: "Sends rejected by the receiving server.", slot: 8 },
  { id: "opens", label: "Email Opens #", colLabel: "Email Opens #", unit: "count", kind: "send", hint: "Unique opens. Directional only.", slot: 4 },
  { id: "clicks", label: "Email Clicks #", colLabel: "Email Clicks #", unit: "count", kind: "send", hint: "Unique clicks on a link in the email.", slot: 5 },
  { id: "unsubscribes", label: "Unsubscribes #", colLabel: "Unsubscribes #", unit: "count", kind: "send", hint: "Recipients who opted out from this send.", slot: 6 },
  { id: "complaints", label: "Email Complaints #", colLabel: "Email Complaints #", unit: "count", kind: "send", hint: "Recipients who marked the send as spam.", slot: 7 },
  { id: "revenue", label: "Attributed Revenue", colLabel: "Attributed Revenue", unit: "currency", kind: "send", hint: "Revenue attributed to the send.", slot: 3 },
  { id: "deliveryRate", label: "Emails Delivery Rate %", colLabel: "Emails Delivery Rate %", unit: "percent", kind: "send", hint: "Delivered / sent. The deliverability gate: 95%+.", slot: 2 },
  { id: "bounceRate", label: "Email Bounce Rate %", colLabel: "Email Bounce Rate %", unit: "percent", kind: "send", hint: "Bounces / sent. Near zero on a clean list.", slot: 8 },
  { id: "openRate", label: "Email Open Rate %", colLabel: "Email Open Rate %", unit: "percent", kind: "send", hint: "Opens / delivered. Watch the trend, not the level.", slot: 4 },
  { id: "ctr", label: "Email CTR %", colLabel: "Email CTR %", unit: "percent", kind: "send", hint: "Clicks / delivered. Judge per send vs the 2-5% band.", slot: 5 },
  { id: "ctor", label: "Email CTOR %", colLabel: "Email CTOR %", unit: "percent", kind: "send", hint: "Clicks / opens. The click metric for aggregates.", slot: 7 },
  { id: "unsubRate", label: "Unsubscribe Rate %", colLabel: "Unsubscribe Rate %", unit: "percent", kind: "send", hint: "Unsubscribes / delivered. Alarm above 0.5%.", slot: 6 },
  { id: "complaintRate", label: "Complaint Rate %", colLabel: "Complaint Rate %", unit: "percent", kind: "send", hint: "Complaints / delivered. Critical above 0.3%.", slot: 7 },
  { id: "listMembers", label: "List Active Members", colLabel: "List Active Members", unit: "count", kind: "list", hint: "Active members at end of period.", slot: 1 },
  { id: "listSubscribes", label: "List Subscribes", colLabel: "List Subscribes", unit: "count", kind: "list", hint: "New members added in the period.", slot: 2 },
  { id: "listUnsubscribes", label: "List Unsubscribes", colLabel: "List Unsubscribes", unit: "count", kind: "list", hint: "Members who opted out in the period.", slot: 6 },
  { id: "listCleaned", label: "List Cleaned", colLabel: "List Cleaned", unit: "count", kind: "list", hint: "Addresses removed by hygiene in the period.", slot: 4 },
  { id: "listNetChange", label: "List Net Change", colLabel: "List Net Change", unit: "count", kind: "list", hint: "Subscribes - unsubscribes - cleaned.", slot: 7 },
];

export const measureById = new Map(MEASURES.map((m) => [m.id, m]));

/** Measures offered in the Set Bars / Set Lines dropdowns (headline, per-send). */
export const CHART_MEASURE_IDS: MeasureId[] = [
  "sent", "delivered", "opens", "clicks", "bounces", "complaints", "revenue",
  "deliveryRate", "bounceRate", "openRate", "ctr", "ctor",
  "listMembers", "listSubscribes", "listNetChange",
];

/** Measures offered in the "Set Additional Matrix Measures" menu. */
export const ADDITIONAL_MATRIX_IDS: MeasureId[] = [
  "opens", "clicks", "openRate", "ctr", "ctor", "unsubscribes", "unsubRate", "complaintRate", "revenue",
];

export interface GrainDef {
  id: GrainId;
  label: string;
}

export const GRAINS: GrainDef[] = [
  { id: "year", label: "Year" },
  { id: "quarter", label: "Quarter" },
  { id: "month", label: "Month" },
  { id: "week", label: "Week" },
  { id: "date", label: "Date" },
];

export interface PlotByDef {
  id: PlotById;
  label: string;
  hint: string;
}

export const PLOT_BY: PlotByDef[] = [
  { id: "month", label: "Email Sent Month", hint: "Plot across calendar time at the selected grain." },
  { id: "send", label: "Individual Send", hint: "One point per campaign send." },
  { id: "list", label: "Mailing List", hint: "One point per mailing list." },
  { id: "type", label: "Campaign Type", hint: "One point per campaign type." },
];

export const plotByLabel = (id: PlotById) => PLOT_BY.find((p) => p.id === id)?.label ?? "";

export const TIMEFRAMES: { id: TimeframeId; label: string; startMonth: string }[] = [
  { id: "12m", label: "Last 12 months", startMonth: "2025-08" },
  { id: "6m", label: "Last 6 months", startMonth: "2026-02" },
  { id: "3m", label: "Last 3 months", startMonth: "2026-05" },
];

/* ---------- formatting ---------- */

/** Full-precision value: thousands separators for counts, 2 dp for percents. */
export function fmtValue(value: number | null, unit: Unit, compact = false): string {
  if (value === null || Number.isNaN(value)) return "–";
  if (unit === "percent") return `${(value * 100).toFixed(2)} %`;
  if (unit === "currency") {
    if (compact && Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
    return `$${Math.round(value).toLocaleString("en-US")}`;
  }
  if (compact && Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(Math.abs(value) >= 10000 ? 0 : 1)}k`;
  }
  return Math.round(value).toLocaleString("en-US");
}

/** Matrix-cell formatting: matches the report (delivery rate 0 dp, others 2 dp). */
export function fmtCell(value: number | null, id: MeasureId, unit: Unit): string {
  if (value === null || Number.isNaN(value)) return "";
  if (unit === "percent") {
    const dp = id === "deliveryRate" ? 0 : 2;
    return `${(value * 100).toFixed(dp)} %`;
  }
  if (unit === "currency") return `$${Math.round(value).toLocaleString("en-US")}`;
  return Math.round(value).toLocaleString("en-US");
}
