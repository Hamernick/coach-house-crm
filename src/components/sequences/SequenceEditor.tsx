"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface StepDraft {
  id: string
  delay: string
  content: string
}

export interface SequenceEditorProps {
  sequenceId: string
}

export function SequenceEditor({ sequenceId }: SequenceEditorProps) {
  const storageKey = `sequence-${sequenceId}`
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE" | "PAUSED">("DRAFT")
  const [steps, setSteps] = useState<StepDraft[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      try {
        const data = JSON.parse(raw)
        setName(data.name || "")
        setStatus(data.status || "DRAFT")
        setSteps(data.steps || [])
      } catch {}
    }
  }, [storageKey])

  useEffect(() => {
    if (typeof window === "undefined") return
    const data = { id: sequenceId, name, status, steps }
    localStorage.setItem(storageKey, JSON.stringify(data))
  }, [name, status, steps, storageKey, sequenceId])

  const addStep = () => {
    setSteps([...steps, { id: crypto.randomUUID(), delay: "0", content: "" }])
  }

  const updateStep = (index: number, step: StepDraft) => {
    const next = [...steps]
    next[index] = step
    setSteps(next)
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const moveStep = (index: number, delta: number) => {
    const next = [...steps]
    const newIndex = index + delta
    if (newIndex < 0 || newIndex >= next.length) return
    const [item] = next.splice(index, 1)
    next.splice(newIndex, 0, item)
    setSteps(next)
  }

  return (
    <div className="space-y-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Sequence name"
      />
      <div>
        <div className="mb-2 font-medium">Status</div>
        <RadioGroup
          value={status}
          onValueChange={(v: "DRAFT" | "ACTIVE" | "PAUSED") => setStatus(v)}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="DRAFT" id="seq-status-draft" />
            <Label htmlFor="seq-status-draft">Draft</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="ACTIVE" id="seq-status-active" />
            <Label htmlFor="seq-status-active">Active</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="PAUSED" id="seq-status-paused" />
            <Label htmlFor="seq-status-paused">Paused</Label>
          </div>
        </RadioGroup>
      </div>
      {steps.map((step, index) => {
        const delayNum = Number(step.delay)
        const delayError = isNaN(delayNum) || delayNum < 0
        return (
          <div key={step.id} className="space-y-2 rounded border p-2">
            <div className="space-y-2">
              <Input
                type="number"
                value={step.delay}
                onChange={(e) =>
                  updateStep(index, { ...step, delay: e.target.value })
                }
                placeholder="Delay in hours"
              />
              {delayError && (
                <p className="text-sm text-red-500">
                  Delay must be a non-negative number
                </p>
              )}
              <Textarea
                value={step.content}
                onChange={(e) =>
                  updateStep(index, { ...step, content: e.target.value })
                }
                placeholder="Step content"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveStep(index, -1)}
              >
                Up
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveStep(index, 1)}
              >
                Down
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeStep(index)}
              >
                Remove
              </Button>
            </div>
          </div>
        )
      })}
      <Button type="button" onClick={addStep}>
        Add Step
      </Button>
    </div>
  )
}
