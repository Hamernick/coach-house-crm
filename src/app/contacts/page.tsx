import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

import { contacts } from "./data"
import { ContactsDataTable } from "./contacts-data-table"

export default function ContactsPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Contacts" />
      <div className="p-4">
        <ContactsDataTable data={contacts} />
      </div>
    </SidebarInset>
  )
}
