"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ANIMAL_CATEGORIES, ANIMAL_CATEGORY_LABELS } from "@/types/animal";
import type { Animal } from "@/types/animal";
import { createAnimalAction, updateAnimalAction } from "@/lib/actions/animals";
import type { AnimalFormState } from "@/lib/actions/animals";

const initialState: AnimalFormState = { success: false };

export function AnimalForm({ animal }: { animal?: Animal }) {
  const isEdit = Boolean(animal);
  const router = useRouter();

  const action = isEdit
    ? updateAnimalAction.bind(null, animal!.id)
    : createAnimalAction;

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <Field
        label="Animal ID"
        htmlFor="id"
        error={state.fieldErrors?.id?.[0]}
      >
        <Input
          id="id"
          name="id"
          defaultValue={animal?.id}
          disabled={isEdit}
          placeholder="e.g. BUFF-001"
          invalid={Boolean(state.fieldErrors?.id)}
          required
        />
        {isEdit && (
          <p className="text-xs text-[var(--color-text-faint)]">
            The Animal ID cannot be changed after creation.
          </p>
        )}
      </Field>

      <Field
        label="Name"
        htmlFor="name"
        optional
        error={state.fieldErrors?.name?.[0]}
      >
        <Input
          id="name"
          name="name"
          defaultValue={animal?.name ?? ""}
          placeholder="e.g. Bella"
          invalid={Boolean(state.fieldErrors?.name)}
        />
      </Field>

      <Field
        label="Category"
        htmlFor="category"
        error={state.fieldErrors?.category?.[0]}
      >
        <Select
          id="category"
          name="category"
          defaultValue={animal?.category ?? ""}
          invalid={Boolean(state.fieldErrors?.category)}
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {ANIMAL_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {ANIMAL_CATEGORY_LABELS[category]}
            </option>
          ))}
        </Select>
      </Field>

      {state.error && (
        <p className="text-sm text-[var(--color-danger)]">{state.error}</p>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : isEdit ? "Save changes" : "Add animal"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
