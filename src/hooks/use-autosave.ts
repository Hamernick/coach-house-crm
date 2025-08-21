'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetcher, postJson } from '@/lib/fetch'

function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }
    return true
  }
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false
    if (!isEqual(a[key], b[key])) return false
  }
  return true
}

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
    if (!isEqual(previousInitialData.current, initialData)) {
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

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useCallback(
    async (data: T) => {
      try {
        const res = await postJson<AutosaveResponse<T>, { key: string; data: T }>(
          '/api/autosave',
          { key: key as string, data }
        )
        setSavedAt(new Date(res.updatedAt))
        onSave?.(data)
      } catch {
        // Ignore errors from autosave requests (e.g. unauthorized) so that
        // autosave failures don't break the UI.
      } finally {
        setSaving(false)
      }
    },
    [key, onSave]
  )

  useEffect(() => {
    if (!key) return
    setSaving(true)
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => save(draft), 1000)
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [draft, key, save])

  return { draft, setDraft, saving, savedAt }
}
