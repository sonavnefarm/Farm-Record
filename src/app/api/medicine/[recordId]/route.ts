import { NextRequest, NextResponse } from "next/server";
import { updateMedicineRecordSchema } from "@/lib/validation/medicine";
import { updateMedicineRecord, deleteMedicineRecord } from "@/lib/services/medicine";
import { toErrorResponse, ValidationError } from "@/lib/errors";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { recordId } = await params;
    const json = await request.json();
    const parsed = updateMedicineRecordSchema.safeParse(json);
    if (!parsed.success) {
      throw new ValidationError(
        "Please fix the highlighted fields.",
        parsed.error.flatten().fieldErrors,
      );
    }

    const record = await updateMedicineRecord(recordId, parsed.data);
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { recordId } = await params;
    await deleteMedicineRecord(recordId);
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
