import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireOrg, jsonError } from "@/lib/api";
import { env } from "@/lib/env";
import { createSupabaseServer } from "@/packages/db";

export async function POST(req: NextRequest) {
  const orgId = await requireOrg(req);
  if (orgId instanceof NextResponse) return orgId;

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return jsonError(400, "No file provided");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.name.split(".").pop();
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const key = `${orgId}/${year}/${month}/${randomUUID()}${ext ? `.${ext}` : ""}`;

  const supabase = createSupabaseServer();
  const bucket = env.SUPABASE_STORAGE_BUCKET;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(key, buffer, {
      contentType: file.type,
    });

  if (error) {
    return jsonError(500, error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(key);

  return NextResponse.json({ url: data.publicUrl });
}
