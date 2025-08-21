import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionOrg } from "@/lib/auth";
import { db } from "@/lib/store";

const saveSchema = z.object({
  key: z.string(),
  data: z.any(),
});

export async function GET(req: NextRequest) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 422 });
  }
  const orgStore = db.autosave.get(orgId);
  const entry = orgStore?.get(key);
  if (!entry) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  return NextResponse.json(entry);
}

export async function POST(req: NextRequest) {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }
  let orgStore = db.autosave.get(orgId);
  if (!orgStore) {
    orgStore = new Map();
    db.autosave.set(orgId, orgStore);
  }
  const entry = {
    key: parsed.data.key,
    data: parsed.data.data,
    updatedAt: new Date().toISOString(),
  };
  orgStore.set(parsed.data.key, entry);
  return NextResponse.json(entry);
}
