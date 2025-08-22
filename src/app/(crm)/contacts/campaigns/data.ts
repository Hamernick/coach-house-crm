import { z } from "zod"

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["draft", "scheduled", "sending", "sent"]),
  scheduledAt: z.string().optional(),
})

export type Campaign = z.infer<typeof campaignSchema>

export const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Welcome Series",
    status: "draft",
  },
  {
    id: "2",
    name: "Spring Fundraiser",
    status: "scheduled",
    scheduledAt: "2025-05-01T09:00",
  },
]
