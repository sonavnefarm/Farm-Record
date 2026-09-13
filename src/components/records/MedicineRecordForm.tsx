"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { toDateInputValue } from "@/lib/utils/date";
import { createMedicineRecordAction, updateMedicineRecordAction } from "@/lib/actions/medicine";
import type { MedicineFormState } from "@/lib/actions/medicine";
import type { MedicineRecord } from "@/types/medicine";
import type { Animal } from "@/types/animal";

const initialState: MedicineFormState = { success: false };

export function MedicineRecordForm({
  animals,
  record,
  onDone,
}: {
  animals: Pick<Animal, "id" | "name" | "category">[];
  record?: MedicineRecord;
  onDone?: () => void;
}) {
  const isEdit = Boolean(record);
  const action = isEdit
    ? updateMedicineRecordAction.bind(null, record!.id)
    : createMedicineRecordAction;

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

      <div className="w-full sm:w-56">
        <Field label="Medicine Name" htmlFor="medicineName" error={state.fieldErrors?.medicineName?.[0]}>
          <Input
            id="medicineName"
            name="medicineName"
            defaultValue={record?.medicineName ?? ""}
            placeholder="e.g. Medicine A"
            invalid={Boolean(state.fieldErrors?.medicineName)}
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
