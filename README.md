# The one-canvas email report

**A reporting template for marketers who have the tools but not the analyst.**

**Live demo: [try the one-canvas email report](https://bi-report-template-site.vercel.app/)**

You have Power BI, or Looker, or your email platform's dashboard, and nobody whose job it
is to make them speak your language. So reporting becomes a monthly ritual of screenshots
and a spreadsheet you rebuild by hand, and the dashboards themselves feel like they were
built for someone else.

This demo shows the pattern that fixes that, borrowed from how good BI teams actually
build reports: **one canvas, three selectors, and bookmarks**. One chart and one matrix.
Three controls that decide what they show, what a point means (*plot axis*), how it
splits (*legend*), and which numbers appear (*measures*). And bookmarks, each one a saved
pre-selection of those controls that answers one question asked every month, applied
with a single click. That is the whole trick, and this site lets a reader feel it working
in about two minutes.

## What you will see

**The report** (`/`) opens on a working email report with a hamburger menu, slicer
controls, and four built-in bookmarks. Each answers one recurring question:

| Bookmark | The question it answers |
|---|---|
| **Email Overview** | Are we reaching the inbox, emails sent vs delivered, month by month? |
| **Monthly Report** | How did the month do end to end, delivered, engagement, and revenue? |
| **Engagement** | Which sends earned the open but lost the click? |
| **List Health** | Is the audience underneath all these sends growing or quietly shrinking? |

Click between them and watch the chart and matrix redraw, no page ever changes, only the
selection. Every bookmark has a 📖 guide (also under the **Guides** button) explaining the
marketing thinking behind that view, plus a glossary tab so no metric goes undefined.

**The tutorial** (`/tutorial`) is the same report started **blank**, nothing selected,
an empty canvas. That is deliberate: the fastest way to understand that
everything on screen comes from the selectors is to start with none and build a view
from scratch. Nine coached steps walk a reader through picking dimensions and measures,
saving a view as a bookmark, jumping to a built-in one, and coming back to their own,
ending on the one idea the whole template rests on: *a bookmark is just a saved
pre-selection that answers one recurring question.* A written, prose version of the same
walkthrough, for anyone who cannot or would rather not use the interactive one, is part
of the full documentation linked below.

## The data

The demo ships with twelve months of fictional data for an unnamed, imaginary
specialty tea and homeware shop, twenty campaign sends plus monthly membership
movement for three mailing lists. A few stories are seeded on purpose, so the bookmarks
have something to find: a December flash sale that opened brilliantly and clicked at 1%
(a body problem), a February newsletter nobody opened (a subject problem), a winback send
to a dormant list that mostly harvested bounces, and a legacy list segment that erodes
every single month while the campaign rates stay green. Go hunting.

## For developers adapting this template

Nothing below this line is needed just to explore the demo; the two live links above are
the whole product for that reader. This section is for someone forking the project to
rebrand it, point it at real data, or host their own copy.

```bash
npm install
npm run dev        # dev server
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

Requires Node 18 or later. No backend, no database, no accounts; the data is a
TypeScript module. It is a static single-page app, ready to deploy out of the box:
import the repo in Vercel, accept the Vite defaults, deploy. The repo's `vercel.json`
provides the SPA fallback so `/tutorial` loads on a direct visit.

## Recreate it in Power BI

This site is a faithful web replica of a pattern built natively in Power BI: three field
parameters driving one canvas, bookmarks capturing slicer state, and a hamburger menu made
with the selection pane's show and hide trick. For a reader who would rather have the
real thing inside their own tenant, a tutorial in the full documentation builds the same
interaction model there, step by step, about an hour the first time.

## Documentation

This is not just a demo; it is a documentation paradigm applied to a domain, Power BI
reporting, where documentation for the end reader is rare. The full documentation,
organized with the [Diátaxis](https://diataxis.fr/) framework (a tutorial in both
interactive and written form, how-to guides that branch on what a reader's own data
shows, a governed glossary that is the single source of truth for every metric
definition, and an explanation piece per built-in view), is published at
`BI-report-template-site-documentation` on Read the Docs.

## Use your own data

All the demo data lives in two files, `src/data/campaigns.ts` and
`src/data/listHealth.ts`, with the schema documented in `src/data/types.ts`. Data is
authored as inputs (sends, bounces, rates) so the funnel arithmetic always stays
consistent.

## Part of a small family of Power BI tools

This project is not a tool; it evangelizes and teaches the reporting pattern that a few
related, independently installable tools then help build and maintain for real.

- [`pbip-model-forge`](https://github.com/C-Kapsalis/pbip-model-forge): builds a sample
  Power BI model from a plain-language description.
- [`tmdl-preflight`](https://github.com/C-Kapsalis/tmdl-preflight): a linter and
  auto-fixer for a single TMDL-format model.
- [`tmdl-drift-doctor`](https://github.com/C-Kapsalis/tmdl-drift-doctor): keeps many
  derived models in sync with one shared template.
- [`pbi-plot-styler`](https://github.com/C-Kapsalis/pbi-plot-styler): keeps a report
  built on this pattern presentation-ready as measures are added.

## Contributing

Design changes need a stated source: see [CONTRIBUTING.md](CONTRIBUTING.md).

## Release notes

What shipped in each version, with known limitations: [release notes](RELEASE-NOTES.md).

## License

MIT, see [LICENSE](LICENSE). All campaign names, subject lines, and figures in the demo
data are fictional; the demo names no business.
