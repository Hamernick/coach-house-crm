'use client'

import { format } from 'date-fns'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SegmentFiltersBuilder, SegmentFilter } from './SegmentFiltersBuilder'
import { useAutosave } from '@/hooks/use-autosave'

export interface SegmentDraft {
  id: string
  name: string
  subtitle: string
  category: string
  filtersMode: 'any' | 'all'
  filters: SegmentFilter[]
}

interface SegmentEditorSheetProps {
  open: boolean
  segment: SegmentDraft | null
  onClose: () => void
  onChange: (segment: SegmentDraft) => void
}

function AutosaveBadge({
  saving,
  savedAt,
}: {
  saving: boolean
  savedAt: Date | null
}) {
  return (
    <Badge variant="outline">
      {saving ? 'Saving...' : savedAt ? `Saved ${format(savedAt, 'HH:mm')}` : 'Saved'}
    </Badge>
  )
}

export function SegmentEditorSheet({
  open,
  segment,
  onClose,
  onChange,
}: SegmentEditorSheetProps) {
  const empty: SegmentDraft = {
    id: '',
    name: '',
    subtitle: '',
    category: '',
    filtersMode: 'any',
    filters: [],
  }
  const { draft, setDraft, saving, savedAt } = useAutosave<SegmentDraft>({
    key: segment ? `segment-${segment.id}` : undefined,
    initialData: segment ?? empty,
    onSave: onChange,
  })

  if (!segment) return null

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>{draft.name || 'New Segment'}</SheetTitle>
            <AutosaveBadge saving={saving} savedAt={savedAt} />
          </div>
          <SheetDescription>Define your contact segment.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto">
          <Input
            placeholder="Title"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <Input
            placeholder="Subtitle"
            value={draft.subtitle}
            onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
          />
          <Input
            placeholder="Category"
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          />
          <SegmentFiltersBuilder
            value={{ mode: draft.filtersMode, filters: draft.filters }}
            onChange={(v) =>
              setDraft({ ...draft, filtersMode: v.mode, filters: v.filters })
            }
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
