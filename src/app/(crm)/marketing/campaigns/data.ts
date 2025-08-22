import { z } from "zod"

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["draft", "scheduled", "sending", "sent"]),
  recipients: z.string(),
  updatedAt: z.string(),
})

export type Campaign = z.infer<typeof campaignSchema>

export const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Welcome Series",
    status: "draft",
    recipients: "120 contacts",
    updatedAt: "2024-05-01",
  },
  {
    id: "2",
    name: "Spring Fundraiser",
    status: "sent",
    recipients: "250 contacts",
    updatedAt: "2024-04-15",
  },
]
