'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const publicRoutes = ['/', '/login', '/signup']

  if (publicRoutes.includes(pathname)) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full overflow-hidden">
        <AppSidebar variant="inset" />
        {children}
      </div>
    </SidebarProvider>
  )
}
