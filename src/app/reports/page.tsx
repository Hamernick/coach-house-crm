import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

export default function ReportsPage() {
  return (
    <SidebarInset>
      <SiteHeader />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>
    </SidebarInset>
  )
}
