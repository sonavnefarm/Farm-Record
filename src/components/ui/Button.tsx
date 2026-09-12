import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
        variant === "secondary" &&
          "border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-bg)]",
        className,
      )}
      {...props}
    />
  );
}
