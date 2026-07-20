# Tutorial: using the demo

*Learn the slicer → bookmark workflow by doing it. The in-app version of this tutorial
lives at `/tutorial` and coaches you control by control — this page is the same
walkthrough in prose, for reading ahead or catching up.*

**You will need:** the demo running (`npm run dev`, or the deployed site). No data
knowledge assumed.

**You will learn:** how one canvas plus a few slicers replaces a stack of report pages,
and how to save a view of your own as a bookmark.

## 1. Start blank

Open `/tutorial`. Nothing is selected, so the canvas politely says so. That blankness is
the point: everything you're about to see is *produced* by selections, not hard-coded.

## 2. Set Bars — the columns

The chart is a combo: clustered columns on the left axis, a line on the right. Start with
the columns. Open the **Set Bars** slicer at the top left — it opens with a search box and
a list — and pick **Emails Sent #**, the volume you send each month.

## 3. Set Lines — the line

Now the line, drawn on its own right-hand axis so a different scale reads cleanly against
the columns. Open **Set Lines** and pick **Emails Delivered #** — what actually reached an
inbox. The chart now shows reach against delivery, month by month.

## 4. Plot By and the Timeframe

**Plot By**, in the right-hand panel, decides what one point on the chart means: Email Sent
Month for the program view, or Individual Send, Mailing List, or Campaign Type to slice it
differently. When you plot by month, the **Timeframe** toggle at the top-right — Year,
Quarter, Month, Week, Date — sets how time is bucketed. Try switching Plot By, then set it
back to Email Sent Month.

## 5. Filter with the slicers

Below Plot By are two more slicers — **Email Sent Date** and **Mailing List**. They behave
like real Power BI slicers: tick and untick values and the *whole page* refilters — chart
and matrix together. Untick a mailing list and watch both redraw; tick Select all to clear
the filter again. (These two dimensions come straight off the data: a send's date and its
list.)

## 6. The matrix follows along

Below the chart is the matrix: every month of email, with sent, delivered, delivery rate,
bounces, bounce rate and complaints. Click the **+** on any month to drill into its
individual sends, and use **Set Additional Matrix Measures** to add columns like Open Rate %
or CTR %. The Total row always recomputes from the parts — and respects your slicers.

## 7. Save it as a bookmark

The view you just built answers a question you'll ask again next month. In the bookmark
bar, click **+ Save current view**, name it something that states the question ("Reach vs
delivery"), and save. Your bookmark appears as a dashed chip. It's stored in your browser
(localStorage) — no account needed.

## 8. Click a built-in bookmark

Now click a built-in view — **Engagement** is a good one. Watch every slicer snap to that
view's saved selection: Set Bars, Set Lines, Plot By, the filters and the matrix all
redraw. Nothing navigated — the canvas changed its mind.

## 9. Come back to yours

Click your saved bookmark. Your bars, your line, your Plot By and your filters return
exactly as you left them.

## The lesson

**A bookmark is just a saved pre-selection of the slicers that answers one recurring
marketing question.** That's the whole trick: one canvas + slicers + bookmarks replaces a
stack of static pages, and every view stays consistent because they all draw from the same
slicers and the same data.

**Next:** open the four built-in bookmarks on the Report page and read each one's guide
(the 📖 icons). Then, when you're ready:
[swap in your own data](../how-to/swap-in-your-own-data.md) or
[rebuild the template in Power BI](recreate-in-power-bi.md).
