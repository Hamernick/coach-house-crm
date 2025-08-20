"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import {
  ChevronsUpDown,
  Columns as ColumnsIcon,
  Plus,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react"
import { toast } from "sonner"

import { type Contact } from "./data"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ContactDrawer } from "./components/contact-drawer"
import { RowActions } from "./components/row-actions"
import { DraggableColumnHeader } from "./components/draggable-column-header"
import { DraggableRow } from "./components/draggable-row"

interface ContactsDataTableProps {
  data: Contact[]
}

export function ContactsDataTable({ data }: ContactsDataTableProps) {
  const [contacts, setContacts] = React.useState<Contact[]>(data)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [current, setCurrent] = React.useState<Contact | null>(null)

  const createEmptyContact = React.useCallback((): Contact => ({
    id: Date.now().toString(),
    type: "Individual",
    roles: [],
    firstName: "",
    middleName: "",
    lastName: "",
    primaryEmail: "",
    alternateEmails: [],
    phoneNumbers: [""],
    mailingLists: [],
    attribution: "",
    doNotEmail: false,
  }), [])

  const openDrawer = React.useCallback((contact: Contact) => {
    setCurrent(contact)
    setDrawerOpen(true)
  }, [])

  const saveContact = (contact: Contact) => {
    const promise = new Promise((resolve) => {
      setContacts((prev) => {
        const index = prev.findIndex((c) => c.id === contact.id)
        if (index !== -1) {
          const updated = [...prev]
          updated[index] = contact
          return updated
        }
        return [...prev, contact]
      })
      setTimeout(resolve, 500)
    })
    toast.promise(promise, {
      loading: "Saving contact...",
      success: "Contact saved!",
      error: "Error saving contact",
    })
  }

  const deleteContact = React.useCallback((id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const columns = React.useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "drag",
        header: "",
        cell: () => null,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        meta: { label: "Type" },
      },
      {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => row.original.roles?.join(", ") ?? "",
        meta: { label: "Roles" },
      },
      {
        accessorKey: "honorific",
        header: "Honorific",
        meta: { label: "Honorific" },
      },
      {
        accessorKey: "firstName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            First Name
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const c = row.original
          return (
            <Button variant="link" onClick={() => openDrawer(c)}>
              {c.firstName}
            </Button>
          )
        },
        meta: { label: "First Name" },
      },
      {
        accessorKey: "middleName",
        header: "Middle Name",
        meta: { label: "Middle Name" },
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        meta: { label: "Last Name" },
      },
      {
        accessorKey: "aliases",
        header: "Aliases / Other Names",
        meta: { label: "Aliases / Other Names" },
      },
      {
        accessorKey: "attribution",
        header: "How to Credit Publicly?",
        meta: { label: "Attribution" },
      },
      {
        accessorKey: "pronouns",
        header: "Pronouns",
        meta: { label: "Pronouns" },
      },
      {
        accessorKey: "jobTitle",
        header: "Job Title",
        meta: { label: "Job Title" },
      },
      {
        accessorKey: "company",
        header: "Company / Organization Name",
        meta: { label: "Company / Organization Name" },
      },
      {
        accessorKey: "primaryEmail",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        meta: { label: "Email" },
      },
      {
        accessorKey: "alternateEmails",
        header: "Alternate email addresses",
        cell: ({ row }) => row.original.alternateEmails?.join(", ") ?? "",
        meta: { label: "Alternate email addresses" },
      },
      {
        accessorKey: "website",
        header: "Website",
        meta: { label: "Website" },
      },
      {
        id: "country",
        accessorFn: (row) => row.primaryAddress?.country ?? "",
        header: "Country",
        meta: { label: "Country" },
      },
      {
        id: "street",
        accessorFn: (row) => row.primaryAddress?.street ?? "",
        header: "Street Address",
        meta: { label: "Street Address" },
      },
      {
        id: "city",
        accessorFn: (row) => row.primaryAddress?.city ?? "",
        header: "City",
        meta: { label: "City" },
      },
      {
        id: "state",
        accessorFn: (row) => row.primaryAddress?.state ?? "",
        header: "State / Region",
        meta: { label: "State / Region" },
      },
      {
        id: "zip",
        accessorFn: (row) => row.primaryAddress?.zip ?? "",
        header: "Zip / Postal Code",
        meta: { label: "Zip / Postal Code" },
      },
      {
        id: "phone1",
        accessorFn: (row) => row.phoneNumbers?.[0] ?? "",
        header: "Phone Number 1",
        meta: { label: "Phone Number 1" },
      },
      {
        id: "phone2",
        accessorFn: (row) => row.phoneNumbers?.[1] ?? "",
        header: "Phone Number 2",
        meta: { label: "Phone Number 2" },
      },
      {
        id: "phone3",
        accessorFn: (row) => row.phoneNumbers?.[2] ?? "",
        header: "Phone Number 3",
        meta: { label: "Phone Number 3" },
      },
      {
        accessorKey: "dateOfBirth",
        header: "Date of Birth",
        meta: { label: "Date of Birth" },
      },
      {
        accessorKey: "documents",
        header: "Documents",
        cell: ({ row }) => {
          const docs = row.original.documents?.length ?? 0
          return <span>{docs}</span>
        },
        meta: { label: "Documents" },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <RowActions
            onView={() => openDrawer(row.original)}
            onEdit={() => openDrawer(row.original)}
            onDelete={() => deleteContact(row.original.id)}
          />
        ),
        enableHiding: false,
      },
    ],
    [openDrawer, deleteContact]
  )

  React.useEffect(() => {
    setColumnOrder(
      columns.map(
        (c) => (c.id ?? ((c as { accessorKey?: string }).accessorKey as string))!
      )
    )
  }, [columns])

  const table = useReactTable({
    data: contacts,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnOrder,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    if (!columnOrder.includes(active.id as string)) return
    setColumnOrder((cols) => {
      const oldIndex = cols.indexOf(active.id as string)
      const newIndex = cols.indexOf(over.id as string)
      return arrayMove(cols, oldIndex, newIndex)
    })
  }

  const handleRowDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setContacts((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id)
      const newIndex = prev.findIndex((c) => c.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    handleColumnDragEnd(event)
    handleRowDragEnd(event)
  }

  const handleAddNew = () => {
    openDrawer(createEmptyContact())
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter contacts..."
          value={(table.getColumn("firstName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("firstName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ColumnsIcon className="mr-2 h-4 w-4" />
                Customize Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const label =
                    (column.columnDef.meta as { label?: string } | undefined)
                      ?.label ?? column.id
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48">
              <div className="flex flex-col">
                <Button variant="ghost" className="justify-start" onClick={handleAddNew}>
                  Add New Contact
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => toast("Upload not implemented")}
                >
                  Upload .csv
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => toast("Download not implemented")}
                >
                  Download .csv
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="rounded-md border overflow-hidden">
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext
            items={table.getRowModel().rows.map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <SortableContext
                    key={headerGroup.id}
                    items={columnOrder.filter(
                      (id) =>
                        !["select", "drag", "actions"].includes(id) &&
                        table.getColumn(id)?.getIsVisible()
                    )}
                    strategy={horizontalListSortingStrategy}
                  >
                    <TableRow className="bg-muted">
                      {headerGroup.headers.map((header) => {
                        const id = header.column.id
                        return ["select", "drag", "actions"].includes(id) ? (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ) : (
                          <DraggableColumnHeader key={header.id} header={header} />
                        )
                      })}
                    </TableRow>
                  </SortableContext>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </div>
      <div className="flex items-center py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex-1 flex items-center justify-center space-x-2">
          <span className="text-sm">Rows per page</span>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ContactDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        contact={current}
        onSave={(c) => {
          saveContact(c)
          setDrawerOpen(false)
        }}
      />
    </div>
  )
}
