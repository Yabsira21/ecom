"use client";

import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  Package,
  ShoppingBag,
  UsersIcon,
  Settings2Icon,
  Store,
} from "lucide-react";
import Link from "next/link";

const data = {
  user: {
    name: "Admin",
    email: "admin@store.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Products",
      url: "/admin/product",
      icon: <Package />,
    },
    {
      title: "Orders",
      url: "#",
      icon: <ShoppingBag />,
    },
    {
      title: "Customers",
      url: "#",
      icon: <UsersIcon />,
    },
  ],
  documents: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Link href="/">
            <SidebarMenuItem>
              <SidebarMenuButton
                className="data-[slot=sidebar-menu-button]:p-1.5!"
                render={<a href="#" />}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Store className="size-4" />
                </span>
                <span className="text-base font-semibold">E-Commerce Admin</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
