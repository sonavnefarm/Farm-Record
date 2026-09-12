import { NextRequest, NextResponse } from "next/server";
import { updateAnimalSchema } from "@/lib/validation/animal";
import { getAnimal, updateAnimal } from "@/lib/services/animals";
import { toErrorResponse, ValidationError } from "@/lib/errors";

type RouteParams = { params: Promise<{ animalId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { animalId } = await params;
    const animal = await getAnimal(animalId);
    return NextResponse.json({ success: true, data: animal });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { animalId } = await params;
    const json = await request.json();
    const parsed = updateAnimalSchema.safeParse(json);
    if (!parsed.success) {
      throw new ValidationError(
        "Please fix the highlighted fields.",
        parsed.error.flatten().fieldErrors,
      );
    }

    const animal = await updateAnimal(animalId, parsed.data);
    return NextResponse.json({ success: true, data: animal });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
