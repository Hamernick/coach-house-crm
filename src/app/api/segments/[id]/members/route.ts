import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionOrg } from "@/lib/auth";
import { db } from "@/lib/store";

const membersSchema = z.object({
  contactIds: z.array(z.string()),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const segment = db.segments.get(params.id);
  if (!segment) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (segment.orgId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = membersSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
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
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const segment = db.segments.get(params.id);
  if (!segment) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (segment.orgId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = membersSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }
  segment.members = segment.members.filter(
    (m) => !parsed.data.contactIds.includes(m)
  );
  segment.updatedAt = new Date().toISOString();
  return NextResponse.json({ members: segment.members });
}
