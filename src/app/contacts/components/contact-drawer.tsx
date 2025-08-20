"use client"

import * as React from "react"
import { useForm, useFieldArray, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { contactSchema, type Contact } from "../data"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MultiSelect } from "@/components/ui/multi-select"

interface ContactDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact | null
  onSave: (contact: Contact) => void
}

export function ContactDrawer({ open, onOpenChange, contact, onSave }: ContactDrawerProps) {
  const isMobile = useIsMobile()
  const form = useForm<Contact>({
    resolver: zodResolver(contactSchema) as Resolver<Contact>,
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

  const { control, register, handleSubmit, watch, setValue } = form

  const {
    fields: altEmailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: control as any,
    name: "alternateEmails",
  })

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: control as any,
    name: "phoneNumbers",
  })

  const roles = ["Donor", "Volunteer", "Board"]
  const pronounOptions = ["He/Him", "She/Her", "They/Them", "Other"]
  const mailingListOptions = ["Newsletter", "Events", "Volunteers"]

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
          className="overflow-y-auto px-4 pb-4 space-y-4"
        >
          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup
              className="flex flex-wrap gap-2"
              value={watch("type")}
              onValueChange={(v) => setValue("type", v as Contact["type"])}
            >
              {contactSchema.shape.type.options.map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`type-${opt}`} />
                  <Label htmlFor={`type-${opt}`}>{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Roles</Label>
            <MultiSelect
              options={roles.map((r) => ({ label: r, value: r }))}
              value={watch("roles") ?? []}
              onChange={(vals) => setValue("roles", vals)}
              placeholder="Select roles"
            />
          </div>
          <div className="grid gap-2">
            <Input placeholder="Honorific" {...register("honorific")} />
            <Input placeholder="First Name" {...register("firstName")} />
            <Input placeholder="Middle Name" {...register("middleName")} />
            <Input placeholder="Last Name" {...register("lastName")} />
            <Input placeholder="Aliases" {...register("aliases")} />
            <Input
              placeholder="How to Credit Publicly"
              {...register("howToCreditPublicly")}
            />
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
            <Input placeholder="Job Title" {...register("jobTitle")} />
            <Input
              placeholder="Company / Organization Name"
              {...register("company")}
            />
          </div>
          <div className="grid gap-2">
            <Input placeholder="Primary Email" {...register("primaryEmail")} />
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
            <Input
              placeholder="Social Media"
              {...register("socialMedia")}
            />
          </div>
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
          <div className="grid gap-2">
            <Input
              type="date"
              placeholder="Date of Birth"
              {...register("dateOfBirth")}
            />
            <Input type="file" {...register("documents")} multiple />
          </div>
          <div className="space-y-2">
            <Label>Mailing Lists</Label>
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
          </div>
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

