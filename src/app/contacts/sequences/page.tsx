import * as React from "react"
import Link from "next/link"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

function SequenceList() {
  "use client"
  const [sequences, setSequences] = React.useState<
    { id: string; name: string; status: string }
  >([])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const seqs: { id: string; name: string; status: string }[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("sequence-")) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "{}")
          seqs.push({
            id: key.replace("sequence-", ""),
            name: data.name || "Untitled",
            status: data.status || "DRAFT",
          })
        } catch {}
      }
    }
    setSequences(seqs)
  }, [])

  return (
    <div className="space-y-4">
      <Button asChild>
        <Link href="/contacts/sequences/new">New Sequence</Link>
      </Button>
      {sequences.length === 0 ? (
        <div className="text-sm text-muted-foreground">No sequences yet.</div>
      ) : (
        <ul className="space-y-2">
          {sequences.map((seq) => (
            <li key={seq.id}>
              <Link
                href={`/contacts/sequences/${seq.id}`}
                className="underline"
              >
                {seq.name}
              </Link>
              <span className="text-xs text-muted-foreground"> ({seq.status})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function SequencesPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Sequences" />
      <div className="p-4">
        <SequenceList />
      </div>
    </SidebarInset>
  )
}
