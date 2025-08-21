import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import { db } from "@/lib/store";

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
  const campaign = db.campaigns.get(params.id);
  if (!campaign) {
    return jsonError(404, "Not Found");
  }
  if (campaign.orgId !== orgId) {
    return jsonError(403, "Forbidden");
  }
  return NextResponse.json({ campaign });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const campaign = db.campaigns.get(params.id);
  if (!campaign) {
    return jsonError(404, "Not Found");
  }
  if (campaign.orgId !== orgId) {
    return jsonError(403, "Forbidden");
  }
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  const { segmentId } = parsed.data;
  if (segmentId) {
    const seg = db.segments.get(segmentId);
    if (!seg) {
      return jsonError(422, "Segment not found");
    }
    if (seg.orgId !== orgId) {
      return jsonError(403, "Forbidden");
    }
  }
  Object.assign(campaign, parsed.data, { updatedAt: new Date().toISOString() });
  db.campaigns.set(campaign.id, campaign);
  return NextResponse.json({ campaign });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const campaign = db.campaigns.get(params.id);
  if (!campaign) {
    return jsonError(404, "Not Found");
  }
  if (campaign.orgId !== orgId) {
    return jsonError(403, "Forbidden");
  }
  db.campaigns.delete(campaign.id);
  return NextResponse.json({ success: true });
}
