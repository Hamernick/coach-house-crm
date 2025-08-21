"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmailBlock, renderEmail } from "@/lib/email/render"

import { HeadingBlock } from "./Blocks/HeadingBlock"
import { ParagraphBlock } from "./Blocks/ParagraphBlock"
import { templates } from "@/components/marketing/templates"

interface CampaignComposerProps {
  campaignId: string
}

export function CampaignComposer({ campaignId }: CampaignComposerProps) {
  const storageKey = `campaign-${campaignId}`
  const searchParams = useSearchParams()

  const [title, setTitle] = useState("")
  const [blocks, setBlocks] = useState<EmailBlock[]>([])
  const [status, setStatus] = useState<"DRAFT" | "SCHEDULED">("DRAFT")
  const [scheduledAt, setScheduledAt] = useState("")

  // load draft or template
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setTitle(data.title || "")
        setBlocks(data.blocks || [])
        setStatus(data.status || "DRAFT")
        setScheduledAt(data.scheduledAt || "")
        return
      } catch {}
    }

    const templateId = searchParams.get("template")
    if (templateId) {
      const template = templates.find((t) => t.id === templateId)
      if (template) {
        setTitle(template.name)
        setBlocks(template.blocks)
      }
    }
  }, [storageKey, searchParams])

  // autosave
  useEffect(() => {
    if (typeof window === "undefined") return
    const data = { title, blocks, status, scheduledAt }
    localStorage.setItem(storageKey, JSON.stringify(data))
  }, [title, blocks, status, scheduledAt, storageKey])

  const addBlock = (type: EmailBlock["type"]) => {
    setBlocks([...blocks, { id: crypto.randomUUID(), type, content: "" }])
  }

  const updateBlock = (index: number, block: EmailBlock) => {
    const next = [...blocks]
    next[index] = block
    setBlocks(next)
  }

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index))
  }

  const moveBlock = (index: number, delta: number) => {
    const next = [...blocks]
    const newIndex = index + delta
    if (newIndex < 0 || newIndex >= next.length) return
    const [item] = next.splice(index, 1)
    next.splice(newIndex, 0, item)
    setBlocks(next)
  }

  const previewHtml = useMemo(() => renderEmail(blocks), [blocks])

  const handleSchedule = () => {
    if (scheduledAt) {
      setStatus("SCHEDULED")
    }
  }

  const renderBlock = (block: EmailBlock, index: number) => {
    const common = { block, onChange: (b: EmailBlock) => updateBlock(index, b) }
    switch (block.type) {
      case "heading":
        return <HeadingBlock {...common} />
      case "paragraph":
        return <ParagraphBlock {...common} />
      default:
        return null
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Campaign title"
        />
        {blocks.map((block, index) => (
          <div key={block.id} className="space-y-2 rounded border p-2">
            {renderBlock(block, index)}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveBlock(index, -1)}
              >
                Up
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveBlock(index, 1)}
              >
                Down
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeBlock(index)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <Button type="button" onClick={() => addBlock("heading")}>
            Add Heading
          </Button>
          <Button type="button" onClick={() => addBlock("paragraph")}>
            Add Paragraph
          </Button>
        </div>
        <div className="space-y-2">
          <Input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
          <Button type="button" onClick={handleSchedule}>
            Schedule
          </Button>
          <div className="text-sm text-muted-foreground">Status: {status}</div>
        </div>
      </div>
      <div className="rounded border p-4">
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>
    </div>
  )
}
