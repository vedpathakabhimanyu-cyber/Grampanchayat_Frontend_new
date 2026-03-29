"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "./nav-items";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/admin/ui/sidebar";
import { cn } from "@/lib/admin/utils";
import { LogOut } from "lucide-react";
import { usePermissions } from "@/contexts/admin/PermissionContext";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = usePermissions();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // Only show Users menu to admins
    if (item.href === "/admin/users") {
      return user?.role === "admin";
    }
    return true;
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-3">
          <div className="text-lg font-bold">Admin Portal</div>
          {user && (
            <div className="text-xs text-gray-500 mt-1">
              {user.email}
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                {user.role}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md",
                      pathname === item.href && "bg-blue-100 text-blue-700"
                    )}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex items-center gap-3 text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>बाहेर पडा (Logout)</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
