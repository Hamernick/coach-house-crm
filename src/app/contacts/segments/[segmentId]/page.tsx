import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

import { SegmentDetail } from "./segment-detail"

interface SegmentPageProps {
  params: { segmentId: string }
}

export default function SegmentPage({ params }: SegmentPageProps) {
  return (
    <SidebarInset>
      <SiteHeader title={`Segment ${params.segmentId}`} />
      <SegmentDetail />
    </SidebarInset>
  )
}

