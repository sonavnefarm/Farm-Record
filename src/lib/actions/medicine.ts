"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createMedicineRecordSchema,
  updateMedicineRecordSchema,
} from "@/lib/validation/medicine";
import {
  createMedicineRecord,
  updateMedicineRecord,
  deleteMedicineRecord,
} from "@/lib/services/medicine";
import { NotFoundError } from "@/lib/errors";

export type MedicineFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createMedicineRecordAction(
  _prevState: MedicineFormState,
  formData: FormData,
): Promise<MedicineFormState> {
  const parsed = createMedicineRecordSchema.safeParse({
    animalId: formData.get("animalId"),
    date: formData.get("date"),
    medicineName: formData.get("medicineName"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createMedicineRecord(parsed.data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message };
    }
    console.error(error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath("/records/medicine");
  revalidatePath(`/animals/${parsed.data.animalId}`);
  redirect("/records/medicine");
}

export async function updateMedicineRecordAction(
  recordId: string,
  _prevState: MedicineFormState,
  formData: FormData,
): Promise<MedicineFormState> {
  const parsed = updateMedicineRecordSchema.safeParse({
    animalId: formData.get("animalId"),
    date: formData.get("date"),
    medicineName: formData.get("medicineName"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateMedicineRecord(recordId, parsed.data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message };
    }
    console.error(error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath("/records/medicine");
  revalidatePath(`/animals/${parsed.data.animalId}`);
  redirect("/records/medicine");
}

export async function deleteMedicineRecordAction(
  recordId: string,
  animalId: string,
): Promise<void> {
  await deleteMedicineRecord(recordId);
  revalidatePath("/records/medicine");
  revalidatePath(`/animals/${animalId}`);
}
