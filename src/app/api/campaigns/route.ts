import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { getSessionOrg } from "@/lib/auth";
import { db, Campaign, CampaignStatus } from "@/lib/store";

const PAGE_SIZE = 10;

const createSchema = z.object({
  name: z.string(),
  contentJson: z.any(),
  segmentId: z.string().optional(),
  sendAt: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;
  const campaigns = Array.from(db.campaigns.values()).filter(
    (c) => c.orgId === orgId
  );
  campaigns.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const start = cursor ? campaigns.findIndex((c) => c.id === cursor) + 1 : 0;
  const page = campaigns.slice(start, start + PAGE_SIZE);
  const nextCursor =
    start + PAGE_SIZE < campaigns.length ? page[page.length - 1].id : null;
  return NextResponse.json({ campaigns: page, nextCursor });
}

export async function POST(req: NextRequest) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const { name, contentJson, segmentId, sendAt } = parsed.data;
  if (segmentId) {
    const seg = db.segments.get(segmentId);
    if (!seg) {
      return NextResponse.json({ error: "Segment not found" }, { status: 422 });
    }
    if (seg.orgId !== orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  const now = new Date().toISOString();
  const status: CampaignStatus = sendAt ? "SCHEDULED" : "DRAFT";
  const campaign: Campaign = {
    id: randomUUID(),
    orgId,
    name,
    contentJson,
    status,
    sendAt,
    segmentId,
    createdAt: now,
    updatedAt: now,
  };
  db.campaigns.set(campaign.id, campaign);
  return NextResponse.json({ campaign });
}
