'use client'

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SegmentCard } from './SegmentCard'
import { SegmentEmptyCard } from './SegmentEmptyCard'
import { SegmentEditorDialog, SegmentDraft } from './SegmentEditorDialog'

export function SegmentsSection() {
  const [segments, setSegments] = useState<SegmentDraft[]>([])
  const [editing, setEditing] = useState<SegmentDraft | null>(null)

  function handleChange(segment: SegmentDraft) {
    setSegments((prev) => {
      const exists = prev.find((s) => s.id === segment.id)
      if (exists) {
        return prev.map((s) => (s.id === segment.id ? segment : s))
      }
      return [...prev, segment]
    })
  }

  function createNew() {
    setEditing({
      id: Date.now().toString(),
      name: '',
      description: '',
      category: '',
      members: [],
    })
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Segments</h2>
        {segments.length > 0 && (
          <Button onClick={createNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Segment
          </Button>
        )}
      </div>
      {segments.length === 0 ? (
        <SegmentEmptyCard onCreate={createNew} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((segment) => (
            <SegmentCard key={segment.id} segment={segment} onEdit={() => setEditing(segment)} />
          ))}
        </div>
      )}
      <SegmentEditorDialog
        open={!!editing}
        segment={editing}
        onClose={() => setEditing(null)}
        onChange={handleChange}
        onSave={handleChange}
      />
    </section>
  )
}
