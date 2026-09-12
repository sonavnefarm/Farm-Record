"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAnimalSchema, updateAnimalSchema } from "@/lib/validation/animal";
import {
  createAnimal,
  updateAnimal,
  deactivateAnimal,
  reactivateAnimal,
} from "@/lib/services/animals";
import { ConflictError, ValidationError } from "@/lib/errors";

export type AnimalFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createAnimalAction(
  _prevState: AnimalFormState,
  formData: FormData,
): Promise<AnimalFormState> {
  const parsed = createAnimalSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name") ?? undefined,
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createAnimal(parsed.data);
  } catch (error) {
    if (error instanceof ConflictError) {
      return { success: false, error: error.message };
    }
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fieldErrors: error.fieldErrors };
    }
    console.error(error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath("/animals");
  redirect(`/animals/${parsed.data.id}`);
}

export async function updateAnimalAction(
  animalId: string,
  _prevState: AnimalFormState,
  formData: FormData,
): Promise<AnimalFormState> {
  const parsed = updateAnimalSchema.safeParse({
    name: formData.get("name") ?? undefined,
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateAnimal(animalId, parsed.data);
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath("/animals");
  revalidatePath(`/animals/${animalId}`);
  redirect(`/animals/${animalId}`);
}

export async function deactivateAnimalAction(animalId: string): Promise<void> {
  await deactivateAnimal(animalId);
  revalidatePath("/animals");
  revalidatePath(`/animals/${animalId}`);
}

export async function reactivateAnimalAction(animalId: string): Promise<void> {
  await reactivateAnimal(animalId);
  revalidatePath("/animals");
  revalidatePath(`/animals/${animalId}`);
}
