/** Format a Date as e.g. "10 Sep 2026" for display in tables and headers. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Format a Date as YYYY-MM-DD for use as an <input type="date"> value. */
export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}
