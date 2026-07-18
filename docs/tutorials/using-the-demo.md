# Tutorial: using the demo

*Learn the selector → bookmark workflow by doing it. The in-app version of this tutorial
lives at `/tutorial` and coaches you control by control — this page is the same
walkthrough in prose, for reading ahead or catching up.*

**You will need:** the demo running (`npm run dev`, or the deployed site). No data
knowledge assumed.

**You will learn:** how one canvas plus three selectors replaces a stack of report pages,
and how to save a view of your own as a bookmark.

## 1. Start blank

Open `/tutorial`. Nothing is selected, so the canvas politely says so. That blankness is
the point: everything you're about to see is *produced* by selections, not hard-coded.

## 2. Pick your plot axis

In the selector panel, under **Plot axis (x1)**, choose **Month**. The axis decides what
one point on the chart means. For email reporting you almost always start with time —
Month for the program view, Individual send when you want one point per campaign.

## 3. Pick a legend

Under **Legend (x2)**, choose **Mailing list**. The legend splits each point into series —
the same chart, sliced by a dimension. (Campaign type works too: newsletters vs
promotions.)

## 4. Pick your measures

Under **Measures (y)**, tick **Emails Delivered** and **Open Rate %**. Volumes draw as
columns, rates as lines — each unit gets its own pane and its own scale. Add **CTR %** if
you're curious: the report will warn you that CTR is a per-send verdict and point you to
CTOR. That guardrail is deliberate — see
[the click guide](../explanation/ctr-vs-ctor.md).

## 5. Save it as a bookmark

The view you just built answers a question you'll ask again next month. In the bookmark
bar, click **+ Save current view**, name it something that states the question ("List by
month"), and save. Your bookmark appears as a dashed chip. It's stored in your browser
(localStorage) — no account needed.

## 6. Click a built-in bookmark

Now click **Campaign Funnel**. Watch all three selectors snap to that bookmark's saved
selection: axis flips to Individual send, measures become the four funnel counts, and the
chart and matrix redraw. Nothing navigated — the canvas changed its mind.

## 7. Come back to yours

Click your saved bookmark. Your axis, legend and measures return exactly as you left them.

## The lesson

**A bookmark is just a saved pre-selection of dimensions and measures that answers one
recurring marketing question.** That's the whole trick: one canvas + selectors + bookmarks
replaces a stack of static pages, and every view stays consistent because they all draw
from the same selectors and the same data.

**Next:** open the four built-in bookmarks on the Report page and read each one's guide
(the 📖 icons). Then, when you're ready:
[swap in your own data](../how-to/swap-in-your-own-data.md) or
[rebuild the template in Power BI](recreate-in-power-bi.md).
