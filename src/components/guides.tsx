import type { ReactNode } from "react";

/**
 * The four topic guides, one per built-in bookmark, plus the glossary.
 * The same guides live in the repo as docs/explanation/*.md; the glossary's
 * canonical home is docs/reference/glossary.md - definitions here restate
 * it, they never diverge from it.
 */

export interface GuideDef {
  id: string;
  title: string;
  bookmarkId: string | null;
  body: ReactNode;
}

export const GUIDES: GuideDef[] = [
  {
    id: "funnel",
    title: "Deliverability & send quality",
    bookmarkId: "campaign-funnel",
    body: (
      <>
        <p>
          Every send runs the same short sequence: <strong>sent → delivered → opened →
          clicked</strong>. Each step leaks for a different reason, and one headline number
          hides which step is failing. The <em>Campaign Funnel</em> bookmark plots the four
          counts side by side, one cluster per send, so the leak is visible at a glance.
        </p>
        <p>
          <strong>Deliverability is the gate.</strong> Before opens or clicks mean anything,
          the email has to reach an inbox. Delivered divided by sent should stay above{" "}
          <strong>95%</strong> — 98% is strong — with hard bounces near zero on a clean list.
          If delivery slips below the line, stop optimizing subject lines: you have an inbox
          problem, not a content problem. The usual causes are authentication gaps (SPF, DKIM
          and DMARC must pass — mailbox providers made this mandatory for bulk senders), a
          dirty or bought list, or a complaint rate that tripped a filter.
        </p>
        <p>
          <strong>The early warning is a bounce rate that climbs while volume holds
          steady.</strong> That is list hygiene lapsing in slow motion. In this demo the
          December winback send to the dormant legacy list shows exactly this signature:
          delivery around 91%, a bounce spike, and a complaint rate at alarm level. The
          matrix flags it — and the right response is to clean or retire the segment, not to
          resend harder.
        </p>
        <p>
          <strong>Complaints are non-negotiable.</strong> A spam complaint rate of 0.1% is a
          warning; <strong>0.3% is critical</strong> and will get a sending domain throttled
          or blocked. Complaints mean a relevance or consent problem — cut frequency and
          tighten segmentation rather than pushing more volume through a cracking reputation.
        </p>
        <p>
          <strong>What the bookmark reveals:</strong> scan the gap between the first two
          columns of each cluster (sent vs delivered). Healthy sends show almost none.
          Then compare the shape of the funnel across sends — a send whose opens column
          collapses had a subject problem; one whose clicks column collapses despite healthy
          opens had a content problem. Those two failure modes are the subject of the next
          guide.
        </p>
      </>
    ),
  },
  {
    id: "click",
    title: "The click: CTR vs CTOR",
    bookmarkId: "the-click",
    body: (
      <>
        <p>
          The mistake most teams make is judging campaigns on opens. An open is the
          shallowest signal there is — it only says a message surfaced, and privacy proxies
          that pre-load images inflate it badly. Treat open rate as{" "}
          <strong>directional only</strong>: watch its trend, never its absolute level.{" "}
          <strong>The click is the signal that matters</strong> — it proves the content
          matched what the reader wanted and moved them one step toward revenue.
        </p>
        <p>There are two click rates, and they answer different questions:</p>
        <p>
          <strong>CTR</strong> (clicks ÷ delivered) asks: <em>of everyone who received this
          send, how many acted?</em> It is a <strong>per-send</strong> verdict, judged against
          the <strong>2–5% band</strong> drawn on the chart. The band is a per-send number —
          on a monthly aggregate, sends and their clicks blur across days, and the ratio
          stops meaning anything. That is why this template shows the band only on the
          Individual send axis, and why the report politely objects if you ask for CTR on a
          monthly one.
        </p>
        <p>
          <strong>CTOR</strong> (clicks ÷ opens) asks: <em>of those who saw the content, how
          many acted?</em> Around <strong>10%</strong> is average and 14–17% is strong. CTOR
          is the metric to use on aggregates and trends, because it survives the blurring
          that breaks CTR.
        </p>
        <p>
          Read the two together and each weak send diagnoses itself. In this demo, the
          December flash sale opened at 48% but clicked at ~1% — a{" "}
          <strong>copy/CTA problem</strong>: the subject earned the open and the body
          squandered it. The February newsletter opened at 18% with a normal CTOR — a{" "}
          <strong>subject-line problem</strong>: the content was fine, but nobody arrived to
          see it. Same low CTR, opposite fixes.
        </p>
        <p>
          <strong>What the bookmark reveals:</strong> find sends below the band, then check
          their open rate. High opens + low CTR → rewrite the body and the call to action.
          Low opens → rewrite the subject. Never fix both at once, or you won't know which
          change worked.
        </p>
      </>
    ),
  },
  {
    id: "list-health",
    title: "List health & erosion",
    bookmarkId: "list-health",
    body: (
      <>
        <p>
          Beneath every send sits the list it draws on, and here is the uncomfortable truth:{" "}
          <strong>open and click rates only measure whoever is left</strong>. They can look
          healthy — even improve — while the audience you can sell to shrinks every month.
          Campaign metrics will never flag a dying list. Only the list view does, which is
          why this bookmark exists.
        </p>
        <p>
          A mailing list is a <strong>compounding asset</strong>. It was bought once, through
          acquisition spend or content, and it pays on every send afterwards — or it decays.
          Track <strong>net change</strong>: new subscribes minus unsubscribes minus cleaned
          addresses. Growing month over month is healthy (a 2–5% monthly growth rate is a
          good band); flat means acquisition only offsets attrition; sustained negative net
          change is a future revenue cliff, visible long before revenue feels it.
        </p>
        <p>
          <strong>Watch growth quality, not just growth.</strong> A list growing faster than
          your acquisition explains is a warning sign — bought or scraped contacts predict
          bounces, complaints, and deliverability damage. Too big too fast is garbage.
        </p>
        <p>
          <strong>Localize churn before acting on it.</strong> Unsubscribes spiking on one
          send point at that send's content. Elevated churn across all sends points at
          cadence — you are mailing too often. Churn concentrated in one segment points at
          sourcing — that audience never wanted this mail.
        </p>
        <p>
          <strong>What the bookmark reveals:</strong> the legend splits net change by mailing
          list. In this demo the main list adds members every month and the VIP list holds
          steady — but the legacy blog-signup segment loses members in all twelve, with a
          December cleaning spike where a winback send mostly harvested bounces. The
          annotation panel calls it out. A segment like that flatters no metric: retire it,
          or win it back deliberately — and check the matrix for each list's totals over the
          period.
        </p>
      </>
    ),
  },
  {
    id: "revenue",
    title: "Campaigns over time & revenue",
    bookmarkId: "email-overview",
    body: (
      <>
        <p>
          The <em>Email Overview</em> bookmark is the monthly report: volumes, rates and
          revenue on one canvas, month by month, with every send itemized in the matrix
          below. It is the view to open first — and the view to end on, because email's case
          to the business is made in currency, not clicks.
        </p>
        <p>
          <strong>Email earns its keep quietly.</strong> The list is an audience you already
          own and can reach again for nothing, which is why email's return per dollar
          outruns paid channels. But that return arrives unevenly: in this demo, two gifting
          promotions and a summer sale carry most of the year's email revenue, while
          newsletters earn modestly and steadily. Both matter — the newsletter keeps the
          audience warm so the promotion can harvest.
        </p>
        <p>
          <strong>Read the months as cadence, not as verdicts.</strong> Send volume should
          rise and fall with the calendar (gifting season, sales), never spike without
          reason — sudden volume surges hurt sender reputation. A month's rates judge the
          program; a send's rates judge the send. Keep the two straight: monthly CTOR for
          the trend, per-send CTR against the band for the individual verdict (see{" "}
          <em>The click</em> guide).
        </p>
        <p>
          <strong>Revenue per send belongs in the matrix, not the chart.</strong> Campaign
          revenue is lumpy, so the honest read is the itemized table: which specific sends
          paid, and what they had in common. In this demo the pattern is clear — early
          access for VIPs and deadline-driven promotions ("order by Thursday") outearn
          discount-led blasts. That is a strategy insight, and it comes from sorting one
          matrix column.
        </p>
        <p>
          <strong>What the bookmark reveals:</strong> scan the volume pane for cadence, the
          rates pane for drift, then sort the matrix by Revenue. Ask of the top three sends:
          what did they promise, to whom, and when? Then ask the same of the bottom three.
          The difference is next quarter's plan.
        </p>
      </>
    ),
  },
];

