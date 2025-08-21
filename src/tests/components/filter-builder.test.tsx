import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentFiltersBuilder, SegmentFilter } from '@/components/segments/SegmentFiltersBuilder'

describe('SegmentFiltersBuilder', () => {
  it('serializes builder state', async () => {
    const user = userEvent.setup()
    let value = { mode: 'any' as const, filters: [] as SegmentFilter[] }
    render(
      <SegmentFiltersBuilder
        value={value}
        onChange={(v) => {
          value = v
        }}
      />
    )

    await user.click(screen.getByText('Add filter'))
    const input = screen.getByPlaceholderText('Value')
    await user.type(input, 'VIP')

    const trigger = screen.getByRole('combobox') // mode select
    await user.click(trigger)
    await user.click(screen.getByText('All'))

    expect(() => JSON.stringify(value)).not.toThrow()
    expect(value.mode).toBe('all')
    expect(value.filters[0]).toMatchObject({ type: 'tag', value: 'VIP' })
  })
})
