import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionOrg } from "@/lib/auth";
import { db } from "@/lib/store";

const updateSchema = z.object({
  name: z.string().optional(),
  dslJson: z.any().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const segment = db.segments.get(params.id);
  if (!segment) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (segment.orgId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ segment, members: segment.members });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const segment = db.segments.get(params.id);
  if (!segment) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (segment.orgId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }
  Object.assign(segment, parsed.data, { updatedAt: new Date().toISOString() });
  db.segments.set(segment.id, segment);
  return NextResponse.json({ segment });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const segment = db.segments.get(params.id);
  if (!segment) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (segment.orgId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  db.segments.delete(segment.id);
  return NextResponse.json({ success: true });
}
