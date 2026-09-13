"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { ANIMAL_CATEGORIES, ANIMAL_CATEGORY_LABELS } from "@/types/animal";
import type { Animal } from "@/types/animal";

export function RecordFilters({
  animals,
  showFoodName,
}: {
  animals: Pick<Animal, "id" | "name">[];
  showFoodName?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <Select
        aria-label="Filter by animal"
        className="w-auto"
        defaultValue={searchParams.get("animalId") ?? ""}
        onChange={(e) => updateParam("animalId", e.target.value)}
      >
        <option value="">All animals</option>
        {animals.map((animal) => (
          <option key={animal.id} value={animal.id}>
            {animal.id}
            {animal.name ? ` — ${animal.name}` : ""}
          </option>
        ))}
      </Select>

      <Select
        aria-label="Filter by category"
        className="w-auto"
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
      >
        <option value="">All categories</option>
        {ANIMAL_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {ANIMAL_CATEGORY_LABELS[category]}
          </option>
        ))}
      </Select>

      {showFoodName && (
        <Input
          aria-label="Filter by food name"
          className="w-auto"
          placeholder="Food name"
          defaultValue={searchParams.get("foodName") ?? ""}
          onBlur={(e) => updateParam("foodName", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              updateParam("foodName", e.currentTarget.value);
            }
          }}
        />
      )}

      <Input
        aria-label="From date"
        type="date"
        className="w-auto"
        defaultValue={searchParams.get("dateFrom") ?? ""}
        onChange={(e) => updateParam("dateFrom", e.target.value)}
      />
      <Input
        aria-label="To date"
        type="date"
        className="w-auto"
        defaultValue={searchParams.get("dateTo") ?? ""}
        onChange={(e) => updateParam("dateTo", e.target.value)}
      />
    </div>
  );
}
