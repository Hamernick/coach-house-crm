import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentFiltersBuilder } from '@/components/segments/SegmentFiltersBuilder'

describe('SegmentFiltersBuilder', () => {
  it('updates selection', async () => {
    const user = userEvent.setup()
    let value = ''
    render(<SegmentFiltersBuilder value={value} onChange={(v) => (value = v)} />)

    const trigger = screen.getByRole('combobox')
    await user.click(trigger)
    await user.click(screen.getByText('Report'))

    expect(value).toBe('report')
  })
})
