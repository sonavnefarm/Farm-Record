export function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--color-text)]">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-[var(--color-text-faint)]">
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
