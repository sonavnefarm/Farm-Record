"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f6f7f5] px-6 text-center font-sans">
        <p className="text-sm font-medium text-[#1c231d]">
          Something went wrong
        </p>
        <p className="max-w-sm text-sm text-[#5b665f]">
          The application couldn&apos;t load. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-2 inline-flex h-9 items-center justify-center rounded-md border border-[#c9cdc4] bg-white px-4 text-sm font-medium text-[#1c231d] hover:bg-[#f6f7f5]"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
