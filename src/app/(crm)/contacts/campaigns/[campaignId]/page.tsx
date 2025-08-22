import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { CampaignComposer } from "@/components/campaigns/CampaignComposer"

export default function CampaignPage({ params }: { params: { campaignId: string } }) {
  return (
    <SidebarInset>
      <SiteHeader title="Campaign" />
      <div className="p-4">
        <CampaignComposer campaignId={params.campaignId} />
      </div>
    </SidebarInset>
  )
}
