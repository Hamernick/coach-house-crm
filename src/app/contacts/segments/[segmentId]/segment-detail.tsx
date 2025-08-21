"use client"

import * as React from "react"
import { Trash } from "lucide-react"

import { type Contact, contacts } from "../../data"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"

export function SegmentDetail() {
  const [members, setMembers] = React.useState<Contact[]>(contacts.slice(0, 2))
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<string[]>([])

  const available = React.useMemo(
    () => contacts.filter((c) => !members.find((m) => m.id === c.id)),
    [members]
  )

  const deliverableEmails = React.useMemo(
    () => members.filter((m) => !m.doNotEmail).length,
    [members]
  )

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const addMembers = () => {
    const toAdd = contacts.filter((c) => selected.includes(c.id))
    setMembers((prev) => [...prev, ...toAdd])
    setSelected([])
    setDrawerOpen(false)
  }

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-8 p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {members.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deliverable Emails</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {deliverableEmails}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Engagement</CardTitle>
          </CardHeader>
          <CardContent>Coming soon</CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Members</h2>
          <Button onClick={() => setDrawerOpen(true)}>Add Members</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.firstName + " " + (m.lastName ?? "")}</TableCell>
                <TableCell>{m.primaryEmail}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMember(m.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Card className="flex h-40 items-center justify-center">
        <CardHeader>
          <CardTitle>Metrics</CardTitle>
        </CardHeader>
        <CardContent>Metrics placeholder</CardContent>
      </Card>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Contacts</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-2 overflow-y-auto">
            {available.map((c) => (
              <div key={c.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selected.includes(c.id)}
                  onCheckedChange={() => toggleSelect(c.id)}
                />
                <div>
                  <div>{c.firstName + " " + (c.lastName ?? "")}</div>
                  <div className="text-sm text-muted-foreground">
                    {c.primaryEmail}
                  </div>
                </div>
              </div>
            ))}
            {available.length === 0 && (
              <div className="text-sm text-muted-foreground">
                All contacts are members
              </div>
            )}
          </div>
          <DrawerFooter>
            <Button onClick={addMembers} disabled={selected.length === 0}>
              Add
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

