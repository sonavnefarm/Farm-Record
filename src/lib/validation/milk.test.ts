import { describe, it, expect } from "vitest";
import { createMilkRecordSchema } from "@/lib/validation/milk";

const validInput = {
  animalId: "BUFF-001",
  date: "2026-09-10",
  morningMilk: "5.2",
  eveningMilk: "4.8",
};

describe("createMilkRecordSchema", () => {
  it("accepts valid input and coerces numeric strings", () => {
    const result = createMilkRecordSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.morningMilk).toBe(5.2);
      expect(result.data.eveningMilk).toBe(4.8);
    }
  });

  it("rejects a missing animal", () => {
    const result = createMilkRecordSchema.safeParse({ ...validInput, animalId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid date", () => {
    const result = createMilkRecordSchema.safeParse({ ...validInput, date: "not-a-date" });
    expect(result.success).toBe(false);
  });

  it("rejects negative morning milk", () => {
    const result = createMilkRecordSchema.safeParse({ ...validInput, morningMilk: "-1" });
    expect(result.success).toBe(false);
  });

  it("rejects negative evening milk", () => {
    const result = createMilkRecordSchema.safeParse({ ...validInput, eveningMilk: "-0.5" });
    expect(result.success).toBe(false);
  });

  it("accepts zero for either reading (an animal can yield nothing in a session)", () => {
    const result = createMilkRecordSchema.safeParse({
      ...validInput,
      morningMilk: "0",
      eveningMilk: "0",
    });
    expect(result.success).toBe(true);
  });

  it("does not accept a client-supplied totalMilk field as part of the schema", () => {
    // totalMilk must never be trusted from input — only computeTotalMilk()
    // in the service layer may set it. Confirm the schema has no such key.
    expect(Object.keys(createMilkRecordSchema.shape)).not.toContain("totalMilk");
  });
});
