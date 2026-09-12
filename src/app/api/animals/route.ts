import { NextRequest, NextResponse } from "next/server";
import { createAnimalSchema } from "@/lib/validation/animal";
import { listAnimals, createAnimal } from "@/lib/services/animals";
import { toErrorResponse, ValidationError } from "@/lib/errors";
import { ANIMAL_CATEGORIES, ANIMAL_STATUSES } from "@/types/animal";
import type { AnimalCategory, AnimalStatus } from "@/types/animal";

export async function GET(request: NextRequest) {
  try {
    const categoryParam = request.nextUrl.searchParams.get("category");
    const statusParam = request.nextUrl.searchParams.get("status");

    const category = ANIMAL_CATEGORIES.includes(categoryParam as AnimalCategory)
      ? (categoryParam as AnimalCategory)
      : undefined;
    const status = ANIMAL_STATUSES.includes(statusParam as AnimalStatus)
      ? (statusParam as AnimalStatus)
      : undefined;

    const animals = await listAnimals({ category, status });
    return NextResponse.json({ success: true, data: animals });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = createAnimalSchema.safeParse(json);
    if (!parsed.success) {
      throw new ValidationError(
        "Please fix the highlighted fields.",
        parsed.error.flatten().fieldErrors,
      );
    }

    const animal = await createAnimal(parsed.data);
    return NextResponse.json({ success: true, data: animal }, { status: 201 });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
