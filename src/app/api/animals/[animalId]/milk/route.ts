import { NextRequest, NextResponse } from "next/server";
import { getAnimalMilkHistory } from "@/lib/services/milk";
import { toErrorResponse } from "@/lib/errors";

type RouteParams = { params: Promise<{ animalId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { animalId } = await params;
    const records = await getAnimalMilkHistory(animalId);
    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
