"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  ContactsSection,
  EmailSection,
  SocialSection,
  FinanceSection,
} from "./sections"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  const [activeSection, setActiveSection] = useState("home")

  const renderContent = () => {
    switch (activeSection) {
      case "contacts":
        return <ContactsSection />
      case "email":
        return <EmailSection />
      case "social":
        return <SocialSection />
      case "finance":
        return <FinanceSection />
      default:
        return <div className="p-4">Welcome to the Dashboard</div>
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar setActiveSection={setActiveSection} />
        <div className="flex-1 flex flex-col">
          <SiteHeader />
          <main className="flex-1 overflow-auto">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
