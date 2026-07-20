import type { ListMonth, ListName } from "./types";

/**
 * Fictional monthly list movement, Aug 2025 - Jul 2026, scaled to a large
 * sender.
 *
 * Authored as per-month movement (subscribes, unsubscribes, cleaned) with a
 * starting member count per list; end-of-month membership is accumulated
 * below so the series is always internally consistent.
 *
 * Deliberate patterns:
 * - "Main newsletter" grows steadily (~1-2%/month) - a healthy list of ~245k.
 * - "VIP customers" is small and stable.
 * - "Legacy blog signups" erodes every single month - no new sourcing,
 *   ongoing unsubscribes and hygiene cleaning. The December winback send
 *   shows up as a spike in cleaned addresses and unsubscribes.
 */

export const MONTHS = [
  "2025-08",
  "2025-09",
  "2025-10",
  "2025-11",
  "2025-12",
  "2026-01",
  "2026-02",
  "2026-03",
  "2026-04",
  "2026-05",
  "2026-06",
  "2026-07",
] as const;

interface RawMove {
  subscribes: number;
  unsubscribes: number;
  cleaned: number;
}

const startMembers: Record<ListName, number> = {
  "Main newsletter": 236000,
  "VIP customers": 3210,
  "Legacy blog signups": 31000,
};

const movement: Record<ListName, RawMove[]> = {
  "Main newsletter": [
    { subscribes: 5400, unsubscribes: 990, cleaned: 600 }, // 2025-08
    { subscribes: 6100, unsubscribes: 830, cleaned: 550 }, // 2025-09
    { subscribes: 6600, unsubscribes: 1060, cleaned: 580 }, // 2025-10
    { subscribes: 5900, unsubscribes: 1110, cleaned: 620 }, // 2025-11
    { subscribes: 6200, unsubscribes: 1620, cleaned: 700 }, // 2025-12
    { subscribes: 5200, unsubscribes: 450, cleaned: 520 }, // 2026-01
    { subscribes: 4800, unsubscribes: 930, cleaned: 4900 }, // 2026-02 (incident cleaning)
    { subscribes: 5100, unsubscribes: 410, cleaned: 480 }, // 2026-03
    { subscribes: 5300, unsubscribes: 590, cleaned: 510 }, // 2026-04
    { subscribes: 4900, unsubscribes: 380, cleaned: 470 }, // 2026-05
    { subscribes: 5200, unsubscribes: 450, cleaned: 490 }, // 2026-06
    { subscribes: 3100, unsubscribes: 630, cleaned: 460 }, // 2026-07
  ],
  "VIP customers": [
    { subscribes: 44, unsubscribes: 16, cleaned: 4 },
    { subscribes: 51, unsubscribes: 17, cleaned: 5 },
    { subscribes: 48, unsubscribes: 15, cleaned: 4 },
    { subscribes: 53, unsubscribes: 18, cleaned: 5 },
    { subscribes: 61, unsubscribes: 19, cleaned: 6 },
    { subscribes: 42, unsubscribes: 16, cleaned: 4 },
    { subscribes: 45, unsubscribes: 15, cleaned: 4 },
    { subscribes: 47, unsubscribes: 16, cleaned: 5 },
    { subscribes: 50, unsubscribes: 17, cleaned: 4 },
    { subscribes: 55, unsubscribes: 16, cleaned: 5 },
    { subscribes: 46, unsubscribes: 15, cleaned: 4 },
    { subscribes: 49, unsubscribes: 17, cleaned: 5 },
  ],
  "Legacy blog signups": [
    { subscribes: 14, unsubscribes: 920, cleaned: 710 },
    { subscribes: 13, unsubscribes: 870, cleaned: 680 },
    { subscribes: 12, unsubscribes: 950, cleaned: 740 },
    { subscribes: 13, unsubscribes: 900, cleaned: 700 },
    { subscribes: 12, unsubscribes: 1780, cleaned: 7050 }, // winback fallout
    { subscribes: 11, unsubscribes: 840, cleaned: 660 },
    { subscribes: 12, unsubscribes: 790, cleaned: 630 },
    { subscribes: 11, unsubscribes: 820, cleaned: 650 },
    { subscribes: 12, unsubscribes: 760, cleaned: 600 },
    { subscribes: 11, unsubscribes: 730, cleaned: 580 },
    { subscribes: 12, unsubscribes: 710, cleaned: 550 },
    { subscribes: 11, unsubscribes: 690, cleaned: 540 },
  ],
};

export const listMonths: ListMonth[] = (Object.keys(movement) as ListName[]).flatMap(
  (list) => {
    let members = startMembers[list];
    return movement[list].map((m, i) => {
      members += m.subscribes - m.unsubscribes - m.cleaned;
      return {
        month: MONTHS[i],
        list,
        subscribes: m.subscribes,
        unsubscribes: m.unsubscribes,
        cleaned: m.cleaned,
        endMembers: members,
      };
    });
  },
);
