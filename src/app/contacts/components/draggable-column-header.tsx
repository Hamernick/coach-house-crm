"use client"

import * as React from "react"
import { Header, flexRender } from "@tanstack/react-table"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import { TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"
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
  const sorted = header.column.getIsSorted()
  const SortIcon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ChevronsUpDown

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={cn("cursor-pointer select-none", isDragging && "opacity-50")}
      onClick={
        header.column.getCanSort()
          ? header.column.getToggleSortingHandler()
          : undefined
      }
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center">
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        {header.column.getCanSort() && <SortIcon className="ml-2 h-4 w-4" />}
      </div>
    </TableHead>
  )
}

