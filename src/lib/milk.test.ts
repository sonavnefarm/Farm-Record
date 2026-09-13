import { describe, it, expect } from "vitest";
import { computeTotalMilk } from "@/lib/milk";

describe("computeTotalMilk", () => {
  it("adds morning and evening readings", () => {
    expect(computeTotalMilk(5.2, 4.8)).toBe(10);
  });

  it("avoids floating-point artifacts", () => {
    // Naive 5.2 + 4.8 in JS floating point is 9.999999999999998, not 10.
    expect(computeTotalMilk(5.2, 4.8)).toBe(10);
    expect(computeTotalMilk(0.1, 0.2)).toBe(0.3);
  });

  it("rounds to 2 decimal places", () => {
    expect(computeTotalMilk(1.005, 1.005)).toBe(2.01);
  });

  it("handles zero on either side", () => {
    expect(computeTotalMilk(0, 4.8)).toBe(4.8);
    expect(computeTotalMilk(5.2, 0)).toBe(5.2);
    expect(computeTotalMilk(0, 0)).toBe(0);
  });
});
