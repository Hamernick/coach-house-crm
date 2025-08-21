'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export type SegmentFilter = {
  id: string
  type: 'tag' | 'emailDomain' | 'date'
  value: string
}

interface BuilderValue {
  mode: 'any' | 'all'
  filters: SegmentFilter[]
}

interface SegmentFiltersBuilderProps {
  value: BuilderValue
  onChange: (value: BuilderValue) => void
}

export function SegmentFiltersBuilder({ value, onChange }: SegmentFiltersBuilderProps) {
  const { mode, filters } = value

  function updateFilter(id: string, patch: Partial<SegmentFilter>) {
    onChange({
      mode,
      filters: filters.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })
  }

  return (
    <div className="space-y-4">
      <Select value={mode} onValueChange={(v) => onChange({ mode: v as 'any' | 'all', filters })}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>

      <div className="space-y-2">
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-center gap-2">
            <Select
              value={filter.type}
              onValueChange={(v) => updateFilter(filter.id, { type: v as SegmentFilter['type'] })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tag">Tag</SelectItem>
                <SelectItem value="emailDomain">Email Domain</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
            <Input
              className="flex-1"
              value={filter.value}
              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
              placeholder="Value"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                onChange({ mode, filters: filters.filter((f) => f.id !== filter.id) })
              }
            >
              ×
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() =>
          onChange({
            mode,
            filters: [...filters, { id: Date.now().toString(), type: 'tag', value: '' }],
          })
        }
      >
        Add filter
      </Button>
    </div>
  )
}
