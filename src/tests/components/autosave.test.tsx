import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { SegmentEditorDialog, SegmentDraft } from '@/components/segments/SegmentEditorDialog'

vi.useFakeTimers()

describe('SegmentEditorDialog autosave', () => {
  it('debounces changes', async () => {
    const draft: SegmentDraft = {
      id: '1',
      name: '',
      description: '',
      category: '',
      members: [],
    }
    const onChange = vi.fn()
    render(
      <SegmentEditorDialog
        open
        segment={draft}
        onClose={() => {}}
        onChange={onChange}
        onSave={onChange}
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
