"use client"

import dynamic from "next/dynamic"

const MailyEditor = dynamic(
  () => import("maily").then((mod: any) => mod.Editor),
  { ssr: false, loading: () => <div>Loading editor...</div> }
)

interface TemplateEditorProps {
  templateId?: string
}

export function TemplateEditor({ templateId }: TemplateEditorProps) {
  return (
    <div className="rounded border p-2">
      <MailyEditor key={templateId} />
    </div>
  )
}
