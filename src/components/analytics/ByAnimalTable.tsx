import Link from "next/link";
import { ANIMAL_CATEGORY_LABELS } from "@/types/animal";
import type { ByAnimalTotal } from "@/lib/analytics";

export function ByAnimalTable({
  data,
  valueLabel,
  formatValue = (v) => v.toFixed(2),
}: {
  data: ByAnimalTotal[];
  valueLabel: string;
  formatValue?: (value: number) => string;
}) {
  if (data.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">No data for this range yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
      <table className="w-full text-left text-sm" aria-label={`Breakdown by animal — ${valueLabel}`}>
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-medium text-[var(--color-text-muted)]">
            <th className="px-4 py-2.5 font-medium">Animal</th>
            <th className="px-4 py-2.5 font-medium">Category</th>
            <th className="px-4 py-2.5 font-medium">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.animalId}
              className="border-b border-[var(--color-border)] bg-[var(--color-surface)] last:border-b-0"
            >
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[13px]">
                <Link href={`/animals/${row.animalId}`} className="text-[var(--color-accent-hover)] hover:underline">
                  {row.animalId}
                </Link>
                {row.animalName && (
                  <span className="ml-1.5 font-sans text-[var(--color-text-muted)]">{row.animalName}</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-[var(--color-text)]">
                {row.category ? ANIMAL_CATEGORY_LABELS[row.category] : "—"}
              </td>
              <td className="px-4 py-2.5 font-mono text-[13px] text-[var(--color-text)]">
                {formatValue(row.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
