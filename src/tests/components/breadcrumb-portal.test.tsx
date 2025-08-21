import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BreadcrumbPortal } from '@/components/shared/BreadcrumbPortal'

describe('BreadcrumbPortal', () => {
  it('renders children into portal', async () => {
    render(
      <BreadcrumbPortal>
        <span>Home</span>
      </BreadcrumbPortal>
    )
    const portal = await screen.findByText('Home')
    expect(portal).toBeInTheDocument()
    const container = document.getElementById('breadcrumb-portal')
    expect(container).not.toBeNull()
    expect(container?.textContent).toContain('Home')
  })
})
