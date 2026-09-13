import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";
import type {
  MedicineRecord,
  MedicineRecordFilters,
  MedicineRecordWithAnimal,
} from "@/types/medicine";
import type {
  CreateMedicineRecordInput,
  UpdateMedicineRecordInput,
} from "@/lib/validation/medicine";
import { getAnimal } from "@/lib/services/animals";

// Unlike Food/Milk, MedicineRecord has no Decimal fields, so no
// plain-number conversion is needed at the service boundary here.

export async function listMedicineRecords(
  filters: MedicineRecordFilters = {},
): Promise<MedicineRecordWithAnimal[]> {
  return prisma.medicineRecord.findMany({
    where: {
      ...(filters.animalId ? { animalId: filters.animalId } : {}),
      ...(filters.category ? { animal: { category: filters.category } } : {}),
      ...(filters.dateFrom || filters.dateTo
        ? {
            date: {
              ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
              ...(filters.dateTo ? { lte: filters.dateTo } : {}),
            },
          }
        : {}),
    },
    include: { animal: { select: { id: true, name: true, category: true } } },
    orderBy: { date: "desc" },
  });
}

export async function getAnimalMedicineHistory(animalId: string): Promise<MedicineRecord[]> {
  return prisma.medicineRecord.findMany({
    where: { animalId },
    orderBy: { date: "desc" },
  });
}

export async function getMedicineRecord(id: string): Promise<MedicineRecord> {
  const record = await prisma.medicineRecord.findUnique({ where: { id } });
  if (!record) {
    throw new NotFoundError("This medicine record no longer exists.");
  }
  return record;
}

export async function createMedicineRecord(
  input: CreateMedicineRecordInput,
): Promise<MedicineRecord> {
  await getAnimal(input.animalId); // throws NotFoundError if the animal doesn't exist

  return prisma.medicineRecord.create({
    data: {
      animalId: input.animalId,
      date: new Date(input.date),
      medicineName: input.medicineName,
    },
  });
}

export async function updateMedicineRecord(
  id: string,
  input: UpdateMedicineRecordInput,
): Promise<MedicineRecord> {
  await getMedicineRecord(id); // throws NotFoundError if missing
  await getAnimal(input.animalId);

  return prisma.medicineRecord.update({
    where: { id },
    data: {
      animalId: input.animalId,
      date: new Date(input.date),
      medicineName: input.medicineName,
    },
  });
}

export async function deleteMedicineRecord(id: string): Promise<void> {
  await getMedicineRecord(id); // throws NotFoundError if missing
  await prisma.medicineRecord.delete({ where: { id } });
}
