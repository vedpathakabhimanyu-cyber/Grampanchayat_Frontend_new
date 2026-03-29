"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/admin/ui/sidebar";
import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import { PermissionProvider } from "@/contexts/admin/PermissionContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router, pathname]);

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <PermissionProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <div className="border-b bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4 p-4">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold">ग्रामपंचायत प्रशासन</h1>
              </div>
            </div>
            <div className="p-6">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </PermissionProvider>
  );
}
