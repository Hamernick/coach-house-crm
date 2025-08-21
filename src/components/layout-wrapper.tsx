'use client'

import type { ReactNode } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full overflow-hidden">
        <AppSidebar variant="inset" />
        {children}
      </div>
    </SidebarProvider>
  )
}
