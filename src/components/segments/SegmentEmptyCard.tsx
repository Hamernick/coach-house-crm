'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export function SegmentEmptyCard({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="mx-auto max-w-md border border-dashed" data-empty>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h3 className="text-base font-semibold">Create a segment</h3>
        <p className="text-sm">No segments yet</p>
        <p className="text-sm text-muted-foreground">
          Filter your contacts for campaigns, reports, email lists, and more.
        </p>
        <Button onClick={onCreate}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Segment
        </Button>
      </CardContent>
    </Card>
  )
}
