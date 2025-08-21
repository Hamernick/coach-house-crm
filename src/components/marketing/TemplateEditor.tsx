"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { templates } from "./templates"

const MailyEditor = dynamic(
  () => import("maily").then((mod: any) => mod.Editor),
  { ssr: false, loading: () => <div>Loading editor...</div> }
)

interface TemplateEditorProps {
  templateId?: string
}

export function TemplateEditor({ templateId }: TemplateEditorProps) {
  const template = templates.find((t) => t.id === templateId)
  const sampleVariables: Record<string, string> = {
    first_name: "Jane",
    company: "ACME Co",
  }
  const segments = [
    { id: "all", name: "All Contacts", count: 1200 },
    { id: "vip", name: "VIP", count: 42 },
  ]
  const [html, setHtml] = useState<string | null>(null)

  async function handlePreview() {
    const res = await fetch("/api/email/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content_json: JSON.stringify(template?.blocks ?? []),
        variables: sampleVariables,
      }),
    })
    const data = await res.json()
    setHtml(data.html)
  }

  return (
    <div className="flex gap-4">
      <div className="flex-1 space-y-4">
        <div className="rounded border p-2">
          <MailyEditor key={templateId} />
        </div>
        {html && (
          <iframe
            srcDoc={html}
            className="h-[600px] w-full rounded border"
            title="Preview"
          />
        )}
      </div>
      <aside className="w-64 space-y-4">
        <div>
          <div className="mb-2 font-medium">Variables</div>
          <ul className="space-y-1 text-sm">
            {Object.keys(sampleVariables).map((v) => (
              <li key={v}>{`{{${v}}}`}</li>
            ))}
          </ul>
        </div>
        <Button onClick={handlePreview}>Preview</Button>
        <div>
          <div className="mb-2 font-medium">Segments</div>
          <ul className="space-y-1 text-sm">
            {segments.map((s) => (
              <li key={s.id}>
                {s.name}: {s.count}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
