import { randomUUID } from "crypto"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { SequenceEditor } from "@/components/sequences/SequenceEditor"

export default function NewSequencePage() {
  const id = randomUUID()
  return (
    <SidebarInset>
      <SiteHeader title="New Sequence" />
      <div className="p-4">
        <SequenceEditor sequenceId={id} />
      </div>
    </SidebarInset>
  )
}
