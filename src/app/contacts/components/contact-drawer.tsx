"use client"

import * as React from "react"
import { useForm, useFieldArray, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { contactSchema, type Contact } from "../data"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Dropzone } from "@/components/ui/dropzone"

interface ContactDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact | null
  onSave: (contact: Contact) => void
  onDelete?: (id: string) => void
}

export function ContactDrawer({ open, onOpenChange, contact, onSave, onDelete }: ContactDrawerProps) {
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
      attribution: "",
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

  const fullName = React.useMemo(
    () =>
      [contact?.firstName, contact?.middleName, contact?.lastName]
        .filter(Boolean)
        .join(" "),
    [contact]
  )
  const initials = React.useMemo(() => {
    const first = contact?.firstName?.[0] ?? ""
    const last = contact?.lastName?.[0] ?? ""
    return (first + last).toUpperCase() || "CN"
  }, [contact])
  const avatarSrc = (contact as { avatar?: string } | null)?.avatar

  const onSubmit = handleSubmit((values: Contact) => {
    onSave(values)
  })

  const tabTriggerClass =
    "flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground shadow-none transition-all data-[state=active]:border-b-black dark:data-[state=active]:border-b-white data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none"

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="max-h-screen">
        <DrawerHeader>
          {contact ? (
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  {avatarSrc && <AvatarImage src={avatarSrc} alt={fullName} />}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <DrawerTitle>{fullName}</DrawerTitle>
                  {(contact.company || contact.primaryEmail) && (
                    <DrawerDescription>
                      {contact.company || contact.primaryEmail}
                    </DrawerDescription>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {contact && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md border text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete contact?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => onDelete?.(contact.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ) : (
            <>
              <DrawerTitle>New Contact</DrawerTitle>
              <DrawerDescription>Manage contact details</DrawerDescription>
            </>
          )}
        </DrawerHeader>
        <form
          id="contact-form"
          onSubmit={onSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <Tabs
            defaultValue="details"
            className="flex flex-1 flex-col overflow-hidden"
          >
            <TabsList className="flex w-full border-b border-border bg-transparent p-0">
              <TabsTrigger value="details" className={tabTriggerClass}>
                Details
              </TabsTrigger>
              <TabsTrigger value="communication" className={tabTriggerClass}>
                Communication
              </TabsTrigger>
              <TabsTrigger value="preferences" className={tabTriggerClass}>
                Preferences
              </TabsTrigger>
              <TabsTrigger value="documents" className={tabTriggerClass}>
                Documents
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="details"
              className="space-y-4 overflow-y-auto px-4 pb-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={watch("type")}
                    onValueChange={(v) => setValue("type", v as Contact["type"])}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Individual" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactSchema.shape.type.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Roles</Label>
                  <MultiSelect
                    options={roles.map((r) => ({ label: r, value: r }))}
                    value={watch("roles") ?? []}
                    onChange={(vals) => setValue("roles", vals)}
                    placeholder="Donor"
                  />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="honorific">Honorific</Label>
                  <Input
                    id="honorific"
                    className="sm:max-w-[200px]"
                    placeholder="Ms."
                    {...register("honorific")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Jane" {...register("firstName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    className="sm:max-w-[200px]"
                    placeholder="A."
                    {...register("middleName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" {...register("lastName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aliases">Aliases</Label>
                  <Input id="aliases" placeholder="Janie, JD" {...register("aliases")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attribution">How to Credit Publicly?</Label>
                  <Input
                    id="attribution"
                    placeholder="Jane Doe Foundation"
                    {...register("attribution")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pronouns</Label>
                  <Select
                    value={watch("pronouns")}
                    onValueChange={(v) =>
                      setValue("pronouns", v as Contact["pronouns"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="She/Her" />
                    </SelectTrigger>
                    <SelectContent>
                      {pronounOptions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    className="sm:max-w-sm"
                    placeholder="Program Director"
                    {...register("jobTitle")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company / Organization Name</Label>
                  <Input id="company" placeholder="Acme Inc" {...register("company")} />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  type="date"
                  id="dateOfBirth"
                  className="sm:max-w-[200px]"
                  placeholder="1990-01-01"
                  {...register("dateOfBirth")}
                />
              </div>
            </TabsContent>
            <TabsContent
              value="communication"
              className="space-y-4 overflow-y-auto px-4 pb-4"
            >
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryEmail">Primary Email</Label>
                  <Input
                    id="primaryEmail"
                    placeholder="jane@example.com"
                    {...register("primaryEmail")}
                  />
                </div>
                {altEmailFields.map((field, index) => (
                  <div key={field.id} className="flex space-x-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`alternateEmails.${index}`}>{`Alternate Email ${index + 1}`}</Label>
                      <Input
                        id={`alternateEmails.${index}`}
                        className="flex-1"
                        placeholder="other@example.com"
                        {...register(`alternateEmails.${index}` as const)}
                      />
                    </div>
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
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    {...register("website")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialMedia">Social Media</Label>
                  <Input
                    id="socialMedia"
                    placeholder="https://twitter.com/jane"
                    {...register("socialMedia")}
                  />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-4">
                {phoneFields.map((field, index) => (
                  <div key={field.id} className="flex space-x-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`phoneNumbers.${index}`}>{`Phone Number ${index + 1}`}</Label>
                      <Input
                        id={`phoneNumbers.${index}`}
                        className="flex-1"
                        placeholder="123-456-7890"
                        {...register(`phoneNumbers.${index}` as const)}
                      />
                    </div>
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
            </TabsContent>
            <TabsContent
              value="preferences"
              className="space-y-4 overflow-y-auto px-4 pb-4"
            >
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
            </TabsContent>
            <TabsContent
              value="documents"
              className="space-y-4 overflow-y-auto px-4 pb-4"
            >
              <Dropzone
                files={watch("documents") as File[] | undefined}
                onFiles={(files) => setValue("documents", files)}
              />
            </TabsContent>
          </Tabs>
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

