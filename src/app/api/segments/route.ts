import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import prisma from "@/lib/prisma";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;

  const segments = await (prisma as any).segment.findMany({
    where: {
      orgId,
      ...(cursor ? { createdAt: { gt: cursor } } : {}),
    },
    orderBy: { createdAt: "asc" },
    take: PAGE_SIZE + 1,
  });

  let nextCursor: string | null = null;
  if (segments.length > PAGE_SIZE) {
    nextCursor = segments[PAGE_SIZE].createdAt;
    segments.length = PAGE_SIZE;
  }
  return NextResponse.json({ segments, nextCursor });
}

const createSchema = z.object({
  name: z.string(),
  dslJson: z.any(),
});

export async function POST(req: NextRequest) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  const { name, dslJson } = parsed.data;
  const segment = await (prisma as any).segment.create({
    data: {
      orgId,
      name,
      dslJson,
      members: [],
    },
  });
  return NextResponse.json({ segment });
}
