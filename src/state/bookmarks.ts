import type { Selection } from "../data/series";

/**
 * A bookmark is a saved pre-selection of the canvas selectors - Set Bars,
 * Set Lines, Plot By, the time grain, and any extra matrix measures - nothing
 * more. See docs/reference/bookmark-shape.md for the contract and
 * docs/explanation/one-canvas-philosophy.md for why the template works this
 * way.
 */
export interface BookmarkDef {
  id: string;
  /** Full name (used in the bookmark bar and as the canvas title). */
  name: string;
  /** Short label echoed in the hamburger menu, e.g. "1 · Reach & Delivery". */
  menuLabel: string;
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
    menuLabel: "1 · Reach & Delivery",
    description: "Emails sent as columns, delivered as the line - the reach-and-delivery view, month by month.",
    selection: {
      barMeasure: "sent",
      lineMeasure: "delivered",
      grain: "month",
      plotBy: "month",
      matrixMeasures: [],
      matrixDrilldown: ["month", "send"],
      months: null,
      lists: null,
      timeframe: "12m",
    },
    guideId: "funnel",
    builtin: true,
  },
  {
    id: "campaign-funnel",
    name: "Monthly Report",
    menuLabel: "2 · Monthly Report",
    description: "Delivered against attributed revenue, with opens and clicks itemized in the matrix. The whole monthly funnel.",
    selection: {
      barMeasure: "delivered",
      lineMeasure: "revenue",
      grain: "month",
      plotBy: "month",
      matrixMeasures: ["opens", "clicks", "revenue"],
      matrixDrilldown: ["month", "send"],
      months: null,
      lists: null,
      timeframe: "12m",
    },
    guideId: "revenue",
    builtin: true,
  },
  {
    id: "the-click",
    name: "Engagement",
    menuLabel: "3 · Engagement",
    description: "Opens as columns, CTOR as the line - click quality month by month, with per-send rates in the matrix.",
    selection: {
      barMeasure: "opens",
      lineMeasure: "ctor",
      grain: "month",
      plotBy: "month",
      matrixMeasures: ["openRate", "ctr", "ctor"],
      matrixDrilldown: ["month", "send"],
      months: null,
      lists: null,
      timeframe: "12m",
    },
    guideId: "click",
    builtin: true,
  },
  {
    id: "list-health",
    name: "List Health",
    menuLabel: "4 · List Health",
    description: "Net change and active members by mailing list - the audience beneath the sends.",
    selection: {
      barMeasure: "listNetChange",
      lineMeasure: "listMembers",
      grain: "month",
      plotBy: "list",
      matrixMeasures: [],
      matrixDrilldown: ["month", "send"],
      months: null,
      lists: null,
      timeframe: "12m",
    },
    showAnnotation: true,
    annotation:
      "Note from the template: the Legacy blog-signups list loses members every month of the period - no new sourcing, steady unsubscribes, and a December winback send that mostly harvested bounces and complaints. Campaign rates never flag this; only the list view does.",
    guideId: "list-health",
    builtin: true,
  },
];

/* ---------- custom bookmarks (localStorage) ---------- */

const STORAGE_KEY = "report-template.bookmarks.v2";

export function loadCustomBookmarks(): BookmarkDef[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BookmarkDef[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((b) => b && b.id && b.selection)
      .map((b) => ({
        ...b,
        // Backfill fields added after a bookmark was first saved.
        selection: {
          ...b.selection,
          matrixDrilldown: b.selection.matrixDrilldown ?? ["month", "send"],
        },
      }));
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
