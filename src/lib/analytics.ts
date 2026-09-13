import { ANIMAL_CATEGORIES } from "@/types/animal";
import type { AnimalCategory } from "@/types/animal";

export type ByAnimalTotal = {
  animalId: string;
  animalName: string | null;
  category: AnimalCategory | null;
  total: number;
};

/**
 * Join pre-aggregated per-animal sums/counts with animal info (name,
 * category), sorted highest-first. `category` is null only in the
 * defensive case where a record's animal can't be found — animals are
 * never hard-deleted (see FEATURES.md §2), so this shouldn't happen in
 * practice, but callers shouldn't have to assume it can't.
 */
export function aggregateByAnimal(
  sums: { animalId: string; total: number }[],
  animals: { id: string; name: string | null; category: AnimalCategory }[],
): ByAnimalTotal[] {
  const animalMap = new Map(animals.map((a) => [a.id, a]));
  return sums
    .map((s) => {
      const animal = animalMap.get(s.animalId);
      return {
        animalId: s.animalId,
        animalName: animal?.name ?? null,
        category: animal?.category ?? null,
        total: s.total,
      };
    })
    .sort((a, b) => b.total - a.total);
}

/** Roll per-animal totals up into per-category totals. */
export function aggregateByCategoryTotals(
  byAnimal: ByAnimalTotal[],
): Record<AnimalCategory, number> {
  const result = Object.fromEntries(
    ANIMAL_CATEGORIES.map((category) => [category, 0]),
  ) as Record<AnimalCategory, number>;

  for (const item of byAnimal) {
    if (item.category) {
      result[item.category] += item.total;
    }
  }

  return result;
}

/** Round to 2 decimal places, same convention as computeTotalMilk. */
export function averageDaily(total: number, days: number): number {
  if (days <= 0) return 0;
  return Math.round((total / days) * 100) / 100;
}

/**
 * Group food totals by name, gracefully bucketing records with no food
 * name (optional field — see FEATURES.md §8) under "Unspecified" rather
 * than dropping them or crashing.
 */
export function aggregateByFoodName(
  sums: { foodName: string | null; total: number }[],
): { foodName: string; total: number }[] {
  return sums
    .map((s) => ({ foodName: s.foodName ?? "Unspecified", total: s.total }))
    .sort((a, b) => b.total - a.total);
}
