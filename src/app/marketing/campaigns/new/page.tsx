import { randomUUID } from "crypto"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { CampaignComposer } from "@/components/marketing/CampaignComposer"

export default function NewCampaignPage() {
  const id = randomUUID()

  return (
    <SidebarInset>
      <SiteHeader title="New Campaign" />
      <div className="p-4">
        <CampaignComposer campaignId={id} />
      </div>
    </SidebarInset>
  )
}
