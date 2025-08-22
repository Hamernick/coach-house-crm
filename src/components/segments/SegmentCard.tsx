'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { SegmentDraft } from './SegmentEditorDialog'

interface SegmentCardProps {
  segment: SegmentDraft
  onEdit: () => void
}

export function SegmentCard({ segment, onEdit }: SegmentCardProps) {
  return (
    <Card className="@container/card cursor-pointer" onClick={onEdit}>
      <CardHeader>
        <CardTitle className="text-base font-medium">{segment.name || 'Untitled'}</CardTitle>
      </CardHeader>
      {segment.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{segment.description}</p>
        </CardContent>
      )}
    </Card>
  )
}
