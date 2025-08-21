import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { getSessionOrg } from "@/lib/auth";
import { env } from "@/lib/env";

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
  const key = `${orgId}/${randomUUID()}${ext ? `.${ext}` : ""}`;

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );
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
