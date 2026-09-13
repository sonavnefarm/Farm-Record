import type { AnimalCategory } from "@/types/animal";

export type MilkRecord = {
  id: string;
  animalId: string;
  date: Date;
  morningMilk: number;
  eveningMilk: number;
  totalMilk: number;
  createdAt: Date;
  updatedAt: Date;
};

// Enriched shape used by list views that need the animal's name/category
// alongside the record, without denormalizing that data into the DB row
// (see DATABASE.md — never store animalName/animalCategory on records).
export type MilkRecordWithAnimal = MilkRecord & {
  animal: { id: string; name: string | null; category: AnimalCategory };
};

export type MilkRecordFilters = {
  animalId?: string;
  category?: AnimalCategory;
  dateFrom?: Date;
  dateTo?: Date;
};
