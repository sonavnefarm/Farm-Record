import { ANIMAL_CATEGORIES, ANIMAL_CATEGORY_LABELS } from "@/types/animal";
import type { AnimalCategory } from "@/types/animal";
import { StatCard } from "@/components/dashboard/StatCard";

export function ByCategoryStats({
  data,
  formatValue = (v) => v.toFixed(2),
}: {
  data: Record<AnimalCategory, number>;
  formatValue?: (value: number) => string;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {ANIMAL_CATEGORIES.map((category) => (
        <StatCard
          key={category}
          label={ANIMAL_CATEGORY_LABELS[category]}
          value={formatValue(data[category])}
        />
      ))}
    </div>
  );
}
