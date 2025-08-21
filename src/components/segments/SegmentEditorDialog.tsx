'use client'

import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SegmentFiltersBuilder, SegmentFilter } from './SegmentFiltersBuilder'
import { useAutosave } from '@/hooks/use-autosave'
import { SegmentMembersTable } from './SegmentMembersTable'

export interface SegmentDraft {
  id: string
  name: string
  subtitle: string
  category: string
  filtersMode: 'any' | 'all'
  filters: SegmentFilter[]
  members: string[]
}

interface SegmentEditorDialogProps {
  open: boolean
  segment: SegmentDraft | null
  onClose: () => void
  onChange: (segment: SegmentDraft) => void
  onSave: (segment: SegmentDraft) => void
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

export function SegmentEditorDialog({
  open,
  segment,
  onClose,
  onChange,
  onSave,
}: SegmentEditorDialogProps) {
  const empty: SegmentDraft = {
    id: '',
    name: '',
    subtitle: '',
    category: '',
    filtersMode: 'any',
    filters: [],
    members: [],
  }
  const { draft, setDraft, saving, savedAt } = useAutosave<SegmentDraft>({
    key: segment ? `segment-${segment.id}` : undefined,
    initialData: segment ?? empty,
    onSave: onChange,
  })

  if (!segment) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{draft.name || 'New Segment'}</DialogTitle>
            <AutosaveBadge saving={saving} savedAt={savedAt} />
          </div>
          <DialogDescription>Define your contact segment.</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-4">
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
          </div>
          <Separator />
          <SegmentFiltersBuilder
            value={{ mode: draft.filtersMode, filters: draft.filters }}
            onChange={(v) =>
              setDraft({ ...draft, filtersMode: v.mode, filters: v.filters })
            }
          />
          <Separator />
          <SegmentMembersTable
            value={draft.members}
            onChange={(members) => setDraft({ ...draft, members })}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(draft)}>Save Segment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
