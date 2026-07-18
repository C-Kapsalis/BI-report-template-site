import type { CampaignSend, CampaignType, ListName } from "./types";

/**
 * Fictional campaign sends for an unnamed specialty tea and homeware shop, Aug 2025 - Jul 2026.
 *
 * Each row is authored as inputs (sent, bounces, open rate, click-to-open rate,
 * ...) and expanded into consistent totals below, so the funnel arithmetic
 * always holds: delivered = sent - bounces, opens = delivered x open rate,
 * clicks = opens x CTOR. To swap in your own data, see
 * docs/how-to/swap-in-your-own-data.md.
 *
 * Deliberate patterns baked in:
 * - Healthy sends: delivery 98-99%, CTOR 8-15%, per-send CTR mostly inside
 *   the 2-5% band.
 * - "Slow steep, big flavour" (c09): high opens, weak CTOR -> a copy/CTA
 *   problem (the subject earned the open; the body squandered it).
 * - "Our February update" (c14): low opens, normal CTOR -> a subject-line
 *   problem.
 * - "A gift from the archive" (c11) to the legacy list: bounce spike
 *   (delivery ~91%) -> a list-hygiene problem, and elevated complaints.
 */

interface RawSend {
  id: string;
  name: string;
  subject: string;
  sentDate: string;
  type: CampaignType;
  list: ListName;
  sent: number;
  bounces: number;
  openRate: number; // opens / delivered
  ctor: number; // clicks / opens
  unsubscribes: number;
  complaints: number;
  revenue: number;
}

