import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import prisma from "@/lib/prisma";

const membersSchema = z.object({
  contactIds: z.array(z.string()),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const segment = await (prisma as any).segment.findFirst({
    where: { id: params.id, orgId },
  });
  if (!segment) {
    return jsonError(404, "Not Found");
  }
  const body = await req.json().catch(() => null);
  const parsed = membersSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  const members = Array.from(
    new Set([...(segment.members || []), ...parsed.data.contactIds])
  );
  const updated = await (prisma as any).segment.update({
    where: { id: params.id, orgId },
    data: { members },
  });
  return NextResponse.json({ members: updated.members });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const segment = await (prisma as any).segment.findFirst({
    where: { id: params.id, orgId },
  });
  if (!segment) {
    return jsonError(404, "Not Found");
  }
  const body = await req.json().catch(() => null);
  const parsed = membersSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  const members = (segment.members || []).filter(
    (m: string) => !parsed.data.contactIds.includes(m)
  );
  const updated = await (prisma as any).segment.update({
    where: { id: params.id, orgId },
    data: { members },
  });
  return NextResponse.json({ members: updated.members });
}
