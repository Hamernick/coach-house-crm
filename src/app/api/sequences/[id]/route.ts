import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { requireOrg, jsonError } from "@/lib/api";
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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const sequence = db.sequences.get(params.id);
  if (!sequence) {
    return jsonError(404, "Not Found");
  }
  if (sequence.orgId !== orgId) {
    return jsonError(403, "Forbidden");
  }
  return NextResponse.json({ sequence });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const sequence = db.sequences.get(params.id);
  if (!sequence) {
    return jsonError(404, "Not Found");
  }
  if (sequence.orgId !== orgId) {
    return jsonError(403, "Forbidden");
  }
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  if (parsed.data.segmentId) {
    const seg = db.segments.get(parsed.data.segmentId);
    if (!seg) {
      return jsonError(422, "Segment not found");
    }
    if (seg.orgId !== orgId) {
      return jsonError(403, "Forbidden");
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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const sequence = db.sequences.get(params.id);
  if (!sequence) {
    return jsonError(404, "Not Found");
  }
  if (sequence.orgId !== orgId) {
    return jsonError(403, "Forbidden");
  }
  db.sequences.delete(sequence.id);
  return NextResponse.json({ success: true });
}
