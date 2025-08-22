import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import prisma from "@/lib/prisma";

const sendSchema = z.object({
  sendAt: z.string().optional(),
});

export async function POST(
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
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  const sendAt = parsed.data.sendAt || new Date().toISOString();
  const status = new Date(sendAt) > new Date() ? "SCHEDULED" : "SENT";
  const updated = await (prisma as any).campaign.update({
    where: { id: params.id, orgId },
    data: { sendAt, status },
  });
  return NextResponse.json({ campaign: updated });
}
