"use client";

import { useActionState, useState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { toDateInputValue } from "@/lib/utils/date";
import { computeTotalMilk } from "@/lib/milk";
import { createMilkRecordAction, updateMilkRecordAction } from "@/lib/actions/milk";
import type { MilkFormState } from "@/lib/actions/milk";
import type { MilkRecord } from "@/types/milk";
import type { Animal } from "@/types/animal";

const initialState: MilkFormState = { success: false };

export function MilkRecordForm({
  animals,
  record,
  onDone,
}: {
  animals: Pick<Animal, "id" | "name" | "category">[];
  record?: MilkRecord;
  onDone?: () => void;
}) {
  const isEdit = Boolean(record);
  const action = isEdit
    ? updateMilkRecordAction.bind(null, record!.id)
    : createMilkRecordAction;

  const [state, formAction, pending] = useActionState(action, initialState);

  // Total milk is never entered by the user — it's always calculated and
  // shown read-only, live, as they type (see FEATURES.md §4 / DECISIONS.md).
  const [morning, setMorning] = useState(record?.morningMilk?.toString() ?? "");
  const [evening, setEvening] = useState(record?.eveningMilk?.toString() ?? "");
  const total = computeTotalMilk(Number(morning) || 0, Number(evening) || 0);

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

      <div className="w-full sm:w-32">
        <Field label="Morning (L)" htmlFor="morningMilk" error={state.fieldErrors?.morningMilk?.[0]}>
          <Input
            id="morningMilk"
            name="morningMilk"
            type="number"
            step="0.1"
            min="0"
            value={morning}
            onChange={(e) => setMorning(e.target.value)}
            invalid={Boolean(state.fieldErrors?.morningMilk)}
            required
          />
        </Field>
      </div>

      <div className="w-full sm:w-32">
        <Field label="Evening (L)" htmlFor="eveningMilk" error={state.fieldErrors?.eveningMilk?.[0]}>
          <Input
            id="eveningMilk"
            name="eveningMilk"
            type="number"
            step="0.1"
            min="0"
            value={evening}
            onChange={(e) => setEvening(e.target.value)}
            invalid={Boolean(state.fieldErrors?.eveningMilk)}
            required
          />
        </Field>
      </div>

      <div className="w-full sm:w-32">
        <Field label="Total (L)" htmlFor="totalMilk">
          <Input
            id="totalMilk"
            value={total.toFixed(2)}
            disabled
            className="font-mono"
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
