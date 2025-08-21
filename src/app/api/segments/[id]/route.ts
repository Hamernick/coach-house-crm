import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import { db } from "@/lib/store";

const updateSchema = z.object({
  name: z.string().optional(),
  dslJson: z.any().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const segment = db.segments.get(params.id);
  if (!segment) {
    return jsonError(404, "Not Found");
  }
  if (segment.orgId !== orgId) {
    return jsonError(403, "Forbidden");
  }
  return NextResponse.json({ segment, members: segment.members });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const segment = db.segments.get(params.id);
  if (!segment) {
    return jsonError(404, "Not Found");
  }
  if (segment.orgId !== orgId) {
    return jsonError(403, "Forbidden");
  }
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  Object.assign(segment, parsed.data, { updatedAt: new Date().toISOString() });
  db.segments.set(segment.id, segment);
  return NextResponse.json({ segment });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const segment = db.segments.get(params.id);
  if (!segment) {
    return jsonError(404, "Not Found");
  }
  if (segment.orgId !== orgId) {
    return jsonError(403, "Forbidden");
  }
  db.segments.delete(segment.id);
  return NextResponse.json({ success: true });
}
