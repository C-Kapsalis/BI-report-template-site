import type { Selection } from "../data/series";
import type { BookmarkDef } from "../state/bookmarks";

export interface StepCtx {
  selection: Selection;
  activeBookmarkId: string | null;
  customBookmarks: BookmarkDef[];
  builtinIds: string[];
}

export interface TutorialStep {
  id: string;
  title: string;
  body: string;
  /** data-tour attribute of the control to spotlight; null centers the card. */
  target: string | null;
  /** Gate for the Next button. */
  isComplete: (ctx: StepCtx) => boolean;
  /** Shown under the body while the gate is closed. */
  todo?: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "One canvas, every question",
    body:
      "This is a reporting template for email marketers without a data team. There is exactly one chart and one matrix, and everything they show is driven by three selectors: a plot axis, a legend, and a set of measures. Right now nothing is selected, so the canvas is blank. In the next few steps you will build a view, save it as a bookmark, and see why bookmarks make one canvas do the work of a dozen static pages.",
    target: "canvas",
    isComplete: () => true,
  },
  {
    id: "axis",
    title: "Step 1 - pick your plot axis",
    body:
      "The plot axis decides what one point on the chart means. For email reporting you almost always start with time: pick Month for the program view, or Individual send when you want one point per campaign. Pick Month now.",
    target: "axis",
    isComplete: (c) => c.selection.axis !== null,
    todo: "Select a plot axis (Month is the usual start).",
  },
  {
    id: "legend",
    title: "Step 2 - pick a legend",
    body:
      "The legend splits each point into series - the same chart, sliced by a dimension. Try Mailing list to compare the audiences your sends go to, or Campaign type to compare newsletters against promotions.",
    target: "legend",
    isComplete: (c) => c.selection.legend !== null && c.selection.legend !== "none",
    todo: "Select a legend dimension (not None).",
  },
  {
    id: "measures",
    title: "Step 3 - pick your measures",
    body:
      "Measures are the numbers on the canvas. Try Emails Delivered plus Open Rate % - and add CTR % if you're curious: the report will politely warn you that CTR is a per-send verdict, which is exactly the kind of guardrail this template bakes in. Volumes draw as columns, rates as lines, each with its own scale.",
    target: "measures",
    isComplete: (c) => c.selection.measures.length >= 1,
    todo: "Tick at least one measure.",
  },
  {
    id: "save",
    title: "Step 4 - save this as a bookmark",
    body:
      "The view you just built answers a question you will ask again next month. Don't rebuild it - bookmark it. Click 'Save current view', give it a name that states the question (like 'List by month'), and save.",
    target: "save-bookmark",
    isComplete: (c) => c.customBookmarks.length > 0,
    todo: "Save the current view as a named bookmark.",
  },
  {
    id: "switch",
    title: "Step 5 - now click a built-in bookmark",
    body:
      "Click any of the four built-in bookmarks - Campaign Funnel is a good one. Watch what happens: the axis, legend and measures all snap to that bookmark's saved selection, and the chart and matrix redraw. Nothing navigated; the canvas just changed its mind.",
    target: "bookmarks",
    isComplete: (c) => c.activeBookmarkId !== null && c.builtinIds.includes(c.activeBookmarkId),
    todo: "Apply one of the built-in bookmarks.",
  },
  {
    id: "return",
    title: "Step 6 - and come back to yours",
    body:
      "Now click the bookmark you saved. Everything returns exactly as you left it - your axis, your legend, your measures. Your view was never lost; it was just one selection among many.",
    target: "custom-bookmark",
    isComplete: (c) => c.activeBookmarkId?.startsWith("custom-") ?? false,
    todo: "Click your saved bookmark.",
  },
  {
    id: "lesson",
    title: "The lesson",
    body:
      "A bookmark is just a saved pre-selection of dimensions and measures that answers one recurring marketing question. That's the whole trick behind this template: one canvas plus selectors plus bookmarks replaces a stack of static report pages - and every view stays consistent, because they all draw from the same selectors and the same data. Head to the Report page to explore the four built-in views, and open the Guides for the thinking behind each one.",
    target: null,
    isComplete: () => true,
  },
];
