import { cn } from "@/lib/utils/cn";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export function Select({ invalid, className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-9 w-full rounded-md border bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)]",
        invalid
          ? "border-[var(--color-danger)]"
          : "border-[var(--color-border-strong)]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
