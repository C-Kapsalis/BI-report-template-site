# Glossary

**This page is the single source of truth for every metric definition in the project.**
The in-app glossary (Guides → Glossary) and the selector hints restate these definitions;
if a definition changes, it changes here first and everything else follows.

Benchmarks are stated with their **unit of judgment** — a per-send benchmark must never be
applied to an aggregate, and the app enforces the distinction.

## Send funnel

| Term | Definition | Benchmark / note |
|---|---|---|
| **Sent** | Emails handed to the sending server for a campaign. | Steady cadence; sudden volume spikes hurt sender reputation. |
| **Delivered** | Sent − bounces: emails that reached an inbox. | — |
| **Delivery Rate %** | Delivered ÷ sent. | **≥ 95%** (98% strong). The deliverability gate: below it, nothing downstream counts. |
| **Bounce** | A send rejected by the receiving server. Hard bounce = bad address; soft = temporary. | Hard bounces near zero on a clean list; bounce rate < 2%. |
| **Open** | A recipient rendered the email. | **Directional only** — privacy proxies pre-load images and inflate opens. Trend, not level. |
| **Open Rate %** | Opens ÷ delivered. | No absolute target; watch the trend. |
| **Click** | A recipient clicked a link in the email. | The strongest engagement signal a send produces. |
| **CTR %** | Clicks ÷ delivered. | **2–5% per send.** A per-send verdict — meaningless on aggregated time axes, where sends and clicks blur across days. |
| **CTOR %** | Clicks ÷ opens: of those who saw the content, how many acted. | **~10%** average, 14–17% strong. The click metric for aggregates and trends. |
| **Unsubscribe** | A recipient opted out from this send. | — |
| **Unsubscribe Rate %** | Unsubscribes ÷ delivered, per send. | Keep under **0.5%** per send (0.2% typical). |
| **Spam Complaint** | A recipient marked the send as spam. | **0.1%** of delivered = warning; **0.3% = critical** (throttling/blocking). Vendor-limited: a blank means *not reported*, never zero. |
| **Revenue** | Revenue attributed to the send (last-click convention in this demo). | Lumpy by nature — read it per send in the matrix. |

## List health

| Term | Definition | Benchmark / note |
|---|---|---|
| **List Active Members** | Addresses currently subscribed and mailable, at the end of the period. | Point-in-time: aggregating a window takes the **last** month's value, never a sum. |
| **List Subscribes** | New members added in the period. | — |
| **List Unsubscribes** | Members who opted out in the period. | — |
| **List Cleaned** | Addresses removed by hygiene: hard bounces, spam traps, inactive purges. | — |
| **List Net Change** | Subscribes − unsubscribes − cleaned, per period. | Healthy lists grow **2–5%/month**. Sustained negative = future revenue cliff. |

## Template concepts

| Term | Definition |
|---|---|
| **Plot axis (x1)** | The selector deciding what one point on the chart means (Month, Quarter, Individual send). |
| **Legend (x2)** | The selector deciding how each point splits into series (None, Campaign type, Mailing list). |
| **Measures (y)** | The multi-select of numbers shown on the canvas. |
| **Field parameter** | A selector that swaps which field a visual uses — the mechanism behind all three selectors. |
| **Bookmark** | A saved pre-selection of the selectors (axis, legend, measures, timeframe) that answers one recurring question. Not a copy of the data — just the selection. |
| **Pane** | One vertical section of the combo chart, holding all selected measures of one unit (volume / rates / revenue). One scale per pane; never a dual axis. |
