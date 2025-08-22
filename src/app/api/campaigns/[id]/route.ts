import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import prisma from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().optional(),
  contentJson: z.any().optional(),
  segmentId: z.string().optional(),
  sendAt: z.string().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "SENDING", "SENT"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const campaign = await (prisma as any).campaign.findFirst({
    where: { id: params.id, orgId },
  });
  if (!campaign) {
    return jsonError(404, "Not Found");
  }
  return NextResponse.json({ campaign });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const campaign = await (prisma as any).campaign.findFirst({
    where: { id: params.id, orgId },
  });
  if (!campaign) {
    return jsonError(404, "Not Found");
  }
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  const { segmentId } = parsed.data;
  if (segmentId) {
    const seg = await (prisma as any).segment.findFirst({
      where: { id: segmentId, orgId },
    });
    if (!seg) {
      return jsonError(422, "Segment not found");
    }
  }
  const updated = await (prisma as any).campaign.update({
    where: { id: params.id, orgId },
    data: parsed.data,
  });
  return NextResponse.json({ campaign: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const campaign = await (prisma as any).campaign.findFirst({
    where: { id: params.id, orgId },
  });
  if (!campaign) {
    return jsonError(404, "Not Found");
  }
  await (prisma as any).campaign.delete({ where: { id: params.id, orgId } });
  return NextResponse.json({ success: true });
}
