import { prisma } from "@/lib/db";
import { listAnimals } from "@/lib/services/animals";
import {
  aggregateByAnimal,
  aggregateByCategoryTotals,
  aggregateByFoodName,
  averageDaily,
} from "@/lib/analytics";
import { buildMilkTrend } from "@/lib/dashboard";
import { buildDailySeries, enumerateDays } from "@/lib/utils/date-ranges";
import type { AnimalSummary } from "@/types/dashboard";
import type { MilkAnalytics, FoodAnalytics, MedicineAnalytics } from "@/types/analytics";
import { summarizeAnimals } from "@/lib/dashboard";

export type { AnimalSummary as AnimalAnalytics } from "@/types/dashboard";

export type DateRange = { from: Date; to: Date; days: number };

/** Animal Analytics — identical shape to the Dashboard's animal summary. */
export async function getAnimalAnalytics(): Promise<AnimalSummary> {
  const animals = await listAnimals();
  return summarizeAnimals(animals);
}

export async function getMilkAnalytics(range: DateRange): Promise<MilkAnalytics> {
  const where = { date: { gte: range.from, lt: range.to } };

  const [totalAgg, byAnimalGrouped, byDateGrouped, animals] = await Promise.all([
    prisma.milkRecord.aggregate({ _sum: { totalMilk: true }, where }),
    prisma.milkRecord.groupBy({ by: ["animalId"], _sum: { totalMilk: true }, where }),
    prisma.milkRecord.groupBy({ by: ["date"], _sum: { totalMilk: true }, where }),
    listAnimals(),
  ]);

  const totalMilk = Number(totalAgg._sum.totalMilk ?? 0);
  const byAnimal = aggregateByAnimal(
    byAnimalGrouped.map((g) => ({ animalId: g.animalId, total: Number(g._sum.totalMilk ?? 0) })),
    animals,
  );
  const trend = buildMilkTrend(
    byDateGrouped.map((g) => ({ date: g.date, total: Number(g._sum.totalMilk ?? 0) })),
    enumerateDays(range.from, range.days),
  );

  return {
    totalMilk,
    averageDailyMilk: averageDaily(totalMilk, range.days),
    byAnimal,
    byCategory: aggregateByCategoryTotals(byAnimal),
    highestProducer: byAnimal[0] ?? null,
    trend,
  };
}

export async function getFoodAnalytics(range: DateRange): Promise<FoodAnalytics> {
  const where = { date: { gte: range.from, lt: range.to } };

  const [totalAgg, byAnimalGrouped, byFoodNameGrouped, animals] = await Promise.all([
    prisma.foodRecord.aggregate({ _sum: { quantity: true }, where }),
    prisma.foodRecord.groupBy({ by: ["animalId"], _sum: { quantity: true }, where }),
    prisma.foodRecord.groupBy({ by: ["foodName"], _sum: { quantity: true }, where }),
    listAnimals(),
  ]);

  const totalQuantity = Number(totalAgg._sum.quantity ?? 0);
  const byAnimal = aggregateByAnimal(
    byAnimalGrouped.map((g) => ({ animalId: g.animalId, total: Number(g._sum.quantity ?? 0) })),
    animals,
  );

  return {
    totalQuantity,
    averageDailyQuantity: averageDaily(totalQuantity, range.days),
    byAnimal,
    byCategory: aggregateByCategoryTotals(byAnimal),
    byFoodName: aggregateByFoodName(
      byFoodNameGrouped.map((g) => ({
        foodName: g.foodName,
        total: Number(g._sum.quantity ?? 0),
      })),
    ),
  };
}

export async function getMedicineAnalytics(range: DateRange): Promise<MedicineAnalytics> {
  const where = { date: { gte: range.from, lt: range.to } };

  const [recentRaw, byAnimalGrouped, byDateGrouped, animals] = await Promise.all([
    prisma.medicineRecord.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { animal: { select: { id: true, name: true } } },
    }),
    prisma.medicineRecord.groupBy({ by: ["animalId"], _count: { _all: true }, where }),
    prisma.medicineRecord.groupBy({ by: ["date"], _count: { _all: true }, where }),
    listAnimals(),
  ]);

  const byAnimal = aggregateByAnimal(
    byAnimalGrouped.map((g) => ({ animalId: g.animalId, total: g._count._all })),
    animals,
  );

  const usageByDate = buildDailySeries(
    byDateGrouped.map((g) => ({ date: g.date, value: g._count._all })),
    enumerateDays(range.from, range.days),
  ).map((point) => ({ date: point.date, count: point.value }));

  return {
    recent: recentRaw.map((r) => ({
      id: r.id,
      date: r.date,
      medicineName: r.medicineName,
      animalId: r.animal.id,
      animalName: r.animal.name,
    })),
    byAnimal,
    usageByDate,
  };
}
