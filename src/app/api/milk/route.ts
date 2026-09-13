import { NextRequest, NextResponse } from "next/server";
import { createMilkRecordSchema } from "@/lib/validation/milk";
import { listMilkRecords, createMilkRecord } from "@/lib/services/milk";
import { toErrorResponse, ValidationError } from "@/lib/errors";
import { ANIMAL_CATEGORIES } from "@/types/animal";
import type { AnimalCategory } from "@/types/animal";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const animalId = params.get("animalId") ?? undefined;
    const categoryParam = params.get("category");
    const category = ANIMAL_CATEGORIES.includes(categoryParam as AnimalCategory)
      ? (categoryParam as AnimalCategory)
      : undefined;
    const dateFrom = params.get("dateFrom");
    const dateTo = params.get("dateTo");

    const records = await listMilkRecords({
      animalId,
      category,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = createMilkRecordSchema.safeParse(json);
    if (!parsed.success) {
      throw new ValidationError(
        "Please fix the highlighted fields.",
        parsed.error.flatten().fieldErrors,
      );
    }

    const record = await createMilkRecord(parsed.data);
    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
