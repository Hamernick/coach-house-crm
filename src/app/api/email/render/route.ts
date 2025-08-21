import { NextRequest, NextResponse } from "next/server";
import { renderEmail, EmailBlock } from "@/lib/email/render";
import { jsonError } from "@/lib/api";

function applyVariables(html: string, variables: Record<string, string>): string {
  return Object.entries(variables || {}).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), String(value)),
    html,
  );
}

export async function POST(req: NextRequest) {
  try {
    const { content_json, variables } = await req.json();
    const blocks: EmailBlock[] =
      typeof content_json === "string" ? JSON.parse(content_json) : content_json;
    let html = renderEmail(blocks);
    if (variables && typeof variables === "object") {
      html = applyVariables(html, variables as Record<string, string>);
    }
    return NextResponse.json({ html });
  } catch (err) {
    return jsonError(400, "Invalid content_json");
  }
}