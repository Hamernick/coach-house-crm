import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { getSessionOrg } from "@/lib/auth";
import { db, Segment } from "@/lib/store";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;

  const segments = Array.from(db.segments.values()).filter(
    (s) => s.orgId === orgId
  );
  segments.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const start = cursor ? segments.findIndex((s) => s.id === cursor) + 1 : 0;
  const page = segments.slice(start, start + PAGE_SIZE);
  const nextCursor =
    start + PAGE_SIZE < segments.length ? page[page.length - 1].id : null;
  return NextResponse.json({ segments: page, nextCursor });
}

const createSchema = z.object({
  name: z.string(),
  dslJson: z.any(),
});

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
  const { name, dslJson } = parsed.data;
  const now = new Date().toISOString();
  const segment: Segment = {
    id: randomUUID(),
    orgId,
    name,
    dslJson,
    members: [],
    createdAt: now,
    updatedAt: now,
  };
  db.segments.set(segment.id, segment);
  return NextResponse.json({ segment });
}
