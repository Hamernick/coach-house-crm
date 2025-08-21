'use client'

import { useState } from 'react'
import { SegmentCard } from './SegmentCard'
import { SegmentEmptyCard } from './SegmentEmptyCard'
import { SegmentEditorSheet, SegmentDraft } from './SegmentEditorSheet'

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

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Segments</h2>
      {segments.length === 0 ? (
        <SegmentEmptyCard
          onCreate={() =>
            setEditing({
              id: Date.now().toString(),
              name: '',
              subtitle: '',
              category: '',
              filtersMode: 'any',
              filters: [],
            })
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((segment) => (
            <SegmentCard key={segment.id} segment={segment} onEdit={() => setEditing(segment)} />
          ))}
          <SegmentEmptyCard
            onCreate={() =>
              setEditing({
                id: Date.now().toString(),
                name: '',
                subtitle: '',
                category: '',
                filtersMode: 'any',
                filters: [],
              })
            }
          />
        </div>
      )}
      <SegmentEditorSheet
        open={!!editing}
        segment={editing}
        onClose={() => setEditing(null)}
        onChange={handleChange}
      />
    </section>
  )
}
