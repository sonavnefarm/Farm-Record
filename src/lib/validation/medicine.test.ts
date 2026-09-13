import { describe, it, expect } from "vitest";
import { createMedicineRecordSchema } from "@/lib/validation/medicine";

const validInput = {
  animalId: "BUFF-001",
  date: "2026-09-10",
  medicineName: "Medicine A",
};

describe("createMedicineRecordSchema", () => {
  it("accepts valid input", () => {
    const result = createMedicineRecordSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects a missing animal", () => {
    const result = createMedicineRecordSchema.safeParse({ ...validInput, animalId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid date", () => {
    const result = createMedicineRecordSchema.safeParse({ ...validInput, date: "not-a-date" });
    expect(result.success).toBe(false);
  });

  it("requires a medicine name (unlike Food, this field is not optional)", () => {
    const result = createMedicineRecordSchema.safeParse({ ...validInput, medicineName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a medicine name over 80 characters", () => {
    const result = createMedicineRecordSchema.safeParse({
      ...validInput,
      medicineName: "x".repeat(81),
    });
    expect(result.success).toBe(false);
  });

  it("stays minimal: no dosage, duration, vet, diagnosis, or cost fields exist on the schema", () => {
    const keys = Object.keys(createMedicineRecordSchema.shape);
    expect(keys.sort()).toEqual(["animalId", "date", "medicineName"].sort());
  });
});
