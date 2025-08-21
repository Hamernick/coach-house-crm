import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import { db } from "@/lib/store";

const sendSchema = z.object({
  sendAt: z.string().optional(),
});

export async function POST(
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
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  const sendAt = parsed.data.sendAt || new Date().toISOString();
  campaign.sendAt = sendAt;
  campaign.status =
    new Date(sendAt) > new Date() ? "SCHEDULED" : "SENT";
  campaign.updatedAt = new Date().toISOString();
  db.campaigns.set(campaign.id, campaign);
  return NextResponse.json({ campaign });
}
