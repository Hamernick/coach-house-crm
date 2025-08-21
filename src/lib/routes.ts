import {
  IconLayoutDashboard,
  IconUsers,
  IconMail,
  IconTimeline,
  IconCurrencyDollar,
  IconReportAnalytics,
  IconSettings,
} from "@tabler/icons-react";

export const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
  { title: "Contacts", url: "/contacts", icon: IconUsers },
  { title: "Marketing", url: "/marketing", icon: IconMail },
  { title: "Sequences", url: "/sequences", icon: IconTimeline },
  { title: "Finance", url: "/finance", icon: IconCurrencyDollar },
  { title: "Reports", url: "/reports", icon: IconReportAnalytics },
  { title: "Settings", url: "/settings", icon: IconSettings },
];

export const protectedPaths = navMain.map((item) => item.url);
