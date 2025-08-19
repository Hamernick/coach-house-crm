import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

export default function SettingsPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Settings" />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
    </SidebarInset>
  )
}
