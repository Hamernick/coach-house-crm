import { z } from "zod"

export const contactSchema = z.object({
  id: z.string(), // Unique ID
  type: z.enum([
    "Individual",
    "Organization",
    "Foundation",
    "Government",
    "Corporate",
    "Other",
  ]),
  roles: z.array(z.string()).optional(), // For multi-select
  // Basic Info
  honorific: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  aliases: z.string().optional(),
  attribution: z.string().optional(),
  pronouns: z.enum(["He/Him", "She/Her", "They/Them", "Other"]).optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  // Communication
  primaryEmail: z.string().email(),
  alternateEmails: z.array(z.string().email()).max(2).optional(),
  website: z.string().url().optional(),
  socialMedia: z.string().url().optional(),
  // Address
  primaryAddress: z
    .object({
      country: z.string(),
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    })
    .optional(),
  // Phone
  phoneNumbers: z.array(z.string()).max(3).optional(),
  // Other Personal Info
  dateOfBirth: z.string().optional(),
  // Documents & Lists
  documents: z.array(z.any()).optional(),
  mailingLists: z.array(z.string()).optional(),
  // Donations
  donations: z
    .array(
      z.object({
        amount: z.number(),
        date: z.string().optional(),
      })
    )
    .optional(),
  doNotEmail: z.boolean().default(false),
})

export type Contact = z.infer<typeof contactSchema>

export const contacts: Contact[] = [
  {
    id: "1",
    type: "Individual",
    roles: ["Donor"],
    firstName: "Alice",
    lastName: "Johnson",
    jobTitle: "CEO",
    company: "Acme Inc",
    primaryEmail: "alice@example.com",
    phoneNumbers: ["123-456-7890"],
    mailingLists: ["Newsletter"],
    donations: [
      { amount: 500, date: "2024-03-15" },
      { amount: 250, date: "2024-06-01" },
    ],
    doNotEmail: false,
  },
  {
    id: "2",
    type: "Organization",
    firstName: "Beta",
    lastName: "Corp",
    company: "Beta Corp",
    primaryEmail: "contact@betacorp.com",
    mailingLists: ["Newsletter", "Events"],
    donations: [{ amount: 1000, date: "2024-02-10" }],
    doNotEmail: false,
  },
  {
    id: "3",
    type: "Individual",
    firstName: "Carol",
    lastName: "Davis",
    jobTitle: "Product Manager",
    company: "Creative Solutions",
    primaryEmail: "carol@example.com",
    phoneNumbers: ["555-555-5555"],
    donations: [],
    doNotEmail: true,
  },
]
