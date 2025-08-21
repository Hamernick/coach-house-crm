'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [draft, setDraft] = useState<T>(initialData)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const previousInitialData = useRef<T>(initialData)

  useEffect(() => {
    const serialized = JSON.stringify(initialData)
    if (JSON.stringify(previousInitialData.current) !== serialized) {
      setDraft(initialData)
    }
    previousInitialData.current = initialData
  }, [initialData])

  useEffect(() => {
    if (!key) return
    let ignore = false
    fetcher<AutosaveResponse<T>>(`/api/autosave?key=${encodeURIComponent(key)}`)
      .then((data) => {
        if (!ignore && data?.data) {
          setDraft(data.data)
          setSavedAt(new Date(data.updatedAt))
        }
      })
      .catch(() => {
        // If the user is unauthorized or the request fails, simply ignore the
        // error so it doesn't surface to the user or break rendering.
      })
    return () => {
      ignore = true
    }
  }, [key])

  useEffect(() => {
    if (!key) return
    setSaving(true)
    const t = setTimeout(async () => {
      try {
        const res = await postJson<AutosaveResponse<T>, { key: string; data: T }>(
          '/api/autosave',
          { key, data: draft }
        )
        setSavedAt(new Date(res.updatedAt))
        onSave?.(draft)
      } catch {
        // Ignore errors from autosave requests (e.g. unauthorized) so that
        // autosave failures don't break the UI.
      } finally {
        setSaving(false)
      }
    }, 1000)
    return () => clearTimeout(t)
  }, [draft, key, onSave])

  return { draft, setDraft, saving, savedAt }
}
