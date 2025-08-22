import Link from "next/link"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

import { campaigns } from "./data"

export default function CampaignsPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Campaigns" />
      <div className="p-4 space-y-4">
        <div>
          <Button asChild>
            <Link href="/contacts/campaigns/new">New Campaign</Link>
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Scheduled</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">
                  <Link href={`/contacts/campaigns/${c.id}`}>{c.name}</Link>
                </td>
                <td className="p-2">{c.status}</td>
                <td className="p-2">{c.scheduledAt ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SidebarInset>
  )
}
