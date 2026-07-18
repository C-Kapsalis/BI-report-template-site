# The one-canvas email report

**A reporting template for marketers who have the tools but not the analyst.**

You have Power BI, or Looker, or your email platform's dashboard — and nobody whose job it
is to make them speak your language. So reporting becomes a monthly ritual of screenshots
and a spreadsheet you rebuild by hand, and the dashboards themselves feel like they were
built for someone else.

This demo shows the pattern that fixes that, borrowed from how good BI teams actually
build reports: **one canvas, three selectors, and bookmarks**. One chart and one matrix.
Three controls that decide what they show — what a point means (*plot axis*), how it
splits (*legend*), and which numbers appear (*measures*). And bookmarks, each one a saved
pre-selection of those controls that answers one question you ask every month, applied
with a single click. That's the whole trick — and this site lets you feel it working in
about two minutes.

## What you'll see

**The report** (`/`) opens on a working email report with a hamburger menu, a selector
panel, and four built-in bookmarks. Each answers one recurring question:

| Bookmark | The question it answers |
|---|---|
| **Email Overview** | How did the program do this month — volumes, rates, and revenue? |
| **Campaign Funnel** | Where does each send leak — sent, delivered, opened, or clicked? |
| **The Click: CTR vs CTOR** | Which sends earned the open but lost the click? |
| **List Health** | Is the audience underneath all these sends growing or quietly shrinking? |

Click between them and watch the chart and matrix redraw — no page ever changes, only the
selection. Every bookmark has a 📖 guide (also under the **Guides** button) explaining the
marketing thinking behind that view, plus a glossary tab so no metric goes undefined.

**The tutorial** (`/tutorial`) is the same report started **blank** — no axis, no legend,
no measures, an empty canvas. That's deliberate: the fastest way to understand that
everything on screen comes from the selectors is to start with none and build a view
yourself. Seven coached steps walk you through picking dimensions and measures, saving
your view as a bookmark, jumping to a built-in one, and coming back to yours — ending on
the one idea the whole template rests on: *a bookmark is just a saved pre-selection that
answers one recurring question.*

## The data

The demo ships with twelve months of fictional data for an unnamed, imaginary
specialty tea and homeware shop — twenty campaign sends plus monthly membership
movement for three mailing lists. A few stories are seeded on purpose, so the bookmarks
have something to find: a December flash sale that opened brilliantly and clicked at 1%
(a body problem), a February newsletter nobody opened (a subject problem), a winback send
to a dormant list that mostly harvested bounces, and a legacy list segment that erodes
every single month while the campaign rates stay green. Go hunting.

## Run it locally

```bash
npm install
npm run dev        # dev server
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

Requires Node 18+. No backend, no database, no accounts — the data is a TypeScript module.

## Deploy to Vercel

It's a static single-page app, ready out of the box: import the repo in Vercel, accept
the Vite defaults, deploy. The repo's `vercel.json` provides the SPA fallback so
`/tutorial` loads on a direct visit. Full steps (including the no-repo CLI route and
other static hosts) are in [How to deploy to Vercel](docs/how-to/deploy-to-vercel.md).

## Recreate it in Power BI

This site is a faithful web replica of a pattern built natively in Power BI: three field
parameters driving one canvas, bookmarks capturing slicer state, and a hamburger menu made
with the selection pane's show/hide trick. If you'd rather have the real thing inside your
own tenant, the tutorial
[Recreate this template in Power BI Desktop](docs/tutorials/recreate-in-power-bi.md)
builds the same interaction model there, step by step — about an hour the first time.

## The docs

The [docs/](docs/README.md) folder follows the [Diátaxis](https://diataxis.fr/) framework
— four sections split by what you're trying to do, with explanation suggested first:

- **Explanation** — [the one-canvas philosophy](docs/explanation/one-canvas-philosophy.md),
  plus one piece per bookmark (the same four guides that ship inside the app).
- **Tutorials** — [using the demo](docs/tutorials/using-the-demo.md) and
  [recreate this in Power BI](docs/tutorials/recreate-in-power-bi.md).
- **How-to guides** — including [how to read your email report](docs/how-to/read-your-email-report.md),
  written to **branch on what your data actually shows** rather than as one linear checklist.
- **Reference** — including a [governed glossary](docs/reference/glossary.md): one
  canonical definition per metric, each benchmark stated with its unit of judgment.
  The app enforces the interesting ones — try selecting CTR % on a Month axis and the
  report will politely object, because a per-send benchmark means nothing on an aggregate.

## Use your own data

All the demo data lives in two files with a small documented schema, authored as inputs
(sends, bounces, rates) so the funnel arithmetic always stays consistent.
[How to swap in your own data](docs/how-to/swap-in-your-own-data.md) walks through
replacing it with exports from your own sending tool.

## Release notes

What shipped in each version, with known limitations: [release notes](RELEASE-NOTES.md).

## License

MIT — see [LICENSE](LICENSE). All campaign names, subject lines and figures in the demo
data are fictional; the demo names no business.
