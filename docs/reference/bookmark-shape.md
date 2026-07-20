# Bookmark definition shape

A bookmark is a saved pre-selection of the slicers — nothing else. Defined in
`src/state/bookmarks.ts`.

```ts
interface BookmarkDef {
  id: string;            // unique; custom bookmarks use "custom-<timestamp>"
  name: string;          // display name, shown as the canvas title
  menuLabel: string;     // short label in the hamburger menu, e.g. "1 · Reach & Delivery"
  description: string;   // one-line promise, shown under the canvas title
  selection: Selection;  // the whole point - see below
  showAnnotation?: boolean; // open the annotation panel when applied
  annotation?: string;      // the annotation text
  guideId?: "funnel" | "click" | "list-health" | "revenue"; // paired topic guide
  builtin: boolean;
}

interface Selection {
  barMeasure: MeasureId | null;   // Set Bars - measure drawn as columns (left axis)
  lineMeasure: MeasureId | null;  // Set Lines - measure drawn as a line (right axis)
  grain: "year" | "quarter" | "month" | "week" | "date"; // Timeframe toggle (time grain)
  plotBy: "month" | "send" | "list" | "type";            // Plot By - the chart dimension
  matrixMeasures: MeasureId[];    // extra columns appended to the matrix
  months: string[] | null;        // Email Sent Date filter; null = every month in the timeframe
  lists: ListName[] | null;        // Mailing List filter; null = every list
  timeframe: "3m" | "6m" | "12m";
}
```

## Semantics

- **Applying** a bookmark replaces the entire `Selection` and records the id as
  `activeBookmarkId`. Any subsequent manual slicer change detaches the view
  (`activeBookmarkId → null`) — the bookmark itself is never mutated.
- **Built-in** bookmarks are constants (`BUILTIN_BOOKMARKS`); they surface in the
  bookmark bar and the hamburger menu.
- **Custom** bookmarks are created from the current selection
  (`saveBookmark(name)`) and persisted to `localStorage` under the key
  `report-template.bookmarks.v2`. They are per-browser; there are no accounts.
- `showAnnotation`/`annotation` replicate the "info note" pattern: a bookmark can open
  the canvas with a written observation attached (the built-in List Health bookmark does).
- Every slicer is a page filter, so `months` and `lists` travel in the bookmark too: a
  saved view restores its filters, not just its measures and dimension. `null` means the
  filter is wide open (all months / all lists).

## The four built-in bookmarks

| id | Name | Set Bars | Set Lines | Plot By | grain | additional matrix measures | timeframe |
|---|---|---|---|---|---|---|---|
| `email-overview` | Email Overview | sent | delivered | month | month | — | 12m |
| `campaign-funnel` | Monthly Report | delivered | revenue | month | month | opens, clicks, revenue | 12m |
| `the-click` | Engagement | opens | ctor | month | month | openRate, ctr, ctor | 12m |
| `list-health` | List Health | listNetChange | listMembers | list | month | — | 12m |

All four leave `months` and `lists` at `null` (no filter). List Health also sets
`showAnnotation` with a note about the eroding legacy segment.
