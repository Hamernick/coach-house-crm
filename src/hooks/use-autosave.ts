'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher, postJson } from '@/lib/fetch'

interface AutosaveResponse<T> {
  key: string
  data: T
  updatedAt: string
}

interface UseAutosaveOptions<T> {
  key?: string
  initialData: T
  onSave?: (data: T) => void
}

interface UseAutosaveResult<T> {
  draft: T
  setDraft: React.Dispatch<React.SetStateAction<T>>
  saving: boolean
  savedAt: Date | null
}

export function useAutosave<T>({ key, initialData, onSave }: UseAutosaveOptions<T>): UseAutosaveResult<T> {
  const { data } = useSWR<AutosaveResponse<T>>(key ? `/api/autosave?key=${encodeURIComponent(key)}` : null, fetcher)

  const [draft, setDraft] = useState<T>(initialData)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  useEffect(() => {
    setDraft(initialData)
  }, [initialData])

  useEffect(() => {
    if (data?.data) {
      setDraft(data.data)
      setSavedAt(new Date(data.updatedAt))
    }
  }, [data])

  useEffect(() => {
    if (!key) return
    setSaving(true)
    const t = setTimeout(async () => {
      const res = await postJson<AutosaveResponse<T>, { key: string; data: T }>(
        '/api/autosave',
        { key, data: draft }
      )
      setSaving(false)
      setSavedAt(new Date(res.updatedAt))
      onSave?.(draft)
    }, 1000)
    return () => clearTimeout(t)
  }, [draft, key, onSave])

  return { draft, setDraft, saving, savedAt }
}
