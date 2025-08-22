import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import SequenceList from "@/components/sequences/SequenceList"

export default function SequencesPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Sequences" />
      <div className="p-4">
        <SequenceList />
      </div>
    </SidebarInset>
  )
}

