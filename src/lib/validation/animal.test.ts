import { describe, it, expect } from "vitest";
import { createAnimalSchema } from "@/lib/validation/animal";

describe("createAnimalSchema (regression)", () => {
  it("accepts a valid animal", () => {
    const result = createAnimalSchema.safeParse({
      id: "BUFF-001",
      name: "Bella",
      category: "BUFFALO",
    });
    expect(result.success).toBe(true);
  });

  it("requires an ID", () => {
    const result = createAnimalSchema.safeParse({ id: "", category: "COW" });
    expect(result.success).toBe(false);
  });

  it("rejects an ID containing spaces", () => {
    const result = createAnimalSchema.safeParse({ id: "BUFF 001", category: "BUFFALO" });
    expect(result.success).toBe(false);
  });

  it("treats name as optional", () => {
    const result = createAnimalSchema.safeParse({ id: "GOAT-001", category: "GOAT" });
    expect(result.success).toBe(true);
  });

  it("requires a valid category", () => {
    const result = createAnimalSchema.safeParse({ id: "X-001", category: "HORSE" });
    expect(result.success).toBe(false);
  });
});
