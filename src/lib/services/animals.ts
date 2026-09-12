import { prisma } from "@/lib/db";
import { ConflictError, NotFoundError } from "@/lib/errors";
import type { Animal, AnimalListFilters } from "@/types/animal";
import type { CreateAnimalInput, UpdateAnimalInput } from "@/lib/validation/animal";

/** Prisma's unique-constraint violation error code. */
const PRISMA_UNIQUE_CONSTRAINT_CODE = "P2002";

function isPrismaKnownError(
  error: unknown,
): error is { code: string; meta?: Record<string, unknown> } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

export async function listAnimals(filters: AnimalListFilters = {}): Promise<Animal[]> {
  return prisma.animal.findMany({
    where: {
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
    orderBy: { id: "asc" },
  });
}

export async function getAnimal(id: string): Promise<Animal> {
  const animal = await prisma.animal.findUnique({ where: { id } });
  if (!animal) {
    throw new NotFoundError(`No animal found with ID "${id}".`);
  }
  return animal;
}

export async function createAnimal(input: CreateAnimalInput): Promise<Animal> {
  const existing = await prisma.animal.findUnique({ where: { id: input.id } });
  if (existing) {
    throw new ConflictError(`An animal with ID "${input.id}" already exists.`);
  }

  try {
    return await prisma.animal.create({
      data: {
        id: input.id,
        name: input.name ?? null,
        category: input.category,
      },
    });
  } catch (error) {
    if (isPrismaKnownError(error) && error.code === PRISMA_UNIQUE_CONSTRAINT_CODE) {
      throw new ConflictError(`An animal with ID "${input.id}" already exists.`);
    }
    throw error;
  }
}

export async function updateAnimal(id: string, input: UpdateAnimalInput): Promise<Animal> {
  await getAnimal(id); // throws NotFoundError if missing

  return prisma.animal.update({
    where: { id },
    data: {
      name: input.name ?? null,
      category: input.category,
    },
  });
}

export async function deactivateAnimal(id: string): Promise<Animal> {
  await getAnimal(id); // throws NotFoundError if missing

  // Soft delete only — animal status is set to INACTIVE, never removed, so
  // historical Food/Milk/Medicine records remain intact (see FEATURES.md §2).
  return prisma.animal.update({
    where: { id },
    data: { status: "INACTIVE" },
  });
}

export async function reactivateAnimal(id: string): Promise<Animal> {
  await getAnimal(id);

  return prisma.animal.update({
    where: { id },
    data: { status: "ACTIVE" },
  });
}
