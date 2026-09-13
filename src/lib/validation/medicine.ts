import { z } from "zod";

// Kept intentionally minimal per FEATURES.md §5 — this is a simple history
// log, not a medical management system. No dosage, duration, vet,
// diagnosis, prescription, pharmacy, or cost fields.
export const createMedicineRecordSchema = z.object({
  animalId: z.string().trim().min(1, "Animal is required."),
  date: z
    .string()
    .trim()
    .min(1, "Date is required.")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date."),
  medicineName: z
    .string()
    .trim()
    .min(1, "Medicine name is required.")
    .max(80, "Medicine name must be 80 characters or fewer."),
});

export type CreateMedicineRecordInput = z.infer<typeof createMedicineRecordSchema>;

export const updateMedicineRecordSchema = createMedicineRecordSchema;
export type UpdateMedicineRecordInput = z.infer<typeof updateMedicineRecordSchema>;
