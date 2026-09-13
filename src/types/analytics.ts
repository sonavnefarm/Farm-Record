import type { AnimalCategory } from "@/types/animal";
import type { ByAnimalTotal } from "@/lib/analytics";
import type { MilkTrendPoint } from "@/types/dashboard";

export type MilkAnalytics = {
  totalMilk: number;
  averageDailyMilk: number;
  byAnimal: ByAnimalTotal[];
  byCategory: Record<AnimalCategory, number>;
  highestProducer: ByAnimalTotal | null;
  trend: MilkTrendPoint[];
};

export type FoodAnalytics = {
  totalQuantity: number;
  averageDailyQuantity: number;
  byAnimal: ByAnimalTotal[];
  byCategory: Record<AnimalCategory, number>;
  byFoodName: { foodName: string; total: number }[];
};

export type MedicineUsagePoint = { date: string; count: number };

export type RecentMedicineRecord = {
  id: string;
  date: Date;
  medicineName: string;
  animalId: string;
  animalName: string | null;
};

export type MedicineAnalytics = {
  recent: RecentMedicineRecord[];
  byAnimal: ByAnimalTotal[]; // `total` here is a record count, not a quantity
  usageByDate: MedicineUsagePoint[];
};
