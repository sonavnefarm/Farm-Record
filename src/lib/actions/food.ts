"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createFoodRecordSchema, updateFoodRecordSchema } from "@/lib/validation/food";
import {
  createFoodRecord,
  updateFoodRecord,
  deleteFoodRecord,
} from "@/lib/services/food";
import { NotFoundError, ValidationError } from "@/lib/errors";

export type FoodFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createFoodRecordAction(
  _prevState: FoodFormState,
  formData: FormData,
): Promise<FoodFormState> {
  const parsed = createFoodRecordSchema.safeParse({
    animalId: formData.get("animalId"),
    date: formData.get("date"),
    foodName: formData.get("foodName") ?? undefined,
    quantity: formData.get("quantity"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createFoodRecord(parsed.data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message };
    }
    console.error(error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath("/records/food");
  revalidatePath(`/animals/${parsed.data.animalId}`);
  redirect("/records/food");
}

export async function updateFoodRecordAction(
  recordId: string,
  _prevState: FoodFormState,
  formData: FormData,
): Promise<FoodFormState> {
  const parsed = updateFoodRecordSchema.safeParse({
    animalId: formData.get("animalId"),
    date: formData.get("date"),
    foodName: formData.get("foodName") ?? undefined,
    quantity: formData.get("quantity"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateFoodRecord(recordId, parsed.data);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      return { success: false, error: error.message };
    }
    console.error(error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath("/records/food");
  revalidatePath(`/animals/${parsed.data.animalId}`);
  redirect("/records/food");
}

export async function deleteFoodRecordAction(
  recordId: string,
  animalId: string,
): Promise<void> {
  await deleteFoodRecord(recordId);
  revalidatePath("/records/food");
  revalidatePath(`/animals/${animalId}`);
}
