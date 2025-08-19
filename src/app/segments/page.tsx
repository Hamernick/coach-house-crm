import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

export default function SegmentsPage() {
  return (
    <SidebarInset>
      <SiteHeader />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Segments</h1>
      </div>
    </SidebarInset>
  )
}
