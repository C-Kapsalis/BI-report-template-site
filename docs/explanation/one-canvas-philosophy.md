# The one-canvas philosophy

*Why this template is one page with selectors and bookmarks, instead of many report pages.*

The traditional marketing report is a stack of static pages: one for the funnel, one for
trends, one for the list, one per channel. Every page is hand-built, every page drifts out
of date separately, and every new question means a new page. Teams end up with forty pages,
six of which anyone opens.

This template inverts that. There is exactly **one canvas** — a combo chart and a matrix —
and everything it shows is decided by three **field-parameter slicers**:

| Slicer | Role | Example values |
|---|---|---|
| **Set Bars** | The measure drawn as columns (left axis) | Emails Sent #, Delivered #, Opens # |
| **Set Lines** | The measure drawn as a line (right axis) | Delivered #, Open Rate %, CTOR %, Revenue |
| **Plot By** | What one point on the chart means | Email Sent Month, Individual Send, Mailing List, Campaign Type |

A "page" in the old model becomes a **bookmark** in this one: a saved pre-selection of the
slicers (plus the time grain and filters) that answers one recurring question. "Is
deliverability slipping?" is the Email Overview bookmark. "Is the list growing or
churning?" is List Health. Applying a bookmark doesn't navigate anywhere — the canvas
simply changes its mind.

## What this buys you

**Consistency by construction.** Every view draws from the same selectors, the same
aggregation rules, the same data. There is no way for the "funnel page" and the "trend
page" to disagree, because they are the same page.

**Questions stay cheap.** A new recurring question costs a bookmark — thirty seconds — not
a new report page. One-off questions cost nothing at all: set the selectors, read, move on.

**Guardrails live in one place.** Because all reading flows through one canvas, the canvas
can encode judgment. This template puts Set Bars on the left axis and Set Lines on the
right rather than forcing different units onto one scale, hides list measures when you plot
by Individual Send (a list isn't a send), and objects when you ask for CTR on a monthly
axis (CTR is a per-send verdict). Build a rule once and every view inherits it.

**Menus become navigation of *views*, not pages.** The hamburger menu holds the saved
views. In this demo only Email is stocked, but the pattern scales to a full marketing
report without adding a single page.

## The trade-offs, honestly

A single canvas can't do bespoke layouts — a cohort triangle or an annotated executive
summary still deserves its own page. And the pattern depends on **discipline in the
catalogs**: selectors are only trustworthy if each measure has one canonical definition
(this project keeps them in the [glossary](../reference/glossary.md)) and the aggregation
rules are right (rates recomputed from summed parts, never averaged).

The pattern comes from professional BI practice — in Power BI it's built with field
parameters, bookmarks and the selection pane, and
[you can rebuild it there yourself](../tutorials/recreate-in-power-bi.md). But the idea is
tool-agnostic: **separate the questions (bookmarks) from the machinery (one canvas), and
both get better.**
