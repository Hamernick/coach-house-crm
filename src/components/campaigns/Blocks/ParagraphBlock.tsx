"use client"

import { Textarea } from "@/components/ui/textarea"
import type { EmailBlock } from "@/lib/email/render"

interface BlockProps {
  block: EmailBlock
  onChange: (block: EmailBlock) => void
}

export function ParagraphBlock({ block, onChange }: BlockProps) {
  return (
    <Textarea
      value={block.content}
      onChange={(e) => onChange({ ...block, content: e.target.value })}
      placeholder="Paragraph text"
      className="min-h-[100px]"
    />
  )
}
