import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import prisma from "@/lib/prisma";

const saveSchema = z.object({
  key: z.string(),
  data: z.any(),
});

export async function GET(req: NextRequest) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) {
    return jsonError(422, "Missing key");
  }
  const entry = await (prisma as any).autosave.findFirst({
    where: { orgId, key },
  });
  if (!entry) {
    return jsonError(404, "Not Found");
  }
  return NextResponse.json(entry);
}

export async function POST(req: NextRequest) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;
  const body = await req.json().catch(() => null);
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.flatten());
  }
  const entry = await (prisma as any).autosave.upsert({
    where: { orgId_key: { orgId, key: parsed.data.key } },
    create: {
      orgId,
      key: parsed.data.key,
      data: parsed.data.data,
    },
    update: {
      data: parsed.data.data,
    },
  });
  return NextResponse.json(entry);
}
