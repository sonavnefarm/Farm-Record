import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[var(--color-border-strong)] px-6 py-14 text-center">
      {Icon && <Icon size={22} strokeWidth={1.5} className="mb-1 text-[var(--color-text-faint)]" />}
      <p className="text-sm font-medium text-[var(--color-text)]">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-[var(--color-text-muted)]">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
