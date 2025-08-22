import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { SequenceEditor } from "@/components/sequences/SequenceEditor"

export default function SequenceEditorPage({
  params,
}: {
  params: { sequenceId: string }
}) {
  return (
    <SidebarInset>
      <SiteHeader title="Edit Sequence" />
      <div className="p-4">
        <SequenceEditor sequenceId={params.sequenceId} />
      </div>
    </SidebarInset>
  )
}
