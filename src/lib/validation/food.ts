import { z } from "zod";

export const createFoodRecordSchema = z.object({
  animalId: z.string().trim().min(1, "Animal is required."),
  date: z
    .string()
    .trim()
    .min(1, "Date is required.")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date."),
  foodName: z
    .string()
    .trim()
    .max(80, "Food name must be 80 characters or fewer.")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  quantity: z.coerce
    .number({ message: "Quantity is required." })
    .positive("Quantity must be greater than 0."),
});

export type CreateFoodRecordInput = z.infer<typeof createFoodRecordSchema>;

export const updateFoodRecordSchema = createFoodRecordSchema;
export type UpdateFoodRecordInput = z.infer<typeof updateFoodRecordSchema>;
