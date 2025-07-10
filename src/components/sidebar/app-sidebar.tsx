"use client";

import * as React from "react";
import {
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
  IconFileDescription,
  IconUsers,
  IconChartBar,
  IconFolder,
  IconFileAi,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/sidebar/nav-documents";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

import logo from "@/public/logo.svg";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Courses",
      url: "/admin/courses",
      icon: IconFileDescription,
    },
    {
      title: "Students",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Assignments",
      url: "#",
      icon: IconFileWord,
    },
    {
      title: "Grades",
      url: "#",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help Center",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Course Materials",
      url: "#",
      icon: IconFolder,
    },
    {
      name: "Student Records",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "AI Assistant",
      url: "#",
      icon: IconFileAi,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image src={logo} alt="logo" className="size-5" />
                <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Ignite+ LMS
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
