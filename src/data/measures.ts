/**
 * The selector model: catalogs of measures (y), plot axes (x1) and legend
 * dimensions (x2). Bookmarks are nothing more than saved selections from
 * these catalogs - see docs/explanation/one-canvas-philosophy.md.
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
  | "openRate"
  | "ctr"
  | "ctor"
  | "unsubRate"
  | "listMembers"
  | "listSubscribes"
  | "listUnsubscribes"
  | "listCleaned"
  | "listNetChange";

export type AxisId = "month" | "quarter" | "send";
export type LegendId = "none" | "type" | "list";
export type TimeframeId = "3m" | "6m" | "12m";

/**
 * Categorical palette (light mode), validated slot order - assigned to each
 * measure and legend value by identity, never by position in the current
 * selection, so colors stay stable when the selection changes.
 */
export const PALETTE = [
  "#2a78d6", // 1 blue
  "#008300", // 2 green
  "#e87ba4", // 3 magenta
  "#eda100", // 4 yellow
  "#1baf7a", // 5 aqua
  "#eb6834", // 6 orange
  "#4a3aa7", // 7 violet
  "#e34948", // 8 red
] as const;

export const STATUS = {
  good: "#0ca30c",
  warning: "#fab219",
  serious: "#ec835a",
  critical: "#d03b3b",
} as const;

export interface MeasureDef {
  id: MeasureId;
  label: string;
  unit: Unit;
  kind: MeasureKind;
  /** One-line meaning. The canonical definition lives in docs/reference/glossary.md. */
  hint: string;
  /** Fixed palette slot (1-based). */
  slot: number;
}

/** Catalog order is also the display order in the selector and the matrix. */
export const MEASURES: MeasureDef[] = [
  { id: "sent", label: "Emails Sent", unit: "count", kind: "send", hint: "Emails handed to the sending server.", slot: 1 },
  { id: "delivered", label: "Emails Delivered", unit: "count", kind: "send", hint: "Sent minus bounces - what reached an inbox.", slot: 5 },
  { id: "bounces", label: "Bounces", unit: "count", kind: "send", hint: "Sends rejected by the receiving server.", slot: 8 },
  { id: "opens", label: "Opens", unit: "count", kind: "send", hint: "Unique opens. Directional only.", slot: 4 },
  { id: "clicks", label: "Link Clicks", unit: "count", kind: "send", hint: "Unique clicks on a link in the email.", slot: 2 },
  { id: "unsubscribes", label: "Unsubscribes", unit: "count", kind: "send", hint: "Recipients who opted out from this send.", slot: 6 },
  { id: "complaints", label: "Spam Complaints", unit: "count", kind: "send", hint: "Recipients who marked the send as spam.", slot: 7 },
  { id: "revenue", label: "Revenue", unit: "currency", kind: "send", hint: "Revenue attributed to the send.", slot: 3 },
  { id: "deliveryRate", label: "Delivery Rate %", unit: "percent", kind: "send", hint: "Delivered / sent. The deliverability gate: 95%+.", slot: 1 },
  { id: "openRate", label: "Open Rate %", unit: "percent", kind: "send", hint: "Opens / delivered. Watch the trend, not the level.", slot: 4 },
  { id: "ctr", label: "CTR %", unit: "percent", kind: "send", hint: "Clicks / delivered. Judge per send vs the 2-5% band.", slot: 2 },
  { id: "ctor", label: "CTOR %", unit: "percent", kind: "send", hint: "Clicks / opens. The click metric for aggregates.", slot: 7 },
  { id: "unsubRate", label: "Unsubscribe Rate %", unit: "percent", kind: "send", hint: "Unsubscribes / delivered. Alarm above 0.5%.", slot: 6 },
  { id: "listMembers", label: "List Active Members", unit: "count", kind: "list", hint: "Active members at end of period.", slot: 1 },
  { id: "listSubscribes", label: "List Subscribes", unit: "count", kind: "list", hint: "New members added in the period.", slot: 2 },
  { id: "listUnsubscribes", label: "List Unsubscribes", unit: "count", kind: "list", hint: "Members who opted out in the period.", slot: 6 },
  { id: "listCleaned", label: "List Cleaned", unit: "count", kind: "list", hint: "Addresses removed by hygiene in the period.", slot: 4 },
  { id: "listNetChange", label: "List Net Change", unit: "count", kind: "list", hint: "Subscribes - unsubscribes - cleaned.", slot: 7 },
];

export const measureById = new Map(MEASURES.map((m) => [m.id, m]));

export interface AxisDef {
  id: AxisId;
  label: string;
  hint: string;
}

export const AXES: AxisDef[] = [
  { id: "month", label: "Month", hint: "Calendar months. The default reporting grain." },
  { id: "quarter", label: "Quarter", hint: "Calendar quarters." },
  { id: "send", label: "Individual send", hint: "One point per campaign send, on its send date." },
];

export interface LegendDef {
  id: LegendId;
  label: string;
  hint: string;
  values: { key: string; label: string; slot: number }[];
}

export const LEGENDS: LegendDef[] = [
  { id: "none", label: "None", hint: "No split - one series per measure.", values: [] },
  {
    id: "type",
    label: "Campaign type",
    hint: "Split by Newsletter / Promotion / Lifecycle.",
    values: [
      { key: "Newsletter", label: "Newsletter", slot: 1 },
      { key: "Promotion", label: "Promotion", slot: 2 },
      { key: "Lifecycle", label: "Lifecycle", slot: 3 },
      { key: "Announcement", label: "Announcement", slot: 4 },
    ],
  },
  {
    id: "list",
    label: "Mailing list",
    hint: "Split by the list the send went to.",
    values: [
      { key: "Main newsletter", label: "Main newsletter", slot: 1 },
      { key: "VIP customers", label: "VIP customers", slot: 2 },
      { key: "Legacy blog signups", label: "Legacy blog signups", slot: 3 },
    ],
  },
];

export const legendById = new Map(LEGENDS.map((l) => [l.id, l]));

export const TIMEFRAMES: { id: TimeframeId; label: string; startMonth: string }[] = [
  { id: "12m", label: "Last 12 months", startMonth: "2025-08" },
  { id: "6m", label: "Last 6 months", startMonth: "2026-02" },
  { id: "3m", label: "Last 3 months", startMonth: "2026-05" },
];

/** Formatting */
export function fmtValue(value: number | null, unit: Unit, compact = false): string {
  if (value === null || Number.isNaN(value)) return "–";
  if (unit === "percent") return `${(value * 100).toFixed(1)}%`;
  if (unit === "currency") {
    if (compact && Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
    return `$${Math.round(value).toLocaleString("en-US")}`;
  }
  if (compact && Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(Math.abs(value) >= 10000 ? 0 : 1)}k`;
  }
  return Math.round(value).toLocaleString("en-US");
}
