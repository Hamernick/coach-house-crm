import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import prisma from "@/lib/prisma";

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
  const segment = await (prisma as any).segment.findFirst({
    where: { id: params.id, orgId },
  });
  if (!segment) {
    return jsonError(404, "Not Found");
  }
  return NextResponse.json({ segment, members: segment.members });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const segment = await (prisma as any).segment.findFirst({
    where: { id: params.id, orgId },
  });
  if (!segment) {
    return jsonError(404, "Not Found");
  }
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  const updated = await (prisma as any).segment.update({
    where: { id: params.id, orgId },
    data: parsed.data,
  });
  return NextResponse.json({ segment: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const segment = await (prisma as any).segment.findFirst({
    where: { id: params.id, orgId },
  });
  if (!segment) {
    return jsonError(404, "Not Found");
  }
  await (prisma as any).segment.delete({ where: { id: params.id, orgId } });
  return NextResponse.json({ success: true });
}
