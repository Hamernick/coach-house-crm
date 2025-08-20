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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

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
        <Form {...form}>
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
            <FormField
              control={control}
              name="honorific"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Honorific</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Honorific" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Middle Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Last Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="aliases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aliases</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Aliases" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="howToCreditPublicly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How to Credit Publicly</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="How to Credit Publicly"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="pronouns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pronouns</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Job Title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company / Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Company / Organization Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={control}
              name="primaryEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {altEmailFields.map((altEmailField, index) => (
              <div key={altEmailField.id} className="flex space-x-2">
                <FormField
                  control={control}
                  name={`alternateEmails.${index}` as const}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{`Alternate Email ${index + 1}`}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Alternate Email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
            <FormField
              control={control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Website" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="socialMedia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Media</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Social Media" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            {phoneFields.map((phoneField, index) => (
              <div key={phoneField.id} className="flex space-x-2">
                <FormField
                  control={control}
                  name={`phoneNumbers.${index}` as const}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{`Phone Number ${index + 1}`}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Phone Number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
            <FormField
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="documents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documents</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) =>
                        field.onChange(Array.from(e.target.files ?? []))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
        </Form>
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

