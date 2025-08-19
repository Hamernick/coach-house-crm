import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export default function DashboardPage() {
  return (
    <SidebarInset>
      <SiteHeader />
      <div className="space-y-4 p-4">
        <SectionCards />
        <ChartAreaInteractive />
      </div>
    </SidebarInset>
  )
}
