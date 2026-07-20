import type { CampaignSend, CampaignType, ListName } from "./types";

/**
 * Fictional campaign sends for an unnamed large email sender, Aug 2025 - Jul 2026.
 *
 * The data is generated deterministically (a seeded PRNG - no build-to-build
 * drift) at the scale of a serious sender: a main list of ~245k mailed many
 * times a month, so monthly volume runs into the millions, delivery sits at
 * 98-100%, bounces and complaints stay low, and each month expands to dozens
 * of individual sends. To swap in your own data, see
 * docs/how-to/swap-in-your-own-data.md.
 *
 * Deliberate patterns baked in (each bookmark has something to show):
 * - Reach & Delivery: volume rises to a May peak, dips in June, and drops
 *   sharply in July (fewer broadcasts) - a cadence story on the chart.
 * - A February deliverability incident: bounces spike to ~1.8% for the month
 *   (delivery ~98%) with elevated complaints - list hygiene lapsing.
 * - Engagement: a March broadcast with a weak subject line (open rate ~12%,
 *   normal CTOR) and a May promotion with the opposite failure (open rate
 *   ~48%, CTOR ~2% - the body squandered the open).
 * - List Health: the Legacy blog-signup list erodes every month (see
 *   listHealth.ts); its winback sends mostly harvest bounces and complaints.
 */

/* ---------- deterministic PRNG ---------- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260714);
const rand = (lo: number, hi: number) => lo + rng() * (hi - lo);
const jitter = (base: number, pct: number) => Math.round(base * (1 + rand(-pct, pct)));

/* ---------- month plan ---------- */

const MONTH_KEYS = [
  "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
  "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07",
] as const;

/** Broadcasts to the main list per month - the shape of the volume story. */
const BROADCASTS: Record<string, number> = {
  "2025-08": 12, "2025-09": 12, "2025-10": 13, "2025-11": 14, "2025-12": 14,
  "2026-01": 12, "2026-02": 12, "2026-03": 13, "2026-04": 15, "2026-05": 16,
  "2026-06": 14, "2026-07": 7,
};

const MAIN_LIST_SIZE = 245000;

const BROADCAST_THEMES = [
  "Weekly_Digest", "Product_Update", "Members_Bulletin", "The_Roundup", "Field_Notes",
  "New_This_Week", "Editors_Picks", "Weekend_Reads", "Release_Notes", "Community_Digest",
  "Monthly_Recap", "Fresh_Arrivals", "Studio_Update", "The_Brief", "Highlights", "Dispatch",
];
const PROMO_THEMES = [
  "Seasonal_Sale", "Members_Offer", "Bundle_Deal", "Early_Access", "Clearance_Event", "Flash_Sale",
];

const daysIn = (mk: string) => new Date(Number(mk.slice(0, 4)), Number(mk.slice(5)) , 0).getDate();
const iso = (mk: string, day: number) => `${mk}-${String(day).padStart(2, "0")}`;

/** Build one send from authored rates, keeping the funnel arithmetic exact. */
function make(
  id: string,
  name: string,
  subject: string,
  sentDate: string,
  type: CampaignType,
  list: ListName,
  sent: number,
  bounceRate: number,
  openRate: number,
  ctor: number,
  complaintRate: number,
  unsubRate: number,
  revenue: number,
): CampaignSend {
  const bounces = Math.max(0, Math.round(sent * bounceRate));
  const delivered = sent - bounces;
  const opens = Math.round(delivered * openRate);
  const clicks = Math.round(opens * ctor);
  const complaints = Math.round(delivered * complaintRate);
  const unsubscribes = Math.round(delivered * unsubRate);
  return { id, name, subject, sentDate, type, list, sent, delivered, bounces, opens, clicks, unsubscribes, complaints, revenue };
}

const sends: CampaignSend[] = [];
let counter = 0;
const nextId = () => `s${String(++counter).padStart(3, "0")}`;

