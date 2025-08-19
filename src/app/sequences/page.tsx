import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

export default function SequencesPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Sequences" />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Sequences</h1>
      </div>
    </SidebarInset>
  )
}
