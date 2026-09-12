// Domain types shared between validation, services, actions, and UI.
// Kept independent of the generated Prisma client so the validation layer
// has no dependency on `prisma generate` having been run. The string values
// here must stay in sync with the enums in prisma/schema.prisma.

export const ANIMAL_CATEGORIES = ["BUFFALO", "COW", "GOAT"] as const;
export type AnimalCategory = (typeof ANIMAL_CATEGORIES)[number];

export const ANIMAL_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type AnimalStatus = (typeof ANIMAL_STATUSES)[number];

export const ANIMAL_CATEGORY_LABELS: Record<AnimalCategory, string> = {
  BUFFALO: "Buffalo",
  COW: "Cow",
  GOAT: "Goat",
};

export const ANIMAL_STATUS_LABELS: Record<AnimalStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export type Animal = {
  id: string;
  name: string | null;
  category: AnimalCategory;
  status: AnimalStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type AnimalListFilters = {
  category?: AnimalCategory;
  status?: AnimalStatus;
};
