import { describe, it, expect } from "vitest";
import { createFoodRecordSchema } from "@/lib/validation/food";

const validInput = {
  animalId: "BUFF-001",
  date: "2026-09-10",
  foodName: "Green Fodder",
  quantity: "12",
};

describe("createFoodRecordSchema (regression)", () => {
  it("accepts valid input", () => {
    const result = createFoodRecordSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("treats foodName as optional", () => {
    const rest = { animalId: validInput.animalId, date: validInput.date, quantity: validInput.quantity };
    const result = createFoodRecordSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it("requires quantity greater than 0", () => {
    const result = createFoodRecordSchema.safeParse({ ...validInput, quantity: "0" });
    expect(result.success).toBe(false);
  });

  it("rejects a negative quantity", () => {
    const result = createFoodRecordSchema.safeParse({ ...validInput, quantity: "-5" });
    expect(result.success).toBe(false);
  });

  it("requires a valid date", () => {
    const result = createFoodRecordSchema.safeParse({ ...validInput, date: "" });
    expect(result.success).toBe(false);
  });
});
