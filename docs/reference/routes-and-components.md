# Routes and components

## Routes

| Route | Page | Initial state |
|---|---|---|
| `/` | `ReportPage` | Applies the `email-overview` bookmark |
| `/tutorial` | `TutorialPage` | Blank selection + coach-mark overlay |
| `*` | `ReportPage` | Fallback (plus `vercel.json` SPA rewrite at the host level) |

## Component map

```
src/
├── main.tsx                  entry; mounts <App/>
├── App.tsx                   BrowserRouter + routes
├── styles.css                design tokens + all styling
├── pages/
│   ├── ReportPage.tsx        <ReportProvider initialBookmarkId>…
│   └── TutorialPage.tsx      <ReportProvider startBlank> + <TutorialOverlay/>
├── components/
│   ├── Report.tsx            composition: header, menu, drawer, bookmark bar, canvas
│   ├── Header.tsx            brand bar: ☰, page nav, Info toggle, Guides
│   ├── MainMenu.tsx          hamburger flyout; applies built-in bookmarks
│   ├── BookmarkBar.tsx       built-in + custom chips; save-current-view flow
│   ├── TopStrip.tsx          Set Lines / Set Bars measure slicers + brand + ☰
│   ├── ReportCanvas.tsx      title, annotation, notices, chart card, matrix card, empty states
│   ├── ComboChart.tsx        hand-rolled dual-axis SVG combo (columns + line); tooltip; CTR band
│   ├── GrainToggle.tsx       the Timeframe grain pill (Year/Quarter/Month/Week/Date)
│   ├── Dropdown.tsx          popover primitive: trigger + panel, closes on Esc/outside
│   ├── Slicer.tsx            MeasureSlicer (dropdown) + ListSlicer (vertical list) + shared body
│   ├── RightPanel.tsx        top-right column: Timeframe, Plot By, Email Sent Date, Mailing List
│   ├── MatrixSelectors.tsx   Set Drilldown Matrix Dimensions + Set Additional Matrix Measures
│   ├── MatrixTable.tsx       sortable matrix; Month→Send drilldown; total row; status flags
│   ├── GuidesDrawer.tsx      right drawer: topic guides + glossary tabs
│   └── guides.tsx            guide + glossary content (mirrors docs/)
├── state/
│   ├── ReportContext.tsx     selection state, bookmark application, save/delete, annotation
│   └── bookmarks.ts          BookmarkDef, built-ins, localStorage persistence
├── tutorial/
│   ├── steps.ts              the nine steps: target, copy, completion gate
│   └── TutorialOverlay.tsx   spotlight + coach card; gates Next on each step
└── data/
    ├── types.ts              CampaignSend, ListMonth, CampaignType, ListName
    ├── campaigns.ts          fictional sends from a seeded generator (consistent totals)
    ├── listHealth.ts         12 months × 3 lists of movement
    ├── measures.ts           measure / grain / plot-by / timeframe catalogs; palette; formatting
    └── series.ts             aggregation engine: Selection → ChartModel + MatrixModel
```

## Data flow

```
Selection (ReportContext)
   └─> buildChart(selection)  -> ChartModel (dual axis)  -> ComboChart
   └─> buildMatrix(selection) -> MatrixModel (rows+flags) -> MatrixTable
Bookmark click -> applyBookmark(id) -> replaces Selection (and annotation state)
Slicer change  -> mutates Selection -> activeBookmarkId = null

Every slicer (Set Bars, Set Lines, Plot By, Timeframe, Email Sent Date, Mailing List)
writes to the one Selection, so the chart and the matrix always agree.
```

## Conventions

- Series colors come from the fixed categorical palette in `measures.ts`; each measure
  and legend value owns a stable slot — colors never depend on what else is selected.
- Status colors (matrix flags) are a separate reserved set and always ship icon + label.
- All text on charts uses ink/muted tokens, never series colors.
- `data-tour="…"` attributes mark the controls the tutorial spotlights.

## Accessibility

- Landmarks: the brand title is the page `h1`; the canvas is the `main` landmark, the
  right-hand control panel a labeled `aside`, the page navigation a labeled `nav`. Heading
  levels never skip (h1 → h2 → h3).
- Every chart SVG carries `role="img"` and a label naming the pane, its series and the
  number of points. **The matrix below the chart is the accessible data alternative** —
  it always renders from the same selection, so every plotted value is available as text.
- The tutorial's spotlight is purely visual (`aria-hidden`, no pointer capture): it never
  hides page content from assistive technology or traps focus. Step changes are announced
  through a polite live region in the coach card.
- The menu and the guides drawer move focus in on open, close on Escape, and return focus
  to the control that opened them.
- Matrix column headers expose sort state through `aria-sort`; flags pair an icon with a
  text label, never color alone.
