import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { SegmentEditorSheet, SegmentDraft } from '@/components/segments/SegmentEditorSheet'

vi.useFakeTimers()

describe('SegmentEditorSheet autosave', () => {
  it('debounces changes', async () => {
    const draft: SegmentDraft = {
      id: '1',
      name: '',
      subtitle: '',
      category: '',
      filtersMode: 'any',
      filters: [],
    }
    const onChange = vi.fn()
    render(
      <SegmentEditorSheet
        open
        segment={draft}
        onClose={() => {}}
        onChange={onChange}
      />
    )

    const input = document.querySelector('input[placeholder="Title"]') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'A' } })
    fireEvent.change(input, { target: { value: 'AB' } })
    fireEvent.change(input, { target: { value: 'ABC' } })

    vi.runAllTimers()

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].name).toBe('ABC')
  })
})
