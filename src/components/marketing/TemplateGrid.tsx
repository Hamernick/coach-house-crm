"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

import { templates } from "./templates"

export function TemplateGrid() {
  const router = useRouter()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <div key={template.id} className="space-y-2 rounded border p-4">
          <div
            className="aspect-video w-full overflow-hidden rounded border bg-background"
            dangerouslySetInnerHTML={{ __html: template.preview }}
          />
          <div className="flex items-center justify-between">
            <div className="font-medium">{template.name}</div>
            <Button
              size="sm"
              onClick={() =>
                router.push(`/contacts/campaigns/new?template=${template.id}`)
              }
            >
              Use template
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
