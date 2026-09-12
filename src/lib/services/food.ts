import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";
import type { FoodRecord, FoodRecordFilters, FoodRecordWithAnimal } from "@/types/food";
import type { CreateFoodRecordInput, UpdateFoodRecordInput } from "@/lib/validation/food";
import { getAnimal } from "@/lib/services/animals";

// Prisma's Decimal fields come back as Decimal.js instances, which aren't
// plain-serializable across the Server->Client Component boundary. Convert
// to a plain number at the service boundary so every layer above this one
// only ever deals with plain, serializable data.
function toPlainQuantity<T extends { quantity: unknown }>(
  record: T,
): Omit<T, "quantity"> & { quantity: number } {
  return { ...record, quantity: Number(record.quantity) };
}

export async function listFoodRecords(
  filters: FoodRecordFilters = {},
): Promise<FoodRecordWithAnimal[]> {
  const records = await prisma.foodRecord.findMany({
    where: {
      ...(filters.animalId ? { animalId: filters.animalId } : {}),
      ...(filters.category ? { animal: { category: filters.category } } : {}),
      ...(filters.foodName ? { foodName: filters.foodName } : {}),
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
  return records.map(toPlainQuantity) as FoodRecordWithAnimal[];
}

export async function getAnimalFoodHistory(animalId: string): Promise<FoodRecord[]> {
  const records = await prisma.foodRecord.findMany({
    where: { animalId },
    orderBy: { date: "desc" },
  });
  return records.map(toPlainQuantity);
}

export async function getFoodRecord(id: string): Promise<FoodRecord> {
  const record = await prisma.foodRecord.findUnique({ where: { id } });
  if (!record) {
    throw new NotFoundError("This food record no longer exists.");
  }
  return toPlainQuantity(record);
}

export async function createFoodRecord(input: CreateFoodRecordInput): Promise<FoodRecord> {
  await getAnimal(input.animalId); // throws NotFoundError if the animal doesn't exist

  const record = await prisma.foodRecord.create({
    data: {
      animalId: input.animalId,
      date: new Date(input.date),
      foodName: input.foodName ?? null,
      quantity: input.quantity,
    },
  });
  return toPlainQuantity(record);
}

export async function updateFoodRecord(
  id: string,
  input: UpdateFoodRecordInput,
): Promise<FoodRecord> {
  await getFoodRecord(id); // throws NotFoundError if missing
  await getAnimal(input.animalId);

  const record = await prisma.foodRecord.update({
    where: { id },
    data: {
      animalId: input.animalId,
      date: new Date(input.date),
      foodName: input.foodName ?? null,
      quantity: input.quantity,
    },
  });
  return toPlainQuantity(record);
}

export async function deleteFoodRecord(id: string): Promise<void> {
  await getFoodRecord(id); // throws NotFoundError if missing
  await prisma.foodRecord.delete({ where: { id } });
}

