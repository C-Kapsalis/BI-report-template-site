# How to read your email report

*The reading order for the four built-in bookmarks, with a branch for each finding. Read
top to bottom; stop and act at the first branch that matches your data.*

## 1. Open **Email Overview** — check the gate first

Look at the gap between *sent* (columns) and *delivered* (line) each month, and the Flags
column in the matrix.

- **Delivery ≥ 95% everywhere** → the gate is open; go to step 2.
- **A send flagged "Delivery below 95%"** → stop optimizing content. Check authentication
  (SPF, DKIM, DMARC), then the list that send went to — a bounce spike on one segment
  means dirty addresses. Clean or retire the segment before the next send.
- **Bounces creeping up while volume is steady** (the demo's February spike) → hygiene is
  lapsing. Schedule a list cleaning now, before a mailbox provider does it for you. Use the
  **Email Sent Date** slicer to isolate the month and read it in the matrix.
- **Complaints flagged on any send** → treat as urgent: cut frequency to that audience and
  tighten segmentation. 0.1% of delivered is a warning, 0.3% gets domains blocked.

## 2. Open **Engagement** — judge content per send

Opens draw as columns, CTOR as the line, with open rate, CTR and CTOR already itemized in
the matrix. Drill a month into its sends (the **+**) and read each send's CTR against the
2–5% band, then check its open rate.

- **All material sends inside the band** → content is doing its job; go to step 3.
- **Low CTR + high opens** (the demo's May flash sale) → a body/CTA problem on that send.
  One benefit-framed call to action above the fold; make the content keep the subject's
  promise.
- **Low CTR + low opens** (the demo's March newsletter) → a subject-line problem. Rewrite
  for a genuine curiosity gap, 4–8 words; fix only the subject so you can tell whether it
  worked.
- **Opens trending down across all sends but CTOR steady** → likely a visibility issue
  (inbox placement, send time), not a content one — and remember opens are inflated by
  privacy proxies; trust the trend, not the level.

## 3. Open **List Health** — check the asset beneath

Read net change by list, and the Flags column of the matrix.

- **Every list flat or growing** → healthy; go to step 4.
- **One segment eroding month after month** (the demo's legacy blog signups) → localize
  it: if churn is concentrated there, it's a sourcing problem. Retire the segment or run
  one deliberate, clearly-labeled winback — then let it go. The **Mailing List** slicer
  isolates one list across the whole page.
- **Overall net change negative** → a future revenue cliff that campaign rates will never
  show. Shift effort from send optimization to subscriber acquisition this quarter.
- **Growth suspiciously fast** → growth faster than your acquisition explains predicts
  deliverability damage. Audit the source before celebrating.

## 4. Open **Monthly Report** — put it in business terms

Delivered draws against attributed revenue, with opens, clicks and revenue in the matrix.
Sort the matrix by Revenue.

- **Revenue concentrated in a few sends** → normal. Study the top three (offer, audience,
  timing) and plan next quarter around what they share.
- **Newsletters earning little** → also normal — they keep the audience warm so
  promotions can harvest. Judge them on engagement trend, not revenue.
- **A promotion that underearned** → cross-reference step 2: was it a click problem or did
  clicks simply not convert? The first is yours to fix; the second belongs to the landing
  page.

*Definitions for every metric named here: [glossary](../reference/glossary.md). The
thinking behind each step: the four [explanation guides](../README.md#explanation--understanding).*
