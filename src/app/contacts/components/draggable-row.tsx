"use client"

import * as React from "react"
import { Row, flexRender } from "@tanstack/react-table"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TableRow, TableCell } from "@/components/ui/table"
import type { Contact } from "../data"

interface DraggableRowProps {
  row: Row<Contact>
}

export function DraggableRow({ row }: DraggableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: row.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-50" : ""}
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell) => {
        if (cell.column.id === "drag") {
          return (
            <TableCell key={cell.id}>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 cursor-grab"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
                <span className="sr-only">Drag row</span>
              </Button>
            </TableCell>
          )
        }
        return (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

