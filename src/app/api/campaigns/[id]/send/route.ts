import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionOrg } from "@/lib/auth";
import { db } from "@/lib/store";

const sendSchema = z.object({
  sendAt: z.string().optional(),
});

export async function POST(
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
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const sendAt = parsed.data.sendAt || new Date().toISOString();
  campaign.sendAt = sendAt;
  campaign.status =
    new Date(sendAt) > new Date() ? "SCHEDULED" : "SENT";
  campaign.updatedAt = new Date().toISOString();
  db.campaigns.set(campaign.id, campaign);
  return NextResponse.json({ campaign });
}
