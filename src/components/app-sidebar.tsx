"use client"

import * as React from "react"
import { IconHelp, IconSearch } from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { navMain } from "@/lib/routes"

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "https://github.com/shadcn.png",
  organization: "User Organization",
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const handleGetHelpClick = () => {
    alert("Get Help functionality coming soon!")
  }

  const handleSearchClick = () => {
    alert("Search functionality coming soon!")
  }

  const navSecondary = [
    { title: "Get Help", icon: IconHelp, onClick: handleGetHelpClick },
    { title: "Search", icon: IconSearch, onClick: handleSearchClick },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="text-base font-semibold">{user.organization}</div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
