'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { contacts } from '@/app/contacts/data'

interface SegmentMembersTableProps {
  value: string[]
  onChange: (ids: string[]) => void
}

export function SegmentMembersTable({ value, onChange }: SegmentMembersTableProps) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(
    () =>
      contacts.filter((c) => {
        const name = `${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase()
        return (
          name.includes(query.toLowerCase()) ||
          c.primaryEmail.toLowerCase().includes(query.toLowerCase())
        )
      }),
    [query]
  )

  const toggle = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...value, id])
    } else {
      onChange(value.filter((v) => v !== id))
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder="Search contacts"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="max-h-60 overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Checkbox
                    checked={value.includes(c.id)}
                    onCheckedChange={(checked) =>
                      toggle(c.id, !!checked)
                    }
                  />
                </TableCell>
                <TableCell>{`${c.firstName ?? ''} ${c.lastName ?? ''}`}</TableCell>
                <TableCell>{c.primaryEmail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
