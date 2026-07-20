# Release notes

## v0.2.0, interactive slicers

*2026-07-20*

The report now behaves like a real Power BI report: every control is a slicer, and every
slicer filters the whole page, chart and matrix together.

### Highlights

- **Power BI–style slicers.** Set Lines and Set Bars are dropdown slicers (search +
  single-select); Plot By is a searchable list slicer. They replace the old plain
  dropdowns.
- **Timeframe up top.** The time-grain toggle (Year / Quarter / Month / Week / Date) now
  sits at the top-right of the plot as the first control.
- **Two live dimension filters.** *Email Sent Date* and *Mailing List* are vertical-list
  slicers, untick a value and both the chart and the matrix refilter, exactly like a
  Power BI slicer. Both come straight off the data model (`sentDate`, `list`).
- **Bookmarks renamed and clarified.** The four built-ins are now *Email Overview*,
  *Monthly Report*, *Engagement*, and *List Health*; every slicer state (including the two
  filters) is saved with the bookmark.
- **Documentation refresh.** The full Diátaxis set, tutorial, how-to, reference, and the
  in-app guides, was brought in line with the current report, and each guide re-paired to
  the bookmark it now describes.

## v0.1.0, first public demo

*2026-07-18*

The first release of the one-canvas email report: a working demo of the
one-canvas + selectors + bookmarks reporting pattern, with fictional data,
an interactive tutorial, and a full documentation set.

### Highlights

- **Live demo**, try it in the browser, no install:
  [bi-report-template-site.vercel.app](https://bi-report-template-site.vercel.app/).
- **Four built-in bookmarks**, each answering one recurring question:
  *Email Overview* (the monthly report), *Campaign Funnel* (where each send
  leaks), *The Click: CTR vs CTOR* (which sends earned the open but lost the
  click), and *List Health* (whether the audience underneath is growing or
  eroding). Apply one and the chart and matrix redraw, no page changes.
- **A blank-start tutorial** at `/tutorial`: the same report with nothing
  selected, plus seven coached steps that walk you through building a view,
  saving it as a bookmark, and switching between views.
- **A governed glossary**: one canonical definition per metric, each benchmark
  stated with its unit of judgment. The app enforces the interesting ones -
  ask for CTR % on a Month axis and the report explains why that combination
  misleads, and what to read instead.
- **Save your own views**: any selection can be saved as a named bookmark,
  persisted in your browser. No account, no backend.
- **Guides in the app**: each bookmark pairs with a short guide on the
  marketing thinking behind it, available from the Guides drawer and the
  📖 buttons.

### Known limitations

- Custom bookmarks live in `localStorage`; they are per-browser and do not
  sync across devices.
- The chart tooltip is hover-only; keyboard and screen-reader users get the
  same numbers from the matrix table below the chart.
- Only the Email channel is stocked. The other channels in the menu show the
  template's intended layout but hold no views yet.
- The demo ships with one fictional dataset; swapping in your own data means
  editing two TypeScript modules (see the "swap in your own data" how-to
  guide in the documentation).

### Run or deploy it

- Local: `npm install`, then `npm run dev` (Node 18 or later).
- Hosting: see the "deploy to Vercel" how-to guide in the documentation;
  any static host with an SPA fallback works.
