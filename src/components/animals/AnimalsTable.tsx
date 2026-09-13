import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ANIMAL_CATEGORY_LABELS } from "@/types/animal";
import type { Animal } from "@/types/animal";

export function AnimalsTable({ animals }: { animals: Animal[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
      <table className="w-full text-left text-sm" aria-label="Animals">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-medium text-[var(--color-text-muted)]">
            <th className="px-4 py-2.5 font-medium">Animal ID</th>
            <th className="px-4 py-2.5 font-medium">Name</th>
            <th className="px-4 py-2.5 font-medium">Category</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {animals.map((animal) => (
            <tr
              key={animal.id}
              className="border-b border-[var(--color-border)] bg-[var(--color-surface)] last:border-b-0 hover:bg-[var(--color-bg)]"
            >
              <td className="px-4 py-2.5 font-mono text-[13px]">
                <Link
                  href={`/animals/${animal.id}`}
                  className="text-[var(--color-accent-hover)] hover:underline"
                >
                  {animal.id}
                </Link>
              </td>
              <td className="px-4 py-2.5 text-[var(--color-text)]">
                {animal.name || (
                  <span className="text-[var(--color-text-faint)]">—</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-[var(--color-text)]">
                {ANIMAL_CATEGORY_LABELS[animal.category]}
              </td>
              <td className="px-4 py-2.5">
                <StatusBadge status={animal.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
