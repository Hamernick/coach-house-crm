"use client"

import * as React from "react"
import {
  IconUsers,
  IconFileDescription,
  IconCamera,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconSearch,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    organization: "User Organization", // Dynamically reflect the logged-in user's organization
  },
  navMain: [
    {
      title: "Home",
      url: "#home",
      icon: IconUsers, // Replace with an appropriate icon for 'Home'
    },
    {
      title: "Contacts",
      url: "#contacts",
      icon: IconUsers,
    },
    {
      title: "Email",
      url: "#email",
      icon: IconFileDescription,
    },
    {
      title: "Social",
      url: "#social",
      icon: IconCamera,
    },
    {
      title: "Finance",
      url: "#finance",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#search",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ setActiveSection, ...props }: { setActiveSection: (section: string) => void } & React.ComponentProps<typeof Sidebar>) {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)

  const handleSettingsClick = () => {
    setIsSettingsOpen(true)
  }

  const handleGetHelpClick = () => {
    alert("Get Help functionality coming soon!")
  }

  const handleSearchClick = () => {
    alert("Search functionality coming soon!")
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="text-base font-semibold">{data.user.organization}</div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            onClick: () => setActiveSection(item.title.toLowerCase()),
          }))}
        />
        <NavSecondary
          items={data.navSecondary.map((item) => {
            if (item.title === "Settings") {
              return { ...item, onClick: handleSettingsClick }
            } else if (item.title === "Get Help") {
              return { ...item, onClick: handleGetHelpClick }
            } else if (item.title === "Search") {
              return { ...item, onClick: handleSearchClick }
            }
            return item
          })}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CRM Settings</DialogTitle>
          </DialogHeader>
          <div>
            {/* Add CRM settings form or content here */}
            <p>Settings content goes here.</p>
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
