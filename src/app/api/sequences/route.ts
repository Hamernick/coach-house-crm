import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { requireOrg, jsonError } from "@/lib/api";
import prisma from "@/lib/prisma";

const PAGE_SIZE = 10;

const stepSchema = z.object({
  delayHours: z.number(),
  contentJson: z.any(),
  order: z.number(),
});

const createSchema = z.object({
  name: z.string(),
  segmentId: z.string().optional(),
  steps: z.array(stepSchema),
});

export async function GET(req: NextRequest) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;

  const sequences = await (prisma as any).sequence.findMany({
    where: {
      orgId,
      ...(cursor ? { createdAt: { gt: cursor } } : {}),
    },
    orderBy: { createdAt: "asc" },
    take: PAGE_SIZE + 1,
  });

  let nextCursor: string | null = null;
  if (sequences.length > PAGE_SIZE) {
    nextCursor = sequences[PAGE_SIZE].createdAt;
    sequences.length = PAGE_SIZE;
  }
  return NextResponse.json({ sequences, nextCursor });
}

export async function POST(req: NextRequest) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  const { name, steps, segmentId } = parsed.data;
  if (segmentId) {
    const seg = await (prisma as any).segment.findFirst({
      where: { id: segmentId, orgId },
    });
    if (!seg) {
      return jsonError(422, "Segment not found");
    }
  }
  const seqSteps = steps.map((s) => ({ id: randomUUID(), ...s }));
  const sequence = await (prisma as any).sequence.create({
    data: {
      orgId,
      name,
      segmentId,
      steps: seqSteps,
    },
  });
  return NextResponse.json({ sequence });
}
