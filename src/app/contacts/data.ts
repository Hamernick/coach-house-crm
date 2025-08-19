export type Contact = {
  id: string
  name: string
  email: string
  status: "Active" | "Inactive"
}

export const contacts: Contact[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "Active",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    status: "Inactive",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    status: "Active",
  },
  {
    id: "4",
    name: "David Miller",
    email: "david@example.com",
    status: "Active",
  },
  {
    id: "5",
    name: "Eve Thompson",
    email: "eve@example.com",
    status: "Inactive",
  },
  {
    id: "6",
    name: "Frank Brown",
    email: "frank@example.com",
    status: "Active",
  },
  {
    id: "7",
    name: "Grace Lee",
    email: "grace@example.com",
    status: "Inactive",
  },
  {
    id: "8",
    name: "Henry Wilson",
    email: "henry@example.com",
    status: "Active",
  },
  {
    id: "9",
    name: "Ivy Clark",
    email: "ivy@example.com",
    status: "Active",
  },
  {
    id: "10",
    name: "Jack White",
    email: "jack@example.com",
    status: "Inactive",
  },
]
