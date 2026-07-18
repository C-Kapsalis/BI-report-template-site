# How to swap in your own data

*Replace the fictional demo data with your own exports. No backend involved —
the "database" is two TypeScript modules.*

## Where the data lives

| File | What it holds |
|---|---|
| `src/data/campaigns.ts` | One row per campaign send |
| `src/data/listHealth.ts` | One row per mailing list per month |
| `src/data/types.ts` | The schema both files must satisfy |

The full field-by-field contract is in [reference/data-model.md](../reference/data-model.md).

## 1. Export your sends

From your sending tool (most export CSV per campaign), collect per send: name, subject,
send date, type, list, sent, bounces, opens, clicks, unsubscribes, complaints, revenue.

## 2. Fill in `campaigns.ts`

Edit the `raw` array. You author **inputs** — `sent`, `bounces`, `openRate`
(opens ÷ delivered), `ctor` (clicks ÷ opens), `unsubscribes`, `complaints`, `revenue` —
and the module expands them into consistent totals, so the funnel arithmetic always holds.
If your export gives you raw opens/clicks instead of rates, either compute the two rates
once per row, or replace the expansion at the bottom of the file with your literal values.

Vendor quirks to respect:

- **Complaints are vendor-limited** — some tools report them, some don't. If yours
  doesn't, leave the field `0` and ignore complaint flags, or remove the measure from
  `src/data/measures.ts`.
- **Opens are inflated** by privacy proxies. Import them as-is; the template already
  treats open rate as directional.

## 3. Fill in `listHealth.ts`

Per list per month: `subscribes`, `unsubscribes`, `cleaned`, plus a starting member count
per list in `startMembers`. End-of-month membership is accumulated for you. Update
`MONTHS` if your window isn't Aug 2025–Jul 2026, and the `TIMEFRAMES` start months in
`src/data/measures.ts` to match.

## 4. Update the dimension catalogs

In `src/data/measures.ts`, make the `LEGENDS` values match your reality — your campaign
types and your list names (they must equal the strings used in the data files, or legend
splits will come up empty). Assign each value a palette `slot`; keep slots stable so
colors follow entities.

## 5. Add your brand

The template ships unbranded. To put your name on it, edit the report title in
`src/components/Header.tsx` (the `brand-name` element) and the page title in
`index.html`.

## 6. Check the result

```bash
npm run dev
```

Open each built-in bookmark. If a bookmark references a measure or legend you removed,
edit `src/state/bookmarks.ts` accordingly. Then run `npm run build` — TypeScript will
catch any row that doesn't satisfy the schema.
