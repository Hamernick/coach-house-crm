"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BreadcrumbPortal } from "@/components/shared/BreadcrumbPortal"
import { useAutosave } from "@/hooks/use-autosave"
import { MailyEditor } from "./MailyEditor"

interface Draft {
  subject: string
  content: string
  recipients: string[]
  sendAt: string
}

interface CampaignComposerProps {
  campaignId: string
}

function AutosaveBadge({
  saving,
  savedAt,
}: {
  saving: boolean
  savedAt: Date | null
}) {
  return (
    <Badge variant="outline">
      {saving ? "Saving..." : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Saved"}
    </Badge>
  )
}

function RecipientsTable({
  recipients,
  onChange,
}: {
  recipients: string[]
  onChange: (recipients: string[]) => void
}) {
  const [value, setValue] = useState("")
  return (
    <div className="space-y-2">
      <div className="font-medium">Recipients</div>
      <table className="w-full text-sm">
        <tbody>
          {recipients.map((r) => (
            <tr key={r} className="border-t">
              <td className="p-1">{r}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2">
        <Input
          value={value}
          placeholder="email@example.com"
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          type="button"
          onClick={() => {
            const v = value.trim()
            if (v) {
              onChange([...recipients, v])
              setValue("")
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  )
}

export function CampaignComposer({ campaignId }: CampaignComposerProps) {
  const { draft, setDraft, saving, savedAt } = useAutosave<Draft>({
    key: campaignId ? `campaign-${campaignId}` : undefined,
    initialData: { subject: "", content: "", recipients: [], sendAt: "" },
  })

  return (
    <div className="space-y-6">
      <BreadcrumbPortal>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/marketing">Marketing</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {draft.subject || "New Campaign"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </BreadcrumbPortal>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{draft.subject || "Untitled Campaign"}</h1>
        <AutosaveBadge saving={saving} savedAt={savedAt} />
      </div>

      <Input
        placeholder="Subject"
        value={draft.subject}
        onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
      />

      <MailyEditor />

      <RecipientsTable
        recipients={draft.recipients}
        onChange={(r) => setDraft({ ...draft, recipients: r })}
      />

      <div className="space-y-2">
        <Input
          type="datetime-local"
          value={draft.sendAt}
          onChange={(e) => setDraft({ ...draft, sendAt: e.target.value })}
        />
        <Button type="button">Schedule</Button>
      </div>
    </div>
  )
}
