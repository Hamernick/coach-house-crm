import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

export default function MarketingPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Marketing" />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Marketing</h1>
      </div>
    </SidebarInset>
  )
}
