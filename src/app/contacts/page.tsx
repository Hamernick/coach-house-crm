import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

import { columns } from "./columns"
import { contacts } from "./data"
import { DataTable } from "./data-table"

export default function ContactsPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Contacts" />
      <div className="p-4">
        <DataTable columns={columns} data={contacts} />
      </div>
    </SidebarInset>
  )
}
