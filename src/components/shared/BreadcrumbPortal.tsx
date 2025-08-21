'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function BreadcrumbPortal({ children }: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    let el = document.getElementById('breadcrumb-portal')
    if (!el) {
      el = document.createElement('div')
      el.id = 'breadcrumb-portal'
      document.body.appendChild(el)
    }
    setContainer(el)
  }, [])

  return container ? createPortal(children, container) : null
}
