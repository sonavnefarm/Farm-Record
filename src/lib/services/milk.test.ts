import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Prisma client so this test exercises real service logic
// (including computeTotalMilk) without needing a live database connection.
const mockAnimalFindUnique = vi.fn();
const mockMilkRecordCreate = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    animal: {
      findUnique: (...args: unknown[]) => mockAnimalFindUnique(...args),
    },
    milkRecord: {
      create: (...args: unknown[]) => mockMilkRecordCreate(...args),
    },
  },
}));

const { createMilkRecord } = await import("@/lib/services/milk");

describe("createMilkRecord", () => {
  beforeEach(() => {
    mockAnimalFindUnique.mockReset();
    mockMilkRecordCreate.mockReset();
  });

  it("computes totalMilk server-side and never trusts a client-supplied value", async () => {
    mockAnimalFindUnique.mockResolvedValue({ id: "BUFF-001" });
    mockMilkRecordCreate.mockImplementation(({ data }) =>
      Promise.resolve({
        id: "rec_1",
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const result = await createMilkRecord({
      animalId: "BUFF-001",
      date: "2026-09-10",
      morningMilk: 5.2,
      eveningMilk: 4.8,
    });

    expect(mockMilkRecordCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ totalMilk: 10 }),
      }),
    );
    expect(result.totalMilk).toBe(10);
  });

  it("throws NotFoundError when the animal does not exist", async () => {
    mockAnimalFindUnique.mockResolvedValue(null);

    await expect(
      createMilkRecord({
        animalId: "NOPE-001",
        date: "2026-09-10",
        morningMilk: 1,
        eveningMilk: 1,
      }),
    ).rejects.toThrow(/no animal found/i);

    expect(mockMilkRecordCreate).not.toHaveBeenCalled();
  });
});
