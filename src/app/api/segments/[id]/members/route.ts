import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import { db } from "@/lib/store";

const membersSchema = z.object({
  contactIds: z.array(z.string()),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const segment = db.segments.get(params.id);
  if (!segment) {
    return jsonError(404, "Not Found");
  }
  if (segment.orgId !== orgId) {
    return jsonError(403, "Forbidden");
  }
  const body = await req.json().catch(() => null);
  const parsed = membersSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  for (const id of parsed.data.contactIds) {
    if (!segment.members.includes(id)) segment.members.push(id);
  }
  segment.updatedAt = new Date().toISOString();
  return NextResponse.json({ members: segment.members });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const segment = db.segments.get(params.id);
  if (!segment) {
    return jsonError(404, "Not Found");
  }
  if (segment.orgId !== orgId) {
    return jsonError(403, "Forbidden");
  }
  const body = await req.json().catch(() => null);
  const parsed = membersSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  segment.members = segment.members.filter(
    (m) => !parsed.data.contactIds.includes(m)
  );
  segment.updatedAt = new Date().toISOString();
  return NextResponse.json({ members: segment.members });
}
