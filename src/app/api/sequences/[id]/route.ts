import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { requireOrg, jsonError } from "@/lib/api";
import prisma from "@/lib/prisma";

const stepSchema = z.object({
  id: z.string().optional(),
  delayHours: z.number(),
  contentJson: z.any(),
  order: z.number(),
});

const updateSchema = z.object({
  name: z.string().optional(),
  segmentId: z.string().optional(),
  steps: z.array(stepSchema).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const sequence = await (prisma as any).sequence.findFirst({
    where: { id: params.id, orgId },
  });
  if (!sequence) {
    return jsonError(404, "Not Found");
  }
  return NextResponse.json({ sequence });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const sequence = await (prisma as any).sequence.findFirst({
    where: { id: params.id, orgId },
  });
  if (!sequence) {
    return jsonError(404, "Not Found");
  }
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  if (parsed.data.segmentId) {
    const seg = await (prisma as any).segment.findFirst({
      where: { id: parsed.data.segmentId, orgId },
    });
    if (!seg) {
      return jsonError(422, "Segment not found");
    }
  }
  let data: any = {};
  if (parsed.data.steps) {
    const steps = parsed.data.steps.map((s) => ({
      id: s.id || randomUUID(),
      delayHours: s.delayHours,
      contentJson: s.contentJson,
      order: s.order,
    }));
    data.steps = steps;
  }
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.segmentId !== undefined) data.segmentId = parsed.data.segmentId;
  const updated = await (prisma as any).sequence.update({
    where: { id: params.id, orgId },
    data,
  });
  return NextResponse.json({ sequence: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const sequence = await (prisma as any).sequence.findFirst({
    where: { id: params.id, orgId },
  });
  if (!sequence) {
    return jsonError(404, "Not Found");
  }
  await (prisma as any).sequence.delete({ where: { id: params.id, orgId } });
  return NextResponse.json({ success: true });
}
