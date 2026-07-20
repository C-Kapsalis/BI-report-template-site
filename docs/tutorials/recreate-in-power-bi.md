# Tutorial: recreate this template in Power BI Desktop

*This demo is a web replica of a report pattern built natively in Power BI. This tutorial
builds the same interaction model there: one canvas, field-parameter selectors, bookmarks,
and a hamburger menu. Allow about an hour the first time.*

**You will need:** Power BI Desktop (free), a table of campaign sends, and a date table.
Field parameters are created via *Modeling → New parameter → Fields*.

## 1. Model the data

Import two tables mirroring the demo's [data model](../reference/data-model.md):

- **Campaigns** — one row per send: name, subject, sent date, type, list, sent, delivered,
  bounces, opens, clicks, unsubscribes, complaints, revenue.
- **Calendar** — a standard date table, related to `Campaigns[Sent Date]`.

Create explicit measures for every number you'll report — including the rates, computed
from sums (`DIVIDE(SUM(clicks), SUM(delivered))`), never averaged. One measure, one
definition, defined once — the Power BI equivalent of this project's
[glossary rule](../reference/glossary.md).

## 2. Create the three field parameters

The selector model is three field parameters. Name them so they sort together in the
field list — a common convention is an `x`/`y` prefix:

1. **`x-Plot Specific 1`** — *the plot axis*: the date fields (Month, Quarter, Date) plus
   any other dimension you want on the x axis.
2. **`x-Plot Specific 2`** — *the legend*: Campaign Type, Mailing List — the dimensions a
   chart can split by. Include a blank entry (a placeholder measure) so "no legend" is a
   selectable state.
3. **`y-Plot Specific`** — *the measures*: every reporting measure, with a display name
   and sort order per entry. The parameter's generated table has three columns — display
   name, field reference, order; add your own grouping column (for example "funnel",
   "rates", "list") so the slicer can group entries.

## 3. Build the single canvas

One report page:

- A **line and clustered column chart**: x-axis ← `x-Plot Specific 1`, legend ←
  `x-Plot Specific 2`, values ← `y-Plot Specific`. (Power BI will happily put counts and
  rates on two y-axes; if you'd rather avoid a dual axis — this web demo does — make two
  stacked visuals, one per unit family, sharing the x axis.)
- A **matrix**: rows ← campaign name, values ← the same `y-Plot Specific` parameter.
- Three **slicers**, one per field parameter (the measures slicer set to multi-select),
  plus a relative-date slicer.

Changing a slicer now redraws both visuals. That is the whole engine.

## 4. Add bookmarks

Set the slicers to a view worth returning to (say, delivered vs revenue by month), then
*View → Bookmarks → Add*. In the bookmark's options keep **Data** checked (it captures
slicer state) and give it a question-shaped name ("Monthly Report"). Repeat per recurring
question. Add a **Bookmark navigator** (*Insert → Buttons → Navigator*) for a clickable
bookmark bar.

## 5. Build the hamburger menu

The menu is the selection-pane show/hide trick:

1. Insert a rectangle panel plus a button list of your channels and views along the left
   edge; group them in the Selection pane.
2. Create a bookmark **"menu open"** with the group visible and **"menu closed"** with it
   hidden — in both, untick **Data** (these bookmarks control visibility only, never
   slicers).
3. Insert a **☰ button** whose action applies "menu open", and a ✕ inside the panel that
   applies "menu closed".
4. Each menu entry's action applies one of your data bookmarks — submenu entries can live
   in their own group with its own open/close pair.

## 6. Check it against the demo

Open the demo side by side and verify the behaviors match: selectors drive both visuals;
bookmarks snap all selectors at once; the menu opens, applies a view, closes. If a
bookmark unexpectedly changes filters you didn't intend, revisit which bookmarks capture
**Data** and which only capture **Display**.

**Next:** [swap your real exports into the web demo](../how-to/swap-in-your-own-data.md),
or read [why the pattern works](../explanation/one-canvas-philosophy.md).
