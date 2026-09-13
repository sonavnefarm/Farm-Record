import type { AnimalCategory } from "@/types/animal";

export type AnimalSummary = {
  total: number;
  byCategory: Record<AnimalCategory, number>;
  active: number;
  inactive: number;
};

export type TodayStats = {
  milkTotal: number;
  foodTotal: number;
  medicineCount: number;
};

export type MilkTrendPoint = {
  date: string; // YYYY-MM-DD
  total: number;
};

export type RecentActivityItem = {
  type: "food" | "milk" | "medicine";
  id: string;
  date: Date;
  createdAt: Date;
  animalId: string;
  animalName: string | null;
  detail: string;
};
