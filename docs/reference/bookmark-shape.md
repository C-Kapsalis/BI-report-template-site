# Bookmark definition shape

A bookmark is a saved pre-selection of the selectors — nothing else. Defined in
`src/state/bookmarks.ts`.

```ts
interface BookmarkDef {
  id: string;            // unique; custom bookmarks use "custom-<timestamp>"
  name: string;          // display name - phrase it as the question the view answers
  description: string;   // one-line promise, shown under the canvas title
  selection: Selection;  // the whole point - see below
  showAnnotation?: boolean; // open the annotation panel when applied
  annotation?: string;      // the annotation text
  guideId?: "funnel" | "click" | "list-health" | "revenue"; // paired topic guide
  builtin: boolean;
}

interface Selection {
  axis: "month" | "quarter" | "send" | null;   // plot axis (x1)
  legend: "none" | "type" | "list" | null;     // legend dimension (x2)
  measures: MeasureId[];                       // up to 6 (y)
  timeframe: "3m" | "6m" | "12m";
}
```

## Semantics

- **Applying** a bookmark replaces the entire `Selection` and records the id as
  `activeBookmarkId`. Any subsequent manual selector change detaches the view
  (`activeBookmarkId → null`) — the bookmark itself is never mutated.
- **Built-in** bookmarks are constants (`BUILTIN_BOOKMARKS`); they surface in the
  bookmark bar and the hamburger menu's Email submenu.
- **Custom** bookmarks are created from the current selection
  (`saveBookmark(name)`) and persisted to `localStorage` under the key
  `report-template.bookmarks`. They are per-browser; there are no accounts.
- `showAnnotation`/`annotation` replicate the "info note" pattern: a bookmark can open
  the canvas with a written observation attached (the built-in List Health bookmark does).

## The four built-in bookmarks

| id | Name | axis | legend | measures | timeframe |
|---|---|---|---|---|---|
| `email-overview` | Email Overview | month | none | sent, delivered, opens, clicks, openRate, ctor, revenue | 12m |
| `campaign-funnel` | Campaign Funnel | send | none | sent, delivered, opens, clicks | 12m |
| `the-click` | The Click: CTR vs CTOR | send | none | openRate, ctr, ctor | 12m |
| `list-health` | List Health | month | list | listNetChange, listMembers | 12m |

(List Health also sets `showAnnotation` with a note about the eroding legacy segment.)
