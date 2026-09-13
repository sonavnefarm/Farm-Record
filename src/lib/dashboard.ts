import { ANIMAL_CATEGORIES } from "@/types/animal";
import type { AnimalCategory, AnimalStatus } from "@/types/animal";
import type { AnimalSummary, MilkTrendPoint, RecentActivityItem } from "@/types/dashboard";
import { buildDailySeries } from "@/lib/utils/date-ranges";

export function summarizeAnimals(
  animals: { category: AnimalCategory; status: AnimalStatus }[],
): AnimalSummary {
  const byCategory = Object.fromEntries(
    ANIMAL_CATEGORIES.map((category) => [category, 0]),
  ) as Record<AnimalCategory, number>;

  let active = 0;
  let inactive = 0;

  for (const animal of animals) {
    byCategory[animal.category] += 1;
    if (animal.status === "ACTIVE") {
      active += 1;
    } else {
      inactive += 1;
    }
  }

  return { total: animals.length, byCategory, active, inactive };
}

/**
 * Fill in every day in `days` with its matching sum from `sums`, defaulting
 * to 0 for days with no records — so the trend chart always shows a
 * continuous line/bars for the full range, not just days with data.
 */
export function buildMilkTrend(
  sums: { date: Date; total: number }[],
  days: Date[],
): MilkTrendPoint[] {
  const series = buildDailySeries(
    sums.map((s) => ({ date: s.date, value: s.total })),
    days,
  );
  return series.map((point) => ({ date: point.date, total: point.value }));
}

/** Merge activity from multiple record types into one reverse-chronological list. */
export function mergeRecentActivity(
  items: RecentActivityItem[],
  limit: number,
): RecentActivityItem[] {
  return [...items]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}
