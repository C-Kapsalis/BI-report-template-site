# Data model

Two tables, defined in `src/data/types.ts` and populated in `src/data/campaigns.ts` and
`src/data/listHealth.ts`. All demo values are fictional. Metric semantics live in the
[glossary](glossary.md); this page is the structural contract.

## `CampaignSend` — one row per email send

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Unique, stable (`"c01"`…). Used as the send-axis bucket key. |
| `name` | `string` | Internal campaign name shown as the matrix row label. |
| `subject` | `string` | Subject line as recipients saw it (matrix sublabel, tooltips). |
| `sentDate` | `string` | ISO date `YYYY-MM-DD`. Month/quarter bucketing derives from it. |
| `type` | `"Newsletter" \| "Promotion" \| "Lifecycle" \| "Announcement"` | Must match a `LEGENDS` value in `src/data/measures.ts`. |
| `list` | `ListName` | The mailing list the send went to; must match a `LEGENDS` value. |
| `sent` | `number` | Invariant: `sent = delivered + bounces`. |
| `delivered` | `number` | |
| `bounces` | `number` | |
| `opens` | `number` | Unique opens. |
| `clicks` | `number` | Unique link clicks. Invariant: `clicks ≤ opens ≤ delivered`. |
| `unsubscribes` | `number` | |
| `complaints` | `number` | `0` when the vendor doesn't report them. |
| `revenue` | `number` | USD attributed to the send. |

`campaigns.ts` authors each row as inputs (`sent`, `bounces`, `openRate`, `ctor`, …) and
expands them at module load, so the invariants hold by construction.

## `ListMonth` — one row per mailing list per month

| Field | Type | Notes |
|---|---|---|
| `month` | `string` | `YYYY-MM` key; must exist in the `MONTHS` tuple. |
| `list` | `ListName` | `"Main newsletter" \| "VIP customers" \| "Legacy blog signups"` in the demo. |
| `subscribes` | `number` | New members in the month. |
| `unsubscribes` | `number` | Opt-outs in the month. |
| `cleaned` | `number` | Removed by hygiene in the month. |
| `endMembers` | `number` | Active members at month end. Accumulated by the module from per-month movement plus a start value. |

## Derived measures

All rates and aggregates are computed in `src/data/series.ts`, **always from summed
numerators and denominators** (for example, monthly CTOR = Σclicks ÷ Σopens), never by averaging
per-send rates. `List Active Members` aggregates as *last month in window*, not a sum.

## Aggregation validity rules

Encoded in `buildChart` (`src/data/series.ts`):

| Rule | Behavior |
|---|---|
| List measures on the Individual send axis | Excluded, with a notice — a list isn't a send. |
| List measures with the Campaign type legend | Excluded, with a notice — a list isn't a campaign. |
| CTR on Month/Quarter axes | Plotted, but with a guidance notice; the 2–5% band draws **only** on the send axis. |
| Mixed units | Never share a scale — each unit gets its own pane. |
| Legend + multiple measures of one unit | The legend splits the first measure of the pane; the rest remain in the matrix (with a notice). |
