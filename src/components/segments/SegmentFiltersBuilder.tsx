'use client'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectSeparator } from '@/components/ui/select'
import { Megaphone, BarChart, Mail, PlusCircle } from 'lucide-react'

interface SegmentFiltersBuilderProps {
  value: string
  onChange: (value: string) => void
}

export function SegmentFiltersBuilder({ value, onChange }: SegmentFiltersBuilderProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="campaign">
          <Megaphone className="mr-2 h-4 w-4" /> Campaign
        </SelectItem>
        <SelectItem value="report">
          <BarChart className="mr-2 h-4 w-4" /> Report
        </SelectItem>
        <SelectItem value="email">
          <Mail className="mr-2 h-4 w-4" /> Email lists
        </SelectItem>
        <SelectSeparator />
        <SelectItem value="new">
          <PlusCircle className="mr-2 h-4 w-4" /> Create new
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
