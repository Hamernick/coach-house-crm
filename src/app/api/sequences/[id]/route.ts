import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { getSessionOrg } from "@/lib/auth";
import { db, SequenceStep } from "@/lib/store";

const stepSchema = z.object({
  id: z.string().optional(),
  delayHours: z.number(),
  contentJson: z.any(),
  order: z.number(),
});

const updateSchema = z.object({
  name: z.string().optional(),
  segmentId: z.string().optional(),
  steps: z.array(stepSchema).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sequence = db.sequences.get(params.id);
  if (!sequence) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (sequence.orgId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ sequence });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sequence = db.sequences.get(params.id);
  if (!sequence) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (sequence.orgId !== orgId) {
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
  if (parsed.data.segmentId) {
    const seg = db.segments.get(parsed.data.segmentId);
    if (!seg) {
      return NextResponse.json({ error: "Segment not found" }, { status: 422 });
    }
    if (seg.orgId !== orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  if (parsed.data.steps) {
    const steps: SequenceStep[] = parsed.data.steps.map((s) => ({
      id: s.id || randomUUID(),
      delayHours: s.delayHours,
      contentJson: s.contentJson,
      order: s.order,
    }));
    sequence.steps = steps;
  }
  if (parsed.data.name !== undefined) sequence.name = parsed.data.name;
  if (parsed.data.segmentId !== undefined)
    sequence.segmentId = parsed.data.segmentId;
  sequence.updatedAt = new Date().toISOString();
  db.sequences.set(sequence.id, sequence);
  return NextResponse.json({ sequence });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sequence = db.sequences.get(params.id);
  if (!sequence) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (sequence.orgId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  db.sequences.delete(sequence.id);
  return NextResponse.json({ success: true });
}
