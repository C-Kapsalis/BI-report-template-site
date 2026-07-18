import type { ListMonth, ListName } from "./types";

/**
 * Fictional monthly list movement, Aug 2025 - Jul 2026.
 *
 * Authored as per-month movement (subscribes, unsubscribes, cleaned) with a
 * starting member count per list; end-of-month membership is accumulated
 * below so the series is always internally consistent.
 *
 * Deliberate patterns:
 * - "Main newsletter" grows steadily (~1-2%/month) - a healthy list.
 * - "VIP customers" is small and stable.
 * - "Legacy blog signups" erodes every single month - no new sourcing,
 *   ongoing unsubscribes and hygiene cleaning. The December winback send
 *   (c11) shows up as a spike in cleaned addresses and unsubscribes.
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
  "Main newsletter": 23600,
  "VIP customers": 3210,
  "Legacy blog signups": 8100,
};

const movement: Record<ListName, RawMove[]> = {
  "Main newsletter": [
    { subscribes: 540, unsubscribes: 99, cleaned: 60 }, // 2025-08
    { subscribes: 610, unsubscribes: 83, cleaned: 55 }, // 2025-09
    { subscribes: 660, unsubscribes: 106, cleaned: 58 }, // 2025-10
    { subscribes: 590, unsubscribes: 111, cleaned: 62 }, // 2025-11
    { subscribes: 620, unsubscribes: 162, cleaned: 70 }, // 2025-12
    { subscribes: 520, unsubscribes: 45, cleaned: 52 }, // 2026-01
    { subscribes: 480, unsubscribes: 93, cleaned: 50 }, // 2026-02
    { subscribes: 510, unsubscribes: 41, cleaned: 48 }, // 2026-03
    { subscribes: 530, unsubscribes: 59, cleaned: 51 }, // 2026-04
    { subscribes: 490, unsubscribes: 38, cleaned: 47 }, // 2026-05
    { subscribes: 520, unsubscribes: 45, cleaned: 49 }, // 2026-06
    { subscribes: 505, unsubscribes: 63, cleaned: 46 }, // 2026-07
  ],
  "VIP customers": [
    { subscribes: 24, unsubscribes: 6, cleaned: 2 },
    { subscribes: 31, unsubscribes: 7, cleaned: 3 },
    { subscribes: 28, unsubscribes: 5, cleaned: 2 },
    { subscribes: 33, unsubscribes: 8, cleaned: 3 },
    { subscribes: 41, unsubscribes: 9, cleaned: 4 },
    { subscribes: 22, unsubscribes: 6, cleaned: 2 },
    { subscribes: 25, unsubscribes: 5, cleaned: 2 },
    { subscribes: 27, unsubscribes: 6, cleaned: 3 },
    { subscribes: 30, unsubscribes: 7, cleaned: 2 },
    { subscribes: 35, unsubscribes: 6, cleaned: 3 },
    { subscribes: 26, unsubscribes: 5, cleaned: 2 },
    { subscribes: 29, unsubscribes: 7, cleaned: 3 },
  ],
  "Legacy blog signups": [
    { subscribes: 4, unsubscribes: 92, cleaned: 71 },
    { subscribes: 3, unsubscribes: 87, cleaned: 68 },
    { subscribes: 2, unsubscribes: 95, cleaned: 74 },
    { subscribes: 3, unsubscribes: 90, cleaned: 70 },
    { subscribes: 2, unsubscribes: 178, cleaned: 705 }, // winback fallout
    { subscribes: 1, unsubscribes: 84, cleaned: 66 },
    { subscribes: 2, unsubscribes: 79, cleaned: 63 },
    { subscribes: 1, unsubscribes: 82, cleaned: 65 },
    { subscribes: 2, unsubscribes: 76, cleaned: 60 },
    { subscribes: 1, unsubscribes: 73, cleaned: 58 },
    { subscribes: 2, unsubscribes: 71, cleaned: 55 },
    { subscribes: 1, unsubscribes: 69, cleaned: 54 },
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
