'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function SegmentEmptyCard({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="flex h-full items-center justify-center" data-empty>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-sm text-muted-foreground">No segments yet</p>
        <Button onClick={onCreate}>Create segment</Button>
      </CardContent>
    </Card>
  )
}