const raw: RawSend[] = [
  { id: "c01", name: "2025-08 The Steep #41", subject: "Cold brew, warm evenings", sentDate: "2025-08-07", type: "Newsletter", list: "Main newsletter", sent: 23900, bounces: 260, openRate: 0.38, ctor: 0.11, unsubscribes: 41, complaints: 4, revenue: 2900 },
  { id: "c02", name: "2025-08 Stoneware restock", subject: "The teapots are back (all four glazes)", sentDate: "2025-08-21", type: "Promotion", list: "Main newsletter", sent: 24050, bounces: 240, openRate: 0.41, ctor: 0.14, unsubscribes: 58, complaints: 5, revenue: 11400 },
  { id: "c03", name: "2025-09 The Steep #42", subject: "How we taste an autumn harvest", sentDate: "2025-09-04", type: "Newsletter", list: "Main newsletter", sent: 24300, bounces: 250, openRate: 0.37, ctor: 0.1, unsubscribes: 39, complaints: 3, revenue: 2100 },
  { id: "c04", name: "2025-09 VIP first pick", subject: "48 hours early: the harvest list", sentDate: "2025-09-18", type: "Promotion", list: "VIP customers", sent: 3260, bounces: 12, openRate: 0.52, ctor: 0.16, unsubscribes: 3, complaints: 0, revenue: 8600 },
  { id: "c05", name: "2025-10 The Steep #43", subject: "Why your kettle temperature matters", sentDate: "2025-10-02", type: "Newsletter", list: "Main newsletter", sent: 24700, bounces: 270, openRate: 0.39, ctor: 0.12, unsubscribes: 44, complaints: 4, revenue: 3300 },
  { id: "c06", name: "2025-10 Autumn bundle", subject: "One box, three teas, zero decisions", sentDate: "2025-10-16", type: "Promotion", list: "Main newsletter", sent: 24850, bounces: 260, openRate: 0.43, ctor: 0.15, unsubscribes: 62, complaints: 6, revenue: 16800 },
  { id: "c07", name: "2025-11 Early gifting", subject: "Gifts that steep well", sentDate: "2025-11-06", type: "Promotion", list: "Main newsletter", sent: 25100, bounces: 280, openRate: 0.44, ctor: 0.14, unsubscribes: 71, complaints: 7, revenue: 21500 },
  { id: "c08", name: "2025-11 The Steep #44", subject: "A short history of the tea tin", sentDate: "2025-11-20", type: "Newsletter", list: "Main newsletter", sent: 25200, bounces: 260, openRate: 0.36, ctor: 0.1, unsubscribes: 40, complaints: 3, revenue: 2600 },
  { id: "c09", name: "2025-12 Holiday flash", subject: "Slow steep, big flavour - 30% off everything", sentDate: "2025-12-04", type: "Promotion", list: "Main newsletter", sent: 25400, bounces: 290, openRate: 0.48, ctor: 0.025, unsubscribes: 96, complaints: 11, revenue: 4100 },
  { id: "c10", name: "2025-12 Last shipping day", subject: "Order by Thursday, pour by Christmas", sentDate: "2025-12-15", type: "Promotion", list: "Main newsletter", sent: 25500, bounces: 270, openRate: 0.45, ctor: 0.13, unsubscribes: 66, complaints: 6, revenue: 19200 },
  { id: "c11", name: "2025-12 Archive winback", subject: "A gift from the archive", sentDate: "2025-12-19", type: "Promotion", list: "Legacy blog signups", sent: 7600, bounces: 690, openRate: 0.14, ctor: 0.07, unsubscribes: 88, complaints: 12, revenue: 900 },
  { id: "c12", name: "2026-01 The Steep #45", subject: "January is for green tea", sentDate: "2026-01-08", type: "Newsletter", list: "Main newsletter", sent: 25650, bounces: 260, openRate: 0.37, ctor: 0.11, unsubscribes: 43, complaints: 4, revenue: 2800 },
  { id: "c13", name: "2026-01 Welcome series refresh", subject: "Your first steep, done right", sentDate: "2026-01-22", type: "Lifecycle", list: "Main newsletter", sent: 1850, bounces: 8, openRate: 0.56, ctor: 0.18, unsubscribes: 2, complaints: 0, revenue: 3900 },
  { id: "c14", name: "2026-02 The Steep #46", subject: "Our February update", sentDate: "2026-02-05", type: "Newsletter", list: "Main newsletter", sent: 25800, bounces: 270, openRate: 0.18, ctor: 0.1, unsubscribes: 38, complaints: 3, revenue: 1200 },
  { id: "c15", name: "2026-02 Valentine pairing", subject: "Two cups, one pot: the pairing guide", sentDate: "2026-02-12", type: "Promotion", list: "Main newsletter", sent: 25850, bounces: 250, openRate: 0.42, ctor: 0.13, unsubscribes: 55, complaints: 5, revenue: 13700 },
  { id: "c16", name: "2026-03 The Steep #47", subject: "First flush season, explained", sentDate: "2026-03-05", type: "Newsletter", list: "Main newsletter", sent: 26000, bounces: 260, openRate: 0.38, ctor: 0.12, unsubscribes: 41, complaints: 4, revenue: 3100 },
  { id: "c17", name: "2026-04 Spring tableware", subject: "Set the table for spring", sentDate: "2026-04-09", type: "Promotion", list: "Main newsletter", sent: 26150, bounces: 250, openRate: 0.4, ctor: 0.14, unsubscribes: 59, complaints: 5, revenue: 14900 },
  { id: "c18", name: "2026-05 VIP tasting invite", subject: "You are invited: the May tasting flight", sentDate: "2026-05-07", type: "Promotion", list: "VIP customers", sent: 3410, bounces: 10, openRate: 0.54, ctor: 0.17, unsubscribes: 2, complaints: 0, revenue: 9800 },
  { id: "c19", name: "2026-06 The Steep #48", subject: "Iced tea without the sugar crash", sentDate: "2026-06-04", type: "Newsletter", list: "Main newsletter", sent: 26400, bounces: 270, openRate: 0.39, ctor: 0.12, unsubscribes: 45, complaints: 4, revenue: 3600 },
  { id: "c20", name: "2026-07 Summer sale", subject: "The summer sale starts with S", sentDate: "2026-07-02", type: "Promotion", list: "Main newsletter", sent: 26550, bounces: 260, openRate: 0.43, ctor: 0.15, unsubscribes: 63, complaints: 6, revenue: 18300 },
];

export const campaigns: CampaignSend[] = raw.map((r) => {
  const delivered = r.sent - r.bounces;
  const opens = Math.round(delivered * r.openRate);
  const clicks = Math.round(opens * r.ctor);
  return {
    id: r.id,
    name: r.name,
    subject: r.subject,
    sentDate: r.sentDate,
    type: r.type,
    list: r.list,
    sent: r.sent,
    delivered,
    bounces: r.bounces,
    opens,
    clicks,
    unsubscribes: r.unsubscribes,
    complaints: r.complaints,
    revenue: r.revenue,
  };
});
