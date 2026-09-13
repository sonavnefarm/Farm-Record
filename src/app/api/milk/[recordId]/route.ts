import { NextRequest, NextResponse } from "next/server";
import { updateMilkRecordSchema } from "@/lib/validation/milk";
import { updateMilkRecord, deleteMilkRecord } from "@/lib/services/milk";
import { toErrorResponse, ValidationError } from "@/lib/errors";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { recordId } = await params;
    const json = await request.json();
    const parsed = updateMilkRecordSchema.safeParse(json);
    if (!parsed.success) {
      throw new ValidationError(
        "Please fix the highlighted fields.",
        parsed.error.flatten().fieldErrors,
      );
    }

    const record = await updateMilkRecord(recordId, parsed.data);
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { recordId } = await params;
    await deleteMilkRecord(recordId);
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
