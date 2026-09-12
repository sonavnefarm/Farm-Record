import type { AnimalCategory } from "@/types/animal";

export type FoodRecord = {
  id: string;
  animalId: string;
  date: Date;
  foodName: string | null;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

// Enriched shape used by list views that need the animal's name/category
// alongside the record, without denormalizing that data into the DB row
// (see DATABASE.md — never store animalName/animalCategory on records).
export type FoodRecordWithAnimal = FoodRecord & {
  animal: { id: string; name: string | null; category: AnimalCategory };
};

export type FoodRecordFilters = {
  animalId?: string;
  category?: AnimalCategory;
  foodName?: string;
  dateFrom?: Date;
  dateTo?: Date;
};
