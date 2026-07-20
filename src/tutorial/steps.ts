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
      "This is a reporting template for email marketers without a data team. There is exactly one chart and one matrix, and everything they show is driven by a few selectors: Set Bars, Set Lines, Plot By, and a time-grain toggle. Right now nothing is set for the chart, so it is blank. In the next few steps you will build a view, save it as a bookmark, and see why bookmarks make one canvas do the work of a dozen static pages.",
    target: "canvas",
    isComplete: () => true,
  },
  {
    id: "set-bars",
    title: "Step 1 - Set Bars (the columns)",
    body:
      "The chart is a combo: clustered columns on the left axis, a line on the right. Start with the columns. Open the Set Bars dropdown at the top left and pick Emails Sent # - the volume you send each month.",
    target: "set-bars",
    isComplete: (c) => c.selection.barMeasure !== null,
    todo: "Choose a measure in Set Bars (try Emails Sent #).",
  },
  {
    id: "set-lines",
    title: "Step 2 - Set Lines (the line)",
    body:
      "Now the line, drawn on its own right-hand axis so a different scale reads cleanly against the columns. Open Set Lines and pick Emails Delivered # - what actually reached an inbox. The chart now shows reach against delivery, month by month.",
    target: "set-lines",
    isComplete: (c) => c.selection.lineMeasure !== null,
    todo: "Choose a measure in Set Lines (try Emails Delivered #).",
  },
  {
    id: "plot-by",
    title: "Step 3 - Plot By and the time grain",
    body:
      "Plot By (in the right-hand panel) decides what one point on the chart means: Email Sent Month for the program view, or Individual Send, Mailing List, or Campaign Type to slice it differently. When you plot by month, the Timeframe grain toggle at the top-right - Year, Quarter, Month, Week, Date - sets how time is bucketed. Try switching Plot By, then set it back to Email Sent Month.",
    target: "plot-by",
    isComplete: () => true,
  },
  {
    id: "matrix",
    title: "Step 4 - the matrix follows along",
    body:
      "Below the chart is the matrix: every month of email, with sent, delivered, delivery rate, bounces, bounce rate and complaints. Click the + on any month to drill into its individual sends, and use Set Additional Matrix Measures to add columns like Open Rate % or CTR %. The Total row always recomputes from the parts.",
    target: "matrix",
    isComplete: () => true,
  },
  {
    id: "save",
    title: "Step 5 - save this as a bookmark",
    body:
      "The view you just built answers a question you will ask again next month. Don't rebuild it - bookmark it. Click 'Save current view' in the Views bar, give it a name that states the question (like 'Reach vs delivery'), and save.",
    target: "save-bookmark",
    isComplete: (c) => c.customBookmarks.length > 0,
    todo: "Save the current view as a named bookmark.",
  },
  {
    id: "switch",
    title: "Step 6 - now switch to a built-in view",
    body:
      "Click any of the four built-in views in the Views bar - Engagement is a good one. Watch what happens: Set Bars, Set Lines, Plot By and the matrix all snap to that view's saved selection, and everything redraws. Nothing navigated; the canvas just changed its mind. (The same four views live in the ☰ menu top-right.)",
    target: "bookmarks",
    isComplete: (c) => c.activeBookmarkId !== null && c.builtinIds.includes(c.activeBookmarkId),
    todo: "Apply one of the built-in views.",
  },
  {
    id: "return",
    title: "Step 7 - and come back to yours",
    body:
      "Now click the view you saved. Everything returns exactly as you left it - your bars, your line, your Plot By. Your view was never lost; it was just one selection among many.",
    target: "custom-bookmark",
    isComplete: (c) => c.activeBookmarkId?.startsWith("custom-") ?? false,
    todo: "Click your saved view.",
  },
  {
    id: "lesson",
    title: "The lesson",
    body:
      "A bookmark is just a saved pre-selection of Set Bars, Set Lines, Plot By and the matrix that answers one recurring marketing question. That's the whole trick behind this template: one canvas plus selectors plus bookmarks replaces a stack of static report pages - and every view stays consistent, because they all draw from the same selectors and the same data. Head to the Report page to explore the four built-in views, and open the Guides for the thinking behind each one.",
    target: null,
    isComplete: () => true,
  },
];
