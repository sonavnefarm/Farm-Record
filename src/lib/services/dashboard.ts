import { prisma } from "@/lib/db";
import { listAnimals } from "@/lib/services/animals";
import { summarizeAnimals, buildMilkTrend, mergeRecentActivity } from "@/lib/dashboard";
import { getDateRange, getTodayRange, enumerateDays } from "@/lib/utils/date-ranges";
import type { AnimalSummary, TodayStats, MilkTrendPoint, RecentActivityItem } from "@/types/dashboard";

export async function getAnimalSummary(): Promise<AnimalSummary> {
  const animals = await listAnimals();
  return summarizeAnimals(animals);
}

export async function getTodayStats(): Promise<TodayStats> {
  const { from, to } = getTodayRange();

  const [milkAgg, foodAgg, medicineCount] = await Promise.all([
    prisma.milkRecord.aggregate({
      _sum: { totalMilk: true },
      where: { date: { gte: from, lt: to } },
    }),
    prisma.foodRecord.aggregate({
      _sum: { quantity: true },
      where: { date: { gte: from, lt: to } },
    }),
    prisma.medicineRecord.count({ where: { date: { gte: from, lt: to } } }),
  ]);

  return {
    milkTotal: Number(milkAgg._sum.totalMilk ?? 0),
    foodTotal: Number(foodAgg._sum.quantity ?? 0),
    medicineCount,
  };
}

export async function getMilkTrend(days: number): Promise<MilkTrendPoint[]> {
  const { from, to } = getDateRange(days);

  const grouped = await prisma.milkRecord.groupBy({
    by: ["date"],
    where: { date: { gte: from, lt: to } },
    _sum: { totalMilk: true },
  });

  const sums = grouped.map((g) => ({ date: g.date, total: Number(g._sum.totalMilk ?? 0) }));
  return buildMilkTrend(sums, enumerateDays(from, days));
}

export async function getRecentActivity(limit = 8): Promise<RecentActivityItem[]> {
  const [food, milk, medicine] = await Promise.all([
    prisma.foodRecord.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { animal: { select: { id: true, name: true } } },
    }),
    prisma.milkRecord.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { animal: { select: { id: true, name: true } } },
    }),
    prisma.medicineRecord.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { animal: { select: { id: true, name: true } } },
    }),
  ]);

  const items: RecentActivityItem[] = [
    ...food.map((r) => ({
      type: "food" as const,
      id: r.id,
      date: r.date,
      createdAt: r.createdAt,
      animalId: r.animal.id,
      animalName: r.animal.name,
      detail: `${Number(r.quantity).toFixed(2)} kg${r.foodName ? ` of ${r.foodName}` : ""}`,
    })),
    ...milk.map((r) => ({
      type: "milk" as const,
      id: r.id,
      date: r.date,
      createdAt: r.createdAt,
      animalId: r.animal.id,
      animalName: r.animal.name,
      detail: `${Number(r.totalMilk).toFixed(2)} L total`,
    })),
    ...medicine.map((r) => ({
      type: "medicine" as const,
      id: r.id,
      date: r.date,
      createdAt: r.createdAt,
      animalId: r.animal.id,
      animalName: r.animal.name,
      detail: r.medicineName,
    })),
  ];

  return mergeRecentActivity(items, limit);
}
