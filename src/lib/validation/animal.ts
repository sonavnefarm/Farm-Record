import { z } from "zod";
import { ANIMAL_CATEGORIES } from "@/types/animal";

// Animal ID rule: required, unique (uniqueness enforced at the DB layer),
// short human-entered code like "BUFF-001". Kept permissive on exact format
// (spec doesn't mandate one) but rejects whitespace and empty strings.
const animalIdSchema = z
  .string()
  .trim()
  .min(1, "Animal ID is required.")
  .max(40, "Animal ID must be 40 characters or fewer.")
  .regex(/^\S+$/, "Animal ID cannot contain spaces.");

export const createAnimalSchema = z.object({
  id: animalIdSchema,
  name: z
    .string()
    .trim()
    .max(80, "Name must be 80 characters or fewer.")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  category: z.enum(ANIMAL_CATEGORIES, {
    message: "Category is required.",
  }),
});

export type CreateAnimalInput = z.infer<typeof createAnimalSchema>;

// Editing never changes the Animal ID (it's the stable identifier used in
// URLs and every related record) — only name and category can change.
export const updateAnimalSchema = z.object({
  name: z
    .string()
    .trim()
    .max(80, "Name must be 80 characters or fewer.")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  category: z.enum(ANIMAL_CATEGORIES, {
    message: "Category is required.",
  }),
});

export type UpdateAnimalInput = z.infer<typeof updateAnimalSchema>;
