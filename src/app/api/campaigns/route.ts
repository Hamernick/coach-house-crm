import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import prisma from "@/lib/prisma";

const PAGE_SIZE = 10;

const createSchema = z.object({
  name: z.string(),
  contentJson: z.any(),
  segmentId: z.string().optional(),
  sendAt: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;

  const campaigns = await (prisma as any).campaign.findMany({
    where: {
      orgId,
      ...(cursor ? { createdAt: { gt: cursor } } : {}),
    },
    orderBy: { createdAt: "asc" },
    take: PAGE_SIZE + 1,
  });

  let nextCursor: string | null = null;
  if (campaigns.length > PAGE_SIZE) {
    nextCursor = campaigns[PAGE_SIZE].createdAt;
    campaigns.length = PAGE_SIZE;
  }
  return NextResponse.json({ campaigns, nextCursor });
}

export async function POST(req: NextRequest) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  const { name, contentJson, segmentId, sendAt } = parsed.data;
  if (segmentId) {
    const seg = await (prisma as any).segment.findFirst({
      where: { id: segmentId, orgId },
    });
    if (!seg) {
      return jsonError(422, "Segment not found");
    }
  }
  const status = sendAt ? "scheduled" : "draft";
  const campaign = await (prisma as any).campaign.create({
    data: {
      orgId,
      name,
      contentJson,
      segmentId,
      sendAt,
      status,
    },
  });
  return NextResponse.json({ campaign });
}
