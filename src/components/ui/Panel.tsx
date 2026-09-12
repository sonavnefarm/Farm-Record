import { cn } from "@/lib/utils/cn";

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
