import type { AnimalCategory } from "@/types/animal";

export type MedicineRecord = {
  id: string;
  animalId: string;
  date: Date;
  medicineName: string;
  createdAt: Date;
  updatedAt: Date;
};

// Enriched shape used by list views that need the animal's name/category
// alongside the record, without denormalizing that data into the DB row
// (see DATABASE.md — never store animalName/animalCategory on records).
export type MedicineRecordWithAnimal = MedicineRecord & {
  animal: { id: string; name: string | null; category: AnimalCategory };
};

export type MedicineRecordFilters = {
  animalId?: string;
  category?: AnimalCategory;
  dateFrom?: Date;
  dateTo?: Date;
};
