"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { toDateInputValue } from "@/lib/utils/date";
import { createFoodRecordAction, updateFoodRecordAction } from "@/lib/actions/food";
import type { FoodFormState } from "@/lib/actions/food";
import type { FoodRecord } from "@/types/food";
import type { Animal } from "@/types/animal";

const initialState: FoodFormState = { success: false };

export function FoodRecordForm({
  animals,
  record,
  onDone,
}: {
  animals: Pick<Animal, "id" | "name" | "category">[];
  record?: FoodRecord;
  onDone?: () => void;
}) {
  const isEdit = Boolean(record);
  const action = isEdit
    ? updateFoodRecordAction.bind(null, record!.id)
    : createFoodRecordAction;

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="w-full sm:w-48">
        <Field label="Animal" htmlFor="animalId" error={state.fieldErrors?.animalId?.[0]}>
          <Select
            id="animalId"
            name="animalId"
            defaultValue={record?.animalId ?? ""}
            invalid={Boolean(state.fieldErrors?.animalId)}
            required
          >
            <option value="" disabled>
              Select animal
            </option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.id}
                {animal.name ? ` — ${animal.name}` : ""}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="w-full sm:w-40">
        <Field label="Date" htmlFor="date" error={state.fieldErrors?.date?.[0]}>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={record ? toDateInputValue(record.date) : toDateInputValue(new Date())}
            invalid={Boolean(state.fieldErrors?.date)}
            required
          />
        </Field>
      </div>

      <div className="w-full sm:w-48">
        <Field label="Food Name" htmlFor="foodName" optional error={state.fieldErrors?.foodName?.[0]}>
          <Input
            id="foodName"
            name="foodName"
            defaultValue={record?.foodName ?? ""}
            placeholder="e.g. Green Fodder"
            invalid={Boolean(state.fieldErrors?.foodName)}
          />
        </Field>
      </div>

      <div className="w-full sm:w-32">
        <Field label="Quantity (kg)" htmlFor="quantity" error={state.fieldErrors?.quantity?.[0]}>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={record?.quantity}
            invalid={Boolean(state.fieldErrors?.quantity)}
            required
          />
        </Field>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : isEdit ? "Save changes" : "Add record"}
        </Button>
        {onDone && (
          <Button type="button" variant="secondary" onClick={onDone}>
            Cancel
          </Button>
        )}
      </div>

      {state.error && (
        <p className="w-full text-sm text-[var(--color-danger)]">{state.error}</p>
      )}
    </form>
  );
}
