import { randomUUID } from "crypto"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { CampaignComposer } from "@/components/marketing/CampaignComposer"

export default function NewCampaignPage() {
  const id = randomUUID()

  return (
    <SidebarInset>
      <SiteHeader title="New Campaign" />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-5xl rounded-lg border bg-background p-4 shadow">
          <CampaignComposer campaignId={id} />
        </div>
      </div>
    </SidebarInset>
  )
}
