import Link from "next/link";
import { Wheat, Milk, Syringe } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils/date";
import type { RecentActivityItem } from "@/types/dashboard";

const ICONS = { food: Wheat, milk: Milk, medicine: Syringe } as const;
const LABELS = { food: "Food", milk: "Milk", medicine: "Medicine" } as const;

export function RecentActivityList({ items }: { items: RecentActivityItem[] }) {
  return (
    <Panel>
      <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Recent Activity</h2>
      {items.length === 0 ? (
        <EmptyState
          title="No activity yet"
          description="Recently added food, milk, and medicine records will appear here."
        />
      ) : (
        <ul className="flex flex-col divide-y divide-[var(--color-border)]">
          {items.map((item) => {
            const Icon = ICONS[item.type];
            return (
              <li key={`${item.type}-${item.id}`} className="flex items-center gap-3 py-2.5">
                <Icon size={16} strokeWidth={1.75} className="shrink-0 text-[var(--color-text-faint)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-[var(--color-text)]">
                    <span className="text-[var(--color-text-muted)]">{LABELS[item.type]}</span>{" "}
                    — {item.detail}
                  </p>
                  <p className="text-xs text-[var(--color-text-faint)]">
                    <Link href={`/animals/${item.animalId}`} className="hover:underline">
                      {item.animalId}
                      {item.animalName ? ` — ${item.animalName}` : ""}
                    </Link>{" "}
                    · {formatDate(item.date)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
