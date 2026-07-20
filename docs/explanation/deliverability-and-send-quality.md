# Deliverability & send quality

*Pairs with the **Email Overview** bookmark. ~2 min read.*

Every send runs the same short sequence: **sent → delivered → opened → clicked**. Each
step leaks for a different reason, and one headline number hides which step is failing.
The Email Overview bookmark plots emails sent as columns against delivered as the line,
month by month, so the gap between reach and delivery is visible at a glance.

## Deliverability is the gate

Before opens or clicks mean anything, the email has to reach an inbox. Delivered divided
by sent should stay above **95%** — 98% is strong — with hard bounces near zero on a clean
list. If delivery slips below the line, stop optimizing subject lines: you have an inbox
problem, not a content problem. The usual causes are authentication gaps (SPF, DKIM and
DMARC must pass — mailbox providers made this mandatory for bulk senders), a dirty or
bought list, or a complaint rate that tripped a filter.

## The early warning

The signature to watch is a **bounce rate that climbs while volume holds steady** — list
hygiene lapsing in slow motion. In the demo data, the December winback send to the dormant
legacy list shows exactly this: delivery around 91%, a bounce spike, and complaints at
alarm level. Drill December in the matrix and that send is flagged — and the right
response is to clean or retire the segment, not to resend harder.

## Complaints are non-negotiable

A spam complaint rate of **0.1%** of delivered is a warning; **0.3% is critical** and will
get a sending domain throttled or blocked. Complaints mean a relevance or consent problem —
cut frequency and tighten segmentation rather than pushing more volume through a cracking
reputation.

## What the bookmark reveals

Scan the gap between the columns (sent) and the line (delivered) each month — healthy
months show almost none. When a month looks off, drill it in the matrix to find the send
that caused a bounce or complaint spike. The two engagement failure modes — a lost subject
vs a squandered open — are the subject of [the click guide](ctr-vs-ctor.md).

*Canonical metric definitions: [glossary](../reference/glossary.md).*
