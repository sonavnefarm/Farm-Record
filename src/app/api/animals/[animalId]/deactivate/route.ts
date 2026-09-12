import { NextRequest, NextResponse } from "next/server";
import { deactivateAnimal } from "@/lib/services/animals";
import { toErrorResponse } from "@/lib/errors";

type RouteParams = { params: Promise<{ animalId: string }> };

export async function PATCH(_request: NextRequest, { params }: RouteParams) {
  try {
    const { animalId } = await params;
    const animal = await deactivateAnimal(animalId);
    return NextResponse.json({ success: true, data: animal });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
