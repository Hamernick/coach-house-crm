import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOrg, jsonError } from "@/lib/api";
import { db } from "@/lib/store";

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
  const orgStore = db.autosave.get(orgId);
  const entry = orgStore?.get(key);
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
