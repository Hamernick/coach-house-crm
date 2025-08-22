import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Dashboard } from "@/components/marketing/Dashboard"

export default function MarketingPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Marketing" />
      <div className="p-4">
        <Dashboard />
      </div>
    </SidebarInset>
  )
}
