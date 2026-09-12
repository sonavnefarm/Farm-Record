"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the full error server-side / to the console for diagnosis.
    // Never render error.message directly if it might contain raw
    // database or stack details — this UI is intentionally generic.
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center">
      <AlertTriangle size={22} strokeWidth={1.5} className="text-[var(--color-danger)]" />
      <p className="text-sm font-medium text-[var(--color-text)]">
        Something went wrong
      </p>
      <p className="max-w-sm text-sm text-[var(--color-text-muted)]">
        This page couldn&apos;t load. Try again, and if the problem
        continues, come back later.
      </p>
      <Button variant="secondary" className="mt-2" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
