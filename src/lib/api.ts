import { NextRequest, NextResponse } from "next/server";
import { getSessionOrg } from "./auth";

export function jsonError(status: number, message: unknown) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireOrg(_req: NextRequest): Promise<string | NextResponse> {
  const orgId = await getSessionOrg();
  if (!orgId) {
    return jsonError(401, "Unauthorized");
  }
  return orgId;
}
