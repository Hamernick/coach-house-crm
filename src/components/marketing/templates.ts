import type { EmailBlock } from "@/lib/email/render"
import { renderEmail } from "@/lib/email/render"

export interface EmailTemplate {
  id: string
  name: string
  preview: string
  blocks: EmailBlock[]
}

const welcomeBlocks: EmailBlock[] = [
  { id: "welcome-heading", type: "heading", content: "Welcome!" },
  {
    id: "welcome-paragraph",
    type: "paragraph",
    content: "Thanks for joining our newsletter.",
  },
]

const saleBlocks: EmailBlock[] = [
  { id: "sale-heading", type: "heading", content: "Big Sale" },
  {
    id: "sale-paragraph",
    type: "paragraph",
    content: "Don't miss out on our latest offers.",
  },
]

export const templates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome Template",
    blocks: welcomeBlocks,
    preview: renderEmail(welcomeBlocks),
  },
  {
    id: "sale",
    name: "Sale Template",
    blocks: saleBlocks,
    preview: renderEmail(saleBlocks),
  },
]
