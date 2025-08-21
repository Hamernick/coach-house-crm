import { NextRequest, NextResponse } from "next/server";
import { Maily } from "@maily-to/render";

export async function POST(req: NextRequest) {
  const { json, variables = {}, payload = {} } = await req.json();

  const m = new Maily(json);

  for (const [key, value] of Object.entries(variables)) {
    m.setVariableValue(key, value as any);
  }

  for (const [key, value] of Object.entries(payload)) {
    m.setPayloadValue(key, value as any);
  }

  const html = await m.render();

  return NextResponse.json({ html });
}

