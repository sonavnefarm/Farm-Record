import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";
import { computeTotalMilk } from "@/lib/milk";
import type { MilkRecord, MilkRecordFilters, MilkRecordWithAnimal } from "@/types/milk";
import type { CreateMilkRecordInput, UpdateMilkRecordInput } from "@/lib/validation/milk";
import { getAnimal } from "@/lib/services/animals";

// Prisma's Decimal fields come back as Decimal.js instances, which aren't
// plain-serializable across the Server->Client Component boundary. Convert
// to plain numbers at the service boundary (same approach as food.ts).
function toPlainMilkValues<T extends { morningMilk: unknown; eveningMilk: unknown; totalMilk: unknown }>(
  record: T,
): Omit<T, "morningMilk" | "eveningMilk" | "totalMilk"> & {
  morningMilk: number;
  eveningMilk: number;
  totalMilk: number;
} {
  return {
    ...record,
    morningMilk: Number(record.morningMilk),
    eveningMilk: Number(record.eveningMilk),
    totalMilk: Number(record.totalMilk),
  };
}

export async function listMilkRecords(
  filters: MilkRecordFilters = {},
): Promise<MilkRecordWithAnimal[]> {
  const records = await prisma.milkRecord.findMany({
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
  return records.map(toPlainMilkValues) as MilkRecordWithAnimal[];
}

export async function getAnimalMilkHistory(animalId: string): Promise<MilkRecord[]> {
  const records = await prisma.milkRecord.findMany({
    where: { animalId },
    orderBy: { date: "desc" },
  });
  return records.map(toPlainMilkValues);
}

export async function getMilkRecord(id: string): Promise<MilkRecord> {
  const record = await prisma.milkRecord.findUnique({ where: { id } });
  if (!record) {
    throw new NotFoundError("This milk record no longer exists.");
  }
  return toPlainMilkValues(record);
}

export async function createMilkRecord(input: CreateMilkRecordInput): Promise<MilkRecord> {
  await getAnimal(input.animalId); // throws NotFoundError if the animal doesn't exist

  const record = await prisma.milkRecord.create({
    data: {
      animalId: input.animalId,
      date: new Date(input.date),
      morningMilk: input.morningMilk,
      eveningMilk: input.eveningMilk,
      totalMilk: computeTotalMilk(input.morningMilk, input.eveningMilk),
    },
  });
  return toPlainMilkValues(record);
}

export async function updateMilkRecord(
  id: string,
  input: UpdateMilkRecordInput,
): Promise<MilkRecord> {
  await getMilkRecord(id); // throws NotFoundError if missing
  await getAnimal(input.animalId);

  const record = await prisma.milkRecord.update({
    where: { id },
    data: {
      animalId: input.animalId,
      date: new Date(input.date),
      morningMilk: input.morningMilk,
      eveningMilk: input.eveningMilk,
      totalMilk: computeTotalMilk(input.morningMilk, input.eveningMilk),
    },
  });
  return toPlainMilkValues(record);
}

export async function deleteMilkRecord(id: string): Promise<void> {
  await getMilkRecord(id); // throws NotFoundError if missing
  await prisma.milkRecord.delete({ where: { id } });
}