for (const mk of MONTH_KEYS) {
  const dim = daysIn(mk);
  const n = BROADCASTS[mk];
  const feb = mk === "2026-02"; // deliverability incident
  const march = mk === "2026-03";
  const may = mk === "2026-05";

  // --- main-list broadcasts, spread across the month ---
  for (let i = 0; i < n; i++) {
    const day = Math.min(dim, 2 + Math.round((i + 0.5) * (dim - 3) / n));
    const isPromo = i % 4 === 3;
    const type: CampaignType = isPromo ? "Promotion" : "Newsletter";
    const theme = isPromo
      ? PROMO_THEMES[i % PROMO_THEMES.length]
      : BROADCAST_THEMES[i % BROADCAST_THEMES.length];
    const sent = jitter(MAIN_LIST_SIZE, 0.01);
    let bounceRate = rand(0.001, 0.0025);
    if (feb) bounceRate = rand(0.016, 0.021); // the February incident
    let openRate = isPromo ? rand(0.4, 0.46) : rand(0.34, 0.42);
    let ctor = isPromo ? rand(0.11, 0.16) : rand(0.09, 0.13);
    let subject = isPromo ? "Members-only pricing, this week only" : "This week from the studio";
    let name = `${iso(mk, day)}_${theme}`;

    // Baked story: a weak-subject broadcast in March.
    if (march && i === 5) {
      openRate = 0.12;
      ctor = 0.1;
      subject = "A quick update";
      name = `${iso(mk, day)}_Monthly_Recap`;
    }
    // Baked story: high open, collapsed click in May (a copy/CTA problem).
    if (may && i === 8) {
      openRate = 0.48;
      ctor = 0.021;
      subject = "Everything is on sale - big flavour, small prices";
      name = `${iso(mk, day)}_Flash_Sale`;
    }

    const complaintRate = feb ? rand(0.00006, 0.0001) : rand(0.00002, 0.00005);
    const unsubRate = rand(0.0004, 0.0011);
    const revenue = isPromo ? Math.round(rand(9000, 22000)) : Math.round(rand(1200, 4200));
    sends.push(make(nextId(), name, subject, iso(mk, day), type, "Main newsletter", sent, bounceRate, openRate, ctor, complaintRate, unsubRate, revenue));
  }

  // --- a couple of targeted VIP / lifecycle sends (small, high engagement) ---
  const vipDay = Math.min(dim, 6 + Math.round(rand(0, 4)));
  sends.push(make(
    nextId(), `${iso(mk, vipDay)}_VIP_Preview`, "48 hours early: your preview link",
    iso(mk, vipDay), "Promotion", "VIP customers",
    jitter(3300, 0.03), rand(0.001, 0.003), rand(0.5, 0.56), rand(0.15, 0.19),
    rand(0, 0.00003), rand(0.0003, 0.0008), Math.round(rand(7000, 12000)),
  ));
  const lcDay = Math.min(dim, 18 + Math.round(rand(0, 6)));
  sends.push(make(
    nextId(), `${iso(mk, lcDay)}_Welcome_Series`, "Getting started, step by step",
    iso(mk, lcDay), "Lifecycle", "Main newsletter",
    jitter(1850, 0.05), rand(0.001, 0.004), rand(0.52, 0.6), rand(0.16, 0.2),
    rand(0, 0.00003), rand(0.0002, 0.0006), Math.round(rand(2500, 4500)),
  ));

  // --- tiny segment / test sends (populate the expand view) ---
  const tiny = 2 + Math.floor(rand(0, 3));
  for (let t = 0; t < tiny; t++) {
    const day = 3 + Math.floor(rand(0, dim - 4));
    const size = [1, 26, 67, 128, 332, 403, 637][Math.floor(rand(0, 7))];
    sends.push(make(
      nextId(), `${iso(mk, day)}_Segment_Test`, "Segment test send",
      iso(mk, day), "Announcement", "Main newsletter",
      size, rand(0.002, 0.03), rand(0.3, 0.99), rand(0.05, 0.2),
      rand(0, 0.002), rand(0, 0.01), Math.round(rand(0, 200)),
    ));
  }

  // --- occasional Legacy list winback (mostly harvests bounces/complaints) ---
  if (["2025-10", "2025-12", "2026-03", "2026-06"].includes(mk)) {
    const day = Math.min(dim, 12 + Math.round(rand(0, 6)));
    const heavy = mk === "2025-12"; // the December cleaning spike
    sends.push(make(
      nextId(), `${iso(mk, day)}_Winback_Nudge`, "We saved your spot - come back?",
      iso(mk, day), "Promotion", "Legacy blog signups",
      jitter(7600, 0.04), heavy ? rand(0.09, 0.12) : rand(0.05, 0.08),
      rand(0.12, 0.17), rand(0.05, 0.08), rand(0.0012, 0.0018), rand(0.008, 0.014),
      Math.round(rand(400, 1100)),
    ));
  }
}

export const campaigns: CampaignSend[] = sends.sort((a, b) => a.sentDate.localeCompare(b.sentDate));
