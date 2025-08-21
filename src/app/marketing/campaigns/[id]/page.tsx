import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { CampaignComposer } from "@/components/marketing/CampaignComposer"

export default function CampaignPage({ params }: { params: { id: string } }) {
  return (
    <SidebarInset>
      <SiteHeader title="Campaign" />
      <div className="p-4">
        <CampaignComposer campaignId={params.id} />
      </div>
    </SidebarInset>
  )
}
