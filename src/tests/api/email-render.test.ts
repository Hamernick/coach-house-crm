import { describe, it, expect } from "vitest"
import { NextRequest } from "next/server"
import { POST } from "@/app/api/email/render/route"

describe("email render api", () => {
  it("renders blocks with variables", async () => {
    const blocks = [
      { id: "1", type: "heading", content: "Hello {{name}}" },
      { id: "2", type: "paragraph", content: "Welcome" },
    ]
    const req = new NextRequest("http://test.com", {
      method: "POST",
      body: JSON.stringify({
        content_json: JSON.stringify(blocks),
        variables: { name: "Alice" },
      }),
    })
    const res = await POST(req)
    const data = await res.json()
    expect(data.html).toContain("<h1>Hello Alice</h1>")
  })
})
