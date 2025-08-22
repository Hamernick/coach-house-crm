import { z } from "zod"

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["DRAFT", "SCHEDULED", "SENDING", "SENT"]),
  scheduledAt: z.string().optional(),
})

export type Campaign = z.infer<typeof campaignSchema>

export const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Welcome Series",
    status: "DRAFT",
  },
  {
    id: "2",
    name: "Spring Fundraiser",
    status: "SCHEDULED",
    scheduledAt: "2025-05-01T09:00",
  },
]
