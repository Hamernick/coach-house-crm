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
  Row,
  Header,
} from "@tanstack/react-table"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ChevronsUpDown,
  GripVertical,
  Columns as ColumnsIcon,
  Plus,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  MoreVertical,
  Search,
  Calendar as CalendarIcon,
  Upload,
} from "lucide-react"
import { toast } from "sonner"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"

import { useIsMobile } from "@/hooks/use-mobile"
import { contactSchema, type Contact } from "./data"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"

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
        accessorKey: "honorific",
        header: "Honorific",
        meta: { label: "Honorific" },
      },
      {
        accessorKey: "pronouns",
        header: "Pronouns",
        meta: { label: "Pronouns" },
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
        cell: ({ row }) => (
          <Button variant="link" onClick={() => openDrawer(row.original)}>
            {row.original.firstName}
          </Button>
        ),
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
        header: "Aliases",
        meta: { label: "Aliases" },
      },
      {
        accessorKey: "howToCreditPublicly",
        header: "Credit",
        meta: { label: "How to Credit Publicly" },
      },
      {
        accessorKey: "type",
        header: "Type",
        meta: { label: "Type" },
      },
      {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => row.original.roles?.join(", "),
        meta: { label: "Roles" },
      },
      {
        accessorKey: "jobTitle",
        header: "Job Title",
        meta: { label: "Job Title" },
      },
      {
        accessorKey: "company",
        header: "Company",
        meta: { label: "Company" },
      },
      {
        accessorKey: "primaryEmail",
        header: "Primary Email",
        meta: { label: "Primary Email" },
      },
      {
        accessorKey: "alternateEmails",
        header: "Alternate Emails",
        cell: ({ row }) => row.original.alternateEmails?.join(", "),
        meta: { label: "Alternate Emails" },
      },
      {
        accessorKey: "website",
        header: "Website",
        meta: { label: "Website" },
      },
      {
        accessorKey: "socialMedia",
        header: "Social Media",
        meta: { label: "Social Media" },
      },
      {
        accessorKey: "primaryAddress",
        header: "Address",
        cell: ({ row }) => {
          const addr = row.original.primaryAddress
          return addr ? `${addr.city}, ${addr.state}` : ""
        },
        meta: { label: "Primary Address" },
      },
      {
        accessorKey: "phoneNumbers",
        header: "Phone Numbers",
        cell: ({ row }) => row.original.phoneNumbers?.join(", "),
        meta: { label: "Phone Numbers" },
      },
      {
        accessorKey: "dateOfBirth",
        header: "Date of Birth",
        meta: { label: "Date of Birth" },
      },
      {
        accessorKey: "mailingLists",
        header: "Mailing Lists",
        cell: ({ row }) => row.original.mailingLists?.join(", "),
        meta: { label: "Mailing Lists" },
      },
      {
        accessorKey: "doNotEmail",
        header: "Do Not Email",
        cell: ({ row }) => (row.original.doNotEmail ? "Yes" : "No"),
        meta: { label: "Do Not Email" },
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
    setColumnOrder(columns.map((c) => c.id!))
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
    if (active.id !== over?.id) {
      setColumnOrder((cols) => {
        const oldIndex = cols.indexOf(active.id as string)
        const newIndex = cols.indexOf(over?.id as string)
        return arrayMove(cols, oldIndex, newIndex)
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setContacts((prev) => {
        const oldIndex = prev.findIndex((c) => c.id === active.id)
        const newIndex = prev.findIndex((c) => c.id === over?.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const handleAddNew = () => {
    openDrawer(createEmptyContact())
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts"
            value={(table.getColumn("firstName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("firstName")?.setFilterValue(event.target.value)
            }
            className="pl-8"
          />
        </div>
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
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {(column.columnDef.meta as { label?: string })?.label ?? column.id}
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
      <div className="rounded-md border">
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext
            items={table.getRowModel().rows.map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <DndContext key={headerGroup.id} onDragEnd={handleColumnDragEnd}>
                    <SortableContext
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
                  </DndContext>
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

interface RowActionsProps {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

function RowActions({ onView, onEdit, onDelete }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView}>View Details</DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={onDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface DraggableColumnHeaderProps {
  header: Header<Contact, unknown>
}

function DraggableColumnHeader({ header }: DraggableColumnHeaderProps) {
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

interface DraggableRowProps {
  row: Row<Contact>
}

function DraggableRow({ row }: DraggableRowProps) {
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

interface ContactDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact | null
  onSave: (contact: Contact) => void
}

function ContactDrawer({ open, onOpenChange, contact, onSave }: ContactDrawerProps) {
  const isMobile = useIsMobile()
  const form = useForm<Contact>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactSchema) as any,
    defaultValues: contact ?? {
      id: "",
      type: "Individual",
      roles: [],
      firstName: "",
      middleName: "",
      lastName: "",
      primaryEmail: "",
      alternateEmails: [],
      phoneNumbers: [""],
      mailingLists: [],
      doNotEmail: false,
    },
  })

  React.useEffect(() => {
    if (contact) {
      form.reset(contact)
    }
  }, [contact, form])

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
  } = form

  const { fields: altEmailFields, append: appendEmail, remove: removeEmail } =
    useFieldArray({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      control: control as any,
      name: "alternateEmails",
    })

  const { fields: phoneFields, append: appendPhone, remove: removePhone } =
    useFieldArray({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      control: control as any,
      name: "phoneNumbers",
    })

  const roles = ["Donor", "Volunteer", "Board"]
  const pronounOptions = ["He/Him", "She/Her", "They/Them", "Other"]
  const mailingListOptions = ["Newsletter", "Events", "Volunteers"]
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const onSubmit = handleSubmit((values: Contact) => {
    onSave(values)
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="max-h-screen">
        <DrawerHeader>
          <DrawerTitle>{contact ? "Edit Contact" : "New Contact"}</DrawerTitle>
          <DrawerDescription>Manage contact details</DrawerDescription>
        </DrawerHeader>
        <form
          id="contact-form"
          onSubmit={onSubmit}
          className="overflow-y-auto px-4 pb-4 space-y-6"
        >
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Info</h3>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={watch("pronouns")}
                onValueChange={(v) => setValue("pronouns", v as Contact["pronouns"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pronouns" />
                </SelectTrigger>
                <SelectContent>
                  {pronounOptions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Honorific" {...register("honorific")} />
            </div>
            <div className="grid gap-2">
              <Input placeholder="First Name" {...register("firstName")} />
              <Input placeholder="Middle Name" {...register("middleName")} />
              <Input placeholder="Last Name" {...register("lastName")} />
              <Input placeholder="Aliases" {...register("aliases")} />
              <Input
                placeholder="How to Credit Publicly"
                {...register("howToCreditPublicly")}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex flex-wrap gap-2">
                {contactSchema.shape.type.options.map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={watch("type") === opt ? "default" : "outline"}
                    onClick={() => setValue("type", opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Roles</Label>
              {roles.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    checked={watch("roles")?.includes(role)}
                    onCheckedChange={(checked) => {
                      const currentRoles = watch("roles") ?? []
                      if (checked) {
                        setValue("roles", [...currentRoles, role])
                      } else {
                        setValue(
                          "roles",
                          currentRoles.filter((r) => r !== role)
                        )
                      }
                    }}
                  />
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="grid gap-2">
              <Input placeholder="Job Title" {...register("jobTitle")} />
              <Input
                placeholder="Company / Organization Name"
                {...register("company")}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Communication</h3>
            <div className="grid gap-2">
              <Input
                placeholder="Primary Email"
                {...register("primaryEmail")}
              />
              {altEmailFields.map((field, index) => (
                <div key={field.id} className="flex space-x-2">
                  <Input
                    className="flex-1"
                    placeholder="Alternate Email"
                    {...register(`alternateEmails.${index}` as const)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeEmail(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {altEmailFields.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendEmail("")}
                >
                  Add another email
                </Button>
              )}
              <Input placeholder="Website" {...register("website")} />
              <Input placeholder="Social Media" {...register("socialMedia")} />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>
            <div className="grid gap-2">
              <Select
                value={watch("primaryAddress.country")}
                onValueChange={(v) =>
                  setValue("primaryAddress.country", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Street Address"
                {...register("primaryAddress.street")}
              />
              <Input placeholder="City" {...register("primaryAddress.city")} />
              <Select
                value={watch("primaryAddress.state")}
                onValueChange={(v) => setValue("primaryAddress.state", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NY">NY</SelectItem>
                  <SelectItem value="CA">CA</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Zip" {...register("primaryAddress.zip")} />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Phone Numbers</h3>
            <div className="grid gap-2">
              {phoneFields.map((field, index) => (
                <div key={field.id} className="flex space-x-2">
                  <Input
                    className="flex-1"
                    placeholder="Phone Number"
                    {...register(`phoneNumbers.${index}` as const)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removePhone(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {phoneFields.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendPhone("")}
                >
                  Add phone number
                </Button>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Other Personal Info</h3>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      {field.value ? format(new Date(field.value), "PPP") : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(
                          date ? date.toISOString().split("T")[0] : ""
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Documents</h3>
            <Controller
              name="documents"
              control={control}
              render={({ field }) => (
                <div
                  className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const files = Array.from(e.dataTransfer.files)
                    field.onChange(files)
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-6 w-6" />
                  <p className="mt-2 text-sm font-medium">Drop files here</p>
                  <p className="text-xs text-muted-foreground">or click to browse</p>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => field.onChange(Array.from(e.target.files ?? []))}
                  />
                </div>
              )}
            />
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">Mailing Lists</h3>
            {mailingListOptions.map((list) => (
              <div key={list} className="flex items-center space-x-2">
                <Checkbox
                  checked={watch("mailingLists")?.includes(list)}
                  onCheckedChange={(checked) => {
                    const lists = watch("mailingLists") ?? []
                    if (checked) {
                      setValue("mailingLists", [...lists, list])
                    } else {
                      setValue(
                        "mailingLists",
                        lists.filter((l) => l !== list)
                      )
                    }
                  }}
                />
                <span>{list}</span>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox {...register("doNotEmail")} /> <span>Do not email</span>
            </div>
          </section>
        </form>
        <DrawerFooter className="border-t p-4">
          <Button type="submit" form="contact-form">
            Save
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

