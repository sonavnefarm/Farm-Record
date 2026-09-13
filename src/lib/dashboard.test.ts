import { describe, it, expect } from "vitest";
import { summarizeAnimals, buildMilkTrend, mergeRecentActivity } from "@/lib/dashboard";
import type { RecentActivityItem } from "@/types/dashboard";

describe("summarizeAnimals", () => {
  it("counts by category and status", () => {
    const summary = summarizeAnimals([
      { category: "BUFFALO", status: "ACTIVE" },
      { category: "BUFFALO", status: "INACTIVE" },
      { category: "COW", status: "ACTIVE" },
      { category: "GOAT", status: "ACTIVE" },
    ]);

    expect(summary.total).toBe(4);
    expect(summary.byCategory).toEqual({ BUFFALO: 2, COW: 1, GOAT: 1 });
    expect(summary.active).toBe(3);
    expect(summary.inactive).toBe(1);
  });

  it("returns all-zero categories for an empty farm", () => {
    const summary = summarizeAnimals([]);
    expect(summary.total).toBe(0);
    expect(summary.byCategory).toEqual({ BUFFALO: 0, COW: 0, GOAT: 0 });
    expect(summary.active).toBe(0);
    expect(summary.inactive).toBe(0);
  });
});

describe("buildMilkTrend", () => {
  it("fills every day in range, defaulting to 0 where there's no data", () => {
    const days = [
      new Date("2026-09-10T00:00:00Z"),
      new Date("2026-09-11T00:00:00Z"),
      new Date("2026-09-12T00:00:00Z"),
    ];
    const sums = [{ date: new Date("2026-09-11T00:00:00Z"), total: 12.5 }];

    const trend = buildMilkTrend(sums, days);

    expect(trend).toEqual([
      { date: "2026-09-10", total: 0 },
      { date: "2026-09-11", total: 12.5 },
      { date: "2026-09-12", total: 0 },
    ]);
  });
});

describe("mergeRecentActivity", () => {
  const item = (id: string, createdAt: string): RecentActivityItem => ({
    type: "food",
    id,
    date: new Date(createdAt),
    createdAt: new Date(createdAt),
    animalId: "BUFF-001",
    animalName: null,
    detail: "x",
  });

  it("sorts newest first across mixed record types and applies the limit", () => {
    const items = [
      item("a", "2026-09-10T10:00:00Z"),
      item("b", "2026-09-12T10:00:00Z"),
      item("c", "2026-09-11T10:00:00Z"),
    ];

    const result = mergeRecentActivity(items, 2);

    expect(result.map((r) => r.id)).toEqual(["b", "c"]);
  });
});
