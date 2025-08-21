import Link from "next/link"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { campaigns } from "./data"

export default function CampaignsPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Campaigns" />
      <div className="p-4 space-y-4">
        <div>
          <Button asChild>
            <Link href="/marketing/campaigns/new">New Campaign</Link>
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Recipients</th>
              <th className="p-2">Updated</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">
                  <Link href={`/marketing/campaigns/${c.id}`}>{c.name}</Link>
                </td>
                <td className="p-2">
                  <Badge variant="outline">{c.status}</Badge>
                </td>
                <td className="p-2">{c.recipients}</td>
                <td className="p-2">{c.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SidebarInset>
  )
}
