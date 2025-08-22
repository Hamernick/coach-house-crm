import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { TemplateGrid } from "@/components/marketing/TemplateGrid"

export default function TemplatesPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Templates" />
      <div className="p-4">
        <TemplateGrid />
      </div>
    </SidebarInset>
  )
}
