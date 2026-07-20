# Documentation

This documentation set is written for **one primary reader: a marketer who runs email for
a small brand and has no data team**. Every page states what you'll get from it in its
first lines; jargon is defined once, in the glossary, and reused consistently everywhere
else. A secondary reader — the person adapting this template to their own data or
rebuilding it in Power BI — is served by the how-to and reference sections.

## How this set is organized

The docs follow the [Diátaxis](https://diataxis.fr/) framework: four sections, split by
what the reader is trying to do, because a person mid-task and a person trying to
understand need different documents.

**Suggested reading order for a first visit:** one explanation piece for the "why"
([the one-canvas philosophy](explanation/one-canvas-philosophy.md)) → the
[tutorial](tutorials/using-the-demo.md) to learn by doing → how-tos when you have a job
to finish → reference when you need to look something up.

### Tutorials — *learning by doing*

- [Using the demo](tutorials/using-the-demo.md) — the guided walkthrough, mirrored by the
  in-app `/tutorial` page.
- [Recreate this template in Power BI Desktop](tutorials/recreate-in-power-bi.md) — build
  the same interaction model with field parameters, bookmarks and the selection pane.

### How-to guides — *getting a job done*

Written to branch on **what your data actually shows**, not as one linear checklist:

- [Read your email report](how-to/read-your-email-report.md) — the reading order, with a
  branch per finding.
- [Swap in your own data](how-to/swap-in-your-own-data.md)
- [Deploy to Vercel](how-to/deploy-to-vercel.md)

### Reference — *looking things up*

- [Glossary](reference/glossary.md) — **the single source of truth for every metric
  definition** in this project. The in-app glossary and selector hints restate it; if a
  definition ever needs to change, it changes here first.
- [Data model](reference/data-model.md) — the two-table schema.
- [Bookmark shape](reference/bookmark-shape.md) — what a bookmark is, precisely.
- [Routes and components](reference/routes-and-components.md) — the code map.

### Explanation — *understanding*

One piece on the template pattern itself, then one per built-in bookmark (the same four
guides that ship inside the app):

- [The one-canvas philosophy](explanation/one-canvas-philosophy.md)
- [Deliverability & send quality](explanation/deliverability-and-send-quality.md) — pairs with **Email Overview**
- [The click: CTR vs CTOR](explanation/ctr-vs-ctor.md) — pairs with **Engagement**
- [List health & erosion](explanation/list-health-and-erosion.md) — pairs with **List Health**
- [Campaigns over time & revenue](explanation/campaigns-and-revenue.md) — pairs with **Monthly Report**

## Conventions

- Benchmarks are always given with their unit of judgment (per send vs aggregate) —
  the template itself enforces the distinction (try selecting CTR % on a Month axis).
- All example figures come from the demo's fictional dataset.
