import { describe, it, expect } from "vitest";
import { aggregateByAnimal, aggregateByCategoryTotals, averageDaily, aggregateByFoodName } from "@/lib/analytics";

const animals = [
  { id: "BUFF-001", name: "Bella", category: "BUFFALO" as const },
  { id: "COW-001", name: null, category: "COW" as const },
  { id: "GOAT-001", name: "Gio", category: "GOAT" as const },
];

describe("aggregateByAnimal", () => {
  it("joins sums with animal info and sorts highest-first", () => {
    const result = aggregateByAnimal(
      [
        { animalId: "BUFF-001", total: 5 },
        { animalId: "COW-001", total: 20 },
        { animalId: "GOAT-001", total: 10 },
      ],
      animals,
    );

    expect(result.map((r) => r.animalId)).toEqual(["COW-001", "GOAT-001", "BUFF-001"]);
    expect(result[0]).toEqual({
      animalId: "COW-001",
      animalName: null,
      category: "COW",
      total: 20,
    });
  });

  it("defensively handles a sum for an animal not in the provided list", () => {
    const result = aggregateByAnimal([{ animalId: "GHOST-001", total: 3 }], animals);
    expect(result[0]).toEqual({
      animalId: "GHOST-001",
      animalName: null,
      category: null,
      total: 3,
    });
  });
});

describe("aggregateByCategoryTotals", () => {
  it("rolls per-animal totals up by category", () => {
    const byAnimal = aggregateByAnimal(
      [
        { animalId: "BUFF-001", total: 5 },
        { animalId: "COW-001", total: 20 },
        { animalId: "GOAT-001", total: 10 },
      ],
      animals,
    );

    expect(aggregateByCategoryTotals(byAnimal)).toEqual({
      BUFFALO: 5,
      COW: 20,
      GOAT: 10,
    });
  });

  it("returns all-zero categories for no data", () => {
    expect(aggregateByCategoryTotals([])).toEqual({ BUFFALO: 0, COW: 0, GOAT: 0 });
  });

  it("skips entries with a null category (defensive edge case)", () => {
    const result = aggregateByCategoryTotals([
      { animalId: "GHOST-001", animalName: null, category: null, total: 100 },
    ]);
    expect(result).toEqual({ BUFFALO: 0, COW: 0, GOAT: 0 });
  });
});

describe("averageDaily", () => {
  it("divides total by days and rounds to 2 decimal places", () => {
    expect(averageDaily(10, 3)).toBe(3.33);
  });

  it("returns 0 for a zero or negative day count instead of dividing by zero", () => {
    expect(averageDaily(10, 0)).toBe(0);
    expect(averageDaily(10, -1)).toBe(0);
  });
});

describe("aggregateByFoodName", () => {
  it("groups by name and sorts highest-first", () => {
    const result = aggregateByFoodName([
      { foodName: "Green Fodder", total: 12 },
      { foodName: "Hay", total: 30 },
    ]);
    expect(result).toEqual([
      { foodName: "Hay", total: 30 },
      { foodName: "Green Fodder", total: 12 },
    ]);
  });

  it("buckets null food names under 'Unspecified' rather than dropping them", () => {
    const result = aggregateByFoodName([{ foodName: null, total: 10 }]);
    expect(result).toEqual([{ foodName: "Unspecified", total: 10 }]);
  });
});
