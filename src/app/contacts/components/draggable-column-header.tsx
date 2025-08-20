"use client"

import * as React from "react"
import { Header, flexRender } from "@tanstack/react-table"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { TableHead } from "@/components/ui/table"
import type { Contact } from "../data"

interface DraggableColumnHeaderProps {
  header: Header<Contact, unknown>
}

export function DraggableColumnHeader({ header }: DraggableColumnHeaderProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: header.column.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-50" : ""}
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </TableHead>
  )
}

