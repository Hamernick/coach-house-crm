import { z } from "zod"

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["DRAFT", "SCHEDULED", "SENDING", "SENT"]),
  recipients: z.string(),
  updatedAt: z.string(),
})

export type Campaign = z.infer<typeof campaignSchema>

export const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Welcome Series",
    status: "DRAFT",
    recipients: "120 contacts",
    updatedAt: "2024-05-01",
  },
  {
    id: "2",
    name: "Spring Fundraiser",
    status: "SENT",
    recipients: "250 contacts",
    updatedAt: "2024-04-15",
  },
]