export interface GlossaryEntry {
  term: string;
  definition: string;
}

/** Restates docs/reference/glossary.md - the canonical definitions. */
export const GLOSSARY: GlossaryEntry[] = [
  { term: "Sent", definition: "Emails handed to the sending server for a campaign." },
  { term: "Delivered", definition: "Sent minus bounces - emails that reached an inbox. Delivery rate = delivered / sent; the deliverability gate is 95%." },
  { term: "Bounce", definition: "A send rejected by the receiving server. Hard bounces (bad address) should be near zero on a clean list." },
  { term: "Open", definition: "A recipient rendered the email. Directional only: privacy proxies pre-load images and inflate opens." },
  { term: "Open Rate", definition: "Opens / delivered. Watch the trend, never the absolute level." },
  { term: "Click", definition: "A recipient clicked a link in the email. The strongest engagement signal a send produces." },
  { term: "CTR", definition: "Clicks / delivered. A per-send verdict, judged against the 2-5% band on the send axis - not meaningful on aggregated time axes." },
  { term: "CTOR", definition: "Clicks / opens - of those who saw the content, how many acted. ~10% average. The click metric for aggregates and trends." },
  { term: "Unsubscribe Rate", definition: "Unsubscribes / delivered for a send. Keep under ~0.5% per send." },
  { term: "Spam Complaint", definition: "A recipient marked the send as spam. 0.1% of delivered is a warning; 0.3% is critical for sender reputation." },
  { term: "List Active Members", definition: "Addresses currently subscribed and mailable, at the end of the period." },
  { term: "List Cleaned", definition: "Addresses removed by hygiene: hard bounces, spam traps, inactive purges." },
  { term: "List Net Change", definition: "Subscribes - unsubscribes - cleaned, per period. The list's true trajectory; healthy lists grow 2-5% per month." },
  { term: "Field parameter", definition: "A selector that swaps which field a visual uses - the mechanism behind this template's Plot axis, Legend and Measures panels." },
  { term: "Bookmark", definition: "A saved pre-selection of the selectors (axis, legend, measures, filters) that answers one recurring question. Not a copy of the data - just the selection." },
];
