import { z } from "zod";

// Note: totalMilk is intentionally NOT part of this schema. It is always
// computed server-side from morningMilk + eveningMilk (see src/lib/milk.ts)
// and must never be accepted as user input — see FEATURES.md §4 and
// DECISIONS.md.
export const createMilkRecordSchema = z.object({
  animalId: z.string().trim().min(1, "Animal is required."),
  date: z
    .string()
    .trim()
    .min(1, "Date is required.")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date."),
  morningMilk: z.coerce
    .number({ message: "Morning milk is required." })
    .min(0, "Morning milk cannot be negative."),
  eveningMilk: z.coerce
    .number({ message: "Evening milk is required." })
    .min(0, "Evening milk cannot be negative."),
});

export type CreateMilkRecordInput = z.infer<typeof createMilkRecordSchema>;

export const updateMilkRecordSchema = createMilkRecordSchema;
export type UpdateMilkRecordInput = z.infer<typeof updateMilkRecordSchema>;
