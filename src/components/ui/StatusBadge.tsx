import { cn } from "@/lib/utils/cn";
import type { AnimalStatus } from "@/types/animal";
import { ANIMAL_STATUS_LABELS } from "@/types/animal";

export function StatusBadge({ status }: { status: AnimalStatus }) {
  const active = status === "ACTIVE";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-[var(--color-accent)]" : "bg-[var(--color-text-faint)]",
        )}
        aria-hidden
      />
      {ANIMAL_STATUS_LABELS[status]}
    </span>
  );
}
