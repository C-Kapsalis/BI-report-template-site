import type { Selection } from "../data/series";

/**
 * A bookmark is a saved pre-selection of the selector panel - nothing more.
 * See docs/reference/bookmark-shape.md for the contract and
 * docs/explanation/one-canvas-philosophy.md for why the template works
 * this way.
 */
export interface BookmarkDef {
  id: string;
  name: string;
  /** One-line promise: the recurring question this view answers. */
  description: string;
  selection: Selection;
  /** Open the annotation panel when applied. */
  showAnnotation?: boolean;
  /** Annotation text shown when showAnnotation is true. */
  annotation?: string;
  /** Topic guide this bookmark pairs with (GuidesDrawer tab id). */
  guideId?: "funnel" | "click" | "list-health" | "revenue";
  builtin: boolean;
}

export const BUILTIN_BOOKMARKS: BookmarkDef[] = [
  {
    id: "email-overview",
    name: "Email Overview",
    description: "The monthly report: the whole funnel, rates and revenue, month by month.",
    selection: {
      axis: "month",
      legend: "none",
      measures: ["sent", "delivered", "opens", "clicks", "openRate", "ctor", "revenue"],
      timeframe: "12m",
    },
    guideId: "revenue",
    builtin: true,
  },
  {
    id: "campaign-funnel",
    name: "Campaign Funnel",
    description: "Sent, delivered, opened, clicked - one cluster per send. Where does each send leak?",
    selection: {
      axis: "send",
      legend: "none",
      measures: ["sent", "delivered", "opens", "clicks"],
      timeframe: "12m",
    },
    guideId: "funnel",
    builtin: true,
  },
  {
    id: "the-click",
    name: "The Click: CTR vs CTOR",
    description: "Per-send click quality against the 2-5% CTR band. Which sends earned the open but lost the click?",
    selection: {
      axis: "send",
      legend: "none",
      measures: ["openRate", "ctr", "ctor"],
      timeframe: "12m",
    },
    guideId: "click",
    builtin: true,
  },
  {
    id: "list-health",
    name: "List Health",
    description: "The audience beneath the sends: net member change by mailing list, month by month.",
    selection: {
      axis: "month",
      legend: "list",
      measures: ["listNetChange", "listMembers"],
      timeframe: "12m",
    },
    showAnnotation: true,
    annotation:
      "Note from the template: the Legacy blog signups list has lost members every month of the period - no new sourcing, steady unsubscribes, and a December winback send that mostly harvested bounces and complaints. Campaign rates will never flag this; only the list view does.",
    guideId: "list-health",
    builtin: true,
  },
];

/* ---------- custom bookmarks (localStorage) ---------- */

const STORAGE_KEY = "report-template.bookmarks";

export function loadCustomBookmarks(): BookmarkDef[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BookmarkDef[];
    return Array.isArray(parsed) ? parsed.filter((b) => b && b.id && b.selection) : [];
  } catch {
    return [];
  }
}

export function persistCustomBookmarks(bookmarks: BookmarkDef[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    /* storage unavailable - bookmarks live for the session only */
  }
}
