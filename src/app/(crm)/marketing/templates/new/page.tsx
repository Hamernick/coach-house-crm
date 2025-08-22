import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { TemplateEditor } from "@/components/marketing/TemplateEditor"

export default function NewTemplatePage() {
  return (
    <SidebarInset>
      <SiteHeader title="New Template" />
      <div className="p-4">
        <TemplateEditor />
      </div>
    </SidebarInset>
  )
}
