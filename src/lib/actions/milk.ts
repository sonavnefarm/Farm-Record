"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createMilkRecordSchema, updateMilkRecordSchema } from "@/lib/validation/milk";
import {
  createMilkRecord,
  updateMilkRecord,
  deleteMilkRecord,
} from "@/lib/services/milk";
import { NotFoundError } from "@/lib/errors";

export type MilkFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createMilkRecordAction(
  _prevState: MilkFormState,
  formData: FormData,
): Promise<MilkFormState> {
  const parsed = createMilkRecordSchema.safeParse({
    animalId: formData.get("animalId"),
    date: formData.get("date"),
    morningMilk: formData.get("morningMilk"),
    eveningMilk: formData.get("eveningMilk"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createMilkRecord(parsed.data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message };
    }
    console.error(error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath("/records/milk");
  revalidatePath(`/animals/${parsed.data.animalId}`);
  redirect("/records/milk");
}

export async function updateMilkRecordAction(
  recordId: string,
  _prevState: MilkFormState,
  formData: FormData,
): Promise<MilkFormState> {
  const parsed = updateMilkRecordSchema.safeParse({
    animalId: formData.get("animalId"),
    date: formData.get("date"),
    morningMilk: formData.get("morningMilk"),
    eveningMilk: formData.get("eveningMilk"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateMilkRecord(recordId, parsed.data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message };
    }
    console.error(error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath("/records/milk");
  revalidatePath(`/animals/${parsed.data.animalId}`);
  redirect("/records/milk");
}

export async function deleteMilkRecordAction(
  recordId: string,
  animalId: string,
): Promise<void> {
  await deleteMilkRecord(recordId);
  revalidatePath("/records/milk");
  revalidatePath(`/animals/${animalId}`);
}
