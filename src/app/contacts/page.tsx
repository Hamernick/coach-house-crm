import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

import { contacts } from "./data"
import { ContactsDataTable } from "./contacts-data-table"
import { SegmentsSection } from "@/components/segments/SegmentsSection"

export default function ContactsPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Contacts" />
      <div className="p-4 space-y-8">
        <ContactsDataTable data={contacts} />
        <SegmentsSection />
      </div>
    </SidebarInset>
  )
}
