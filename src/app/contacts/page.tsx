import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

export default function ContactsPage() {
  return (
    <SidebarInset>
      <SiteHeader />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Contacts</h1>
      </div>
    </SidebarInset>
  )
}
