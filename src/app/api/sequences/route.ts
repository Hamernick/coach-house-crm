import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { getSessionOrg } from "@/lib/auth";
import { db, Sequence, SequenceStep } from "@/lib/store";

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
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;
  const sequences = Array.from(db.sequences.values()).filter(
    (s) => s.orgId === orgId
  );
  sequences.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const start = cursor ? sequences.findIndex((s) => s.id === cursor) + 1 : 0;
  const page = sequences.slice(start, start + PAGE_SIZE);
  const nextCursor =
    start + PAGE_SIZE < sequences.length ? page[page.length - 1].id : null;
  return NextResponse.json({ sequences: page, nextCursor });
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
  const { name, steps, segmentId } = parsed.data;
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
  const seqSteps: SequenceStep[] = steps.map((s) => ({
    id: randomUUID(),
    ...s,
  }));
  const sequence: Sequence = {
    id: randomUUID(),
    orgId,
    name,
    steps: seqSteps,
    segmentId,
    createdAt: now,
    updatedAt: now,
  };
  db.sequences.set(sequence.id, sequence);
  return NextResponse.json({ sequence });
}
