import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/date";
import { deleteFoodRecordAction } from "@/lib/actions/food";
import type { FoodRecordWithAnimal } from "@/types/food";

export function FoodRecordsTable({ records }: { records: FoodRecordWithAnimal[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-medium text-[var(--color-text-muted)]">
            <th className="px-4 py-2.5 font-medium">Date</th>
            <th className="px-4 py-2.5 font-medium">Animal</th>
            <th className="px-4 py-2.5 font-medium">Food Name</th>
            <th className="px-4 py-2.5 font-medium">Quantity (kg)</th>
            <th className="px-4 py-2.5 font-medium" />
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="border-b border-[var(--color-border)] bg-[var(--color-surface)] last:border-b-0 hover:bg-[var(--color-bg)]"
            >
              <td className="whitespace-nowrap px-4 py-2.5 text-[var(--color-text)]">
                {formatDate(record.date)}
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[13px]">
                <Link
                  href={`/animals/${record.animal.id}`}
                  className="text-[var(--color-accent-hover)] hover:underline"
                >
                  {record.animal.id}
                </Link>
                {record.animal.name && (
                  <span className="ml-1.5 font-sans text-[var(--color-text-muted)]">
                    {record.animal.name}
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 text-[var(--color-text)]">
                {record.foodName || (
                  <span className="text-[var(--color-text-faint)]">—</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[13px] text-[var(--color-text)]">
                {record.quantity.toFixed(2)}
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 text-right">
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/records/food/${record.id}/edit`}
                    aria-label="Edit record"
                    className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
                  >
                    <Pencil size={15} />
                  </Link>
                  <form action={deleteFoodRecordAction.bind(null, record.id, record.animal.id)}>
                    <button
                      type="submit"
                      aria-label="Delete record"
                      className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
