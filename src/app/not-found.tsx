import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center">
      <FileQuestion size={22} strokeWidth={1.5} className="text-[var(--color-text-faint)]" />
      <p className="text-sm font-medium text-[var(--color-text)]">
        Page not found
      </p>
      <p className="max-w-sm text-sm text-[var(--color-text-muted)]">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex h-9 items-center justify-center rounded-md bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
