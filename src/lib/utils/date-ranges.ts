/**
 * Pure date-range helpers used by the dashboard's aggregation queries.
 * All boundaries are UTC-day-aligned, matching how record dates are stored
 * (an <input type="date"> value like "2026-09-10" parses to UTC midnight).
 * `now` is an injectable parameter specifically so these are testable
 * without depending on the real current time.
 */

export function startOfUTCDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Inclusive-from, exclusive-to range covering the last `days` days, ending today. */
export function getDateRange(days: number, now: Date = new Date()): { from: Date; to: Date } {
  const todayStart = startOfUTCDay(now);
  const from = new Date(todayStart);
  from.setUTCDate(from.getUTCDate() - (days - 1));
  const to = new Date(todayStart);
  to.setUTCDate(to.getUTCDate() + 1); // exclusive upper bound = start of tomorrow
  return { from, to };
}

export function getTodayRange(now: Date = new Date()): { from: Date; to: Date } {
  return getDateRange(1, now);
}

/** Enumerate `count` consecutive UTC days starting at `from`. */
export function enumerateDays(from: Date, count: number): Date[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from);
    d.setUTCDate(d.getUTCDate() + i);
    return d;
  });
}

/** YYYY-MM-DD key for grouping/matching records by day. */
export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Fill in every day in `days` with its matching value from `values`,
 * defaulting to 0 for days with no entry. Generic over what the value
 * represents (a sum, a count, ...) — callers must pre-aggregate so there's
 * at most one entry per day (e.g. via a Prisma `groupBy` on `date`), since
 * this does not sum duplicates itself.
 */
export function buildDailySeries(
  values: { date: Date; value: number }[],
  days: Date[],
): { date: string; value: number }[] {
  const byKey = new Map(values.map((v) => [toDateKey(v.date), v.value]));
  return days.map((day) => {
    const key = toDateKey(day);
    return { date: key, value: byKey.get(key) ?? 0 };
  });
}

export type DateRangePreset = "today" | "7d" | "30d" | "custom";

/**
 * Resolve a UI date-range preset (or an explicit custom range) into
 * concrete from/to bounds plus a day count, for use in analytics queries
 * and average-per-day calculations. Falls back to the last 7 days if
 * "custom" is selected without a valid from/to pair, so callers always get
 * a usable range rather than having to handle an error case.
 */
export function resolveDateRange(
  preset: DateRangePreset,
  custom?: { from?: string; to?: string },
  now: Date = new Date(),
): { from: Date; to: Date; days: number } {
  if (preset === "today") {
    const { from, to } = getTodayRange(now);
    return { from, to, days: 1 };
  }
  if (preset === "7d") {
    return { ...getDateRange(7, now), days: 7 };
  }
  if (preset === "30d") {
    return { ...getDateRange(30, now), days: 30 };
  }

  const parsedFrom = custom?.from ? startOfUTCDay(new Date(custom.from)) : undefined;
  const parsedTo = custom?.to ? startOfUTCDay(new Date(custom.to)) : undefined;

  if (
    !parsedFrom ||
    !parsedTo ||
    Number.isNaN(parsedFrom.getTime()) ||
    Number.isNaN(parsedTo.getTime()) ||
    parsedFrom.getTime() > parsedTo.getTime()
  ) {
    return { ...getDateRange(7, now), days: 7 };
  }

  const toExclusive = new Date(parsedTo);
  toExclusive.setUTCDate(toExclusive.getUTCDate() + 1);
  const days = Math.round((toExclusive.getTime() - parsedFrom.getTime()) / 86_400_000);
  return { from: parsedFrom, to: toExclusive, days };
}
