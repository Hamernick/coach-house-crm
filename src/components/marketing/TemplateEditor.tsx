"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import { renderEmail } from "@/lib/email/render"

const MailyEditor = dynamic(
  () => import("maily").then((mod: any) => mod.Editor),
  { ssr: false, loading: () => <div>Loading editor...</div> }
)

interface TemplateEditorProps {
  templateId?: string
}

export function TemplateEditor({ templateId }: TemplateEditorProps) {
  const timeoutRef = useRef<NodeJS.Timeout>()

  const persist = async (json: any) => {
    if (!templateId) return
    const html = renderEmail((json?.blocks as any[]) || [])
    await fetch(`/api/templates/${templateId}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentJson: json, html }),
    })
  }

  const handleChange = (json: any) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => persist(json), 500)
  }

  return (
    <div className="rounded border p-2">
      <MailyEditor key={templateId} onChange={handleChange} />
    </div>
  )
}
