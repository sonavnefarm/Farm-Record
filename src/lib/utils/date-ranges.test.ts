import { describe, it, expect } from "vitest";
import {
  getDateRange,
  getTodayRange,
  enumerateDays,
  toDateKey,
  buildDailySeries,
  resolveDateRange,
} from "@/lib/utils/date-ranges";

const fixedNow = new Date("2026-09-12T15:30:00Z");

describe("getDateRange", () => {
  it("returns a 7-day inclusive-from/exclusive-to range ending today", () => {
    const { from, to } = getDateRange(7, fixedNow);
    expect(toDateKey(from)).toBe("2026-09-06");
    expect(toDateKey(to)).toBe("2026-09-13"); // exclusive upper bound
  });

  it("returns a 1-day range for days=1 matching getTodayRange", () => {
    const range = getDateRange(1, fixedNow);
    const today = getTodayRange(fixedNow);
    expect(toDateKey(range.from)).toBe(toDateKey(today.from));
    expect(toDateKey(range.to)).toBe(toDateKey(today.to));
  });

  it("normalizes to UTC midnight regardless of time-of-day in `now`", () => {
    const { from } = getDateRange(1, new Date("2026-09-12T23:59:59Z"));
    expect(from.toISOString()).toBe("2026-09-12T00:00:00.000Z");
  });
});

describe("enumerateDays", () => {
  it("returns consecutive UTC days starting at `from`", () => {
    const from = new Date("2026-09-06T00:00:00Z");
    const days = enumerateDays(from, 3);
    expect(days.map(toDateKey)).toEqual(["2026-09-06", "2026-09-07", "2026-09-08"]);
  });
});

describe("toDateKey", () => {
  it("formats as YYYY-MM-DD", () => {
    expect(toDateKey(new Date("2026-01-05T12:00:00Z"))).toBe("2026-01-05");
  });
});

describe("buildDailySeries", () => {
  it("fills every day, defaulting to 0 where there's no matching entry", () => {
    const days = [
      new Date("2026-09-10T00:00:00Z"),
      new Date("2026-09-11T00:00:00Z"),
      new Date("2026-09-12T00:00:00Z"),
    ];
    const values = [{ date: new Date("2026-09-11T00:00:00Z"), value: 5 }];

    expect(buildDailySeries(values, days)).toEqual([
      { date: "2026-09-10", value: 0 },
      { date: "2026-09-11", value: 5 },
      { date: "2026-09-12", value: 0 },
    ]);
  });
});

describe("resolveDateRange", () => {
  it("resolves 'today' to a 1-day range", () => {
    const result = resolveDateRange("today", undefined, fixedNow);
    expect(result.days).toBe(1);
    expect(toDateKey(result.from)).toBe("2026-09-12");
  });

  it("resolves '7d' to a 7-day range", () => {
    const result = resolveDateRange("7d", undefined, fixedNow);
    expect(result.days).toBe(7);
    expect(toDateKey(result.from)).toBe("2026-09-06");
  });

  it("resolves '30d' to a 30-day range", () => {
    const result = resolveDateRange("30d", undefined, fixedNow);
    expect(result.days).toBe(30);
  });

  it("resolves a valid custom range inclusively", () => {
    const result = resolveDateRange(
      "custom",
      { from: "2026-09-01", to: "2026-09-03" },
      fixedNow,
    );
    expect(toDateKey(result.from)).toBe("2026-09-01");
    expect(toDateKey(result.to)).toBe("2026-09-04"); // exclusive upper bound
    expect(result.days).toBe(3);
  });

  it("falls back to the last 7 days when custom dates are missing", () => {
    const result = resolveDateRange("custom", undefined, fixedNow);
    expect(result.days).toBe(7);
  });

  it("falls back to the last 7 days when 'from' is after 'to'", () => {
    const result = resolveDateRange(
      "custom",
      { from: "2026-09-10", to: "2026-09-01" },
      fixedNow,
    );
    expect(result.days).toBe(7);
  });

  it("falls back to the last 7 days when a custom date is invalid", () => {
    const result = resolveDateRange(
      "custom",
      { from: "not-a-date", to: "2026-09-03" },
      fixedNow,
    );
    expect(result.days).toBe(7);
  });
});
