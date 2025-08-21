"use client"

import { Input } from "@/components/ui/input"
import type { EmailBlock } from "@/lib/email/render"

interface BlockProps {
  block: EmailBlock
  onChange: (block: EmailBlock) => void
}

export function HeadingBlock({ block, onChange }: BlockProps) {
  return (
    <Input
      value={block.content}
      onChange={(e) => onChange({ ...block, content: e.target.value })}
      placeholder="Heading text"
    />
  )
}
