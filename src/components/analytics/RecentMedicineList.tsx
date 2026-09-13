import Link from "next/link";
import { formatDate } from "@/lib/utils/date";
import type { RecentMedicineRecord } from "@/types/analytics";

export function RecentMedicineList({ records }: { records: RecentMedicineRecord[] }) {
  if (records.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">No medicine records yet.</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-[var(--color-border)]">
      {records.map((record) => (
        <li key={record.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
          <div>
            <span className="text-[var(--color-text)]">{record.medicineName}</span>{" "}
            <span className="text-[var(--color-text-faint)]">— {formatDate(record.date)}</span>
          </div>
          <Link
            href={`/animals/${record.animalId}`}
            className="whitespace-nowrap font-mono text-[13px] text-[var(--color-accent-hover)] hover:underline"
          >
            {record.animalId}
          </Link>
        </li>
      ))}
    </ul>
  );
}
