import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ invalid, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)]",
        invalid
          ? "border-[var(--color-danger)]"
          : "border-[var(--color-border-strong)]",
        className,
      )}
      {...props}
    />
  );
}
