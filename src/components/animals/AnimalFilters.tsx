"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { ANIMAL_CATEGORIES, ANIMAL_CATEGORY_LABELS, ANIMAL_STATUSES, ANIMAL_STATUS_LABELS } from "@/types/animal";

export function AnimalFilters() {
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

      <Select
        aria-label="Filter by status"
        className="w-auto"
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
      >
        <option value="">All statuses</option>
        {ANIMAL_STATUSES.map((status) => (
          <option key={status} value={status}>
            {ANIMAL_STATUS_LABELS[status]}
          </option>
        ))}
      </Select>
    </div>
  );
}
