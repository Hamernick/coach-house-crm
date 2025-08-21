
import { renderEmail, EmailBlock } from "@/lib/email/render"

function applyVariables(html: string, variables: Record<string, string>): string {
  return Object.entries(variables || {}).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), String(value)),
    html,
  )
}

export async function POST(req: Request) {
  try {
    const { content_json, variables } = await req.json()
    const blocks: EmailBlock[] =
      typeof content_json === "string" ? JSON.parse(content_json) : content_json
    let html = renderEmail(blocks)
    if (variables && typeof variables === "object") {
      html = applyVariables(html, variables as Record<string, string>)
    }
    return Response.json({ html })
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid content_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
}