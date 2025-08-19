import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

export default function SettingsPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Settings" />
      <div className="p-4">
      </div>
    </SidebarInset>
  )
}
