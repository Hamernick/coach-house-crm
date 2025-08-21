import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionOrg } from "@/lib/auth";
import { db } from "@/lib/store";

const updateSchema = z.object({
  name: z.string().optional(),
  contentJson: z.any().optional(),
  segmentId: z.string().optional(),
  sendAt: z.string().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "SENDING", "SENT"]).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const campaign = db.campaigns.get(params.id);
  if (!campaign) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (campaign.orgId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ campaign });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const campaign = db.campaigns.get(params.id);
  if (!campaign) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (campaign.orgId !== orgId) {
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
  const { segmentId } = parsed.data;
  if (segmentId) {
    const seg = db.segments.get(segmentId);
    if (!seg) {
      return NextResponse.json({ error: "Segment not found" }, { status: 422 });
    }
    if (seg.orgId !== orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  Object.assign(campaign, parsed.data, { updatedAt: new Date().toISOString() });
  db.campaigns.set(campaign.id, campaign);
  return NextResponse.json({ campaign });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const campaign = db.campaigns.get(params.id);
  if (!campaign) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (campaign.orgId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  db.campaigns.delete(campaign.id);
  return NextResponse.json({ success: true });
}
