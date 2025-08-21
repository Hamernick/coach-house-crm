import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { TemplateEditor } from "@/components/marketing/TemplateEditor"

interface TemplatePageProps {
  params: { id: string }
}

export default function TemplatePage({ params }: TemplatePageProps) {
  return (
    <SidebarInset>
      <SiteHeader title="Edit Template" />
      <div className="p-4">
        <TemplateEditor templateId={params.id} />
      </div>
    </SidebarInset>
  )
}
