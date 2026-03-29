"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usersAPI } from "@/lib/admin/api";

interface User {
  id: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  permissions: string[];
}

interface PermissionContextType {
  user: User | null;
  loading: boolean;
  hasPermission: (taskId: string) => boolean;
  canEdit: () => boolean;
}

const PermissionContext = createContext<PermissionContextType>({
  user: null,
  loading: true,
  hasPermission: () => false,
  canEdit: () => false,
});

export function PermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await usersAPI.me();
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const hasPermission = (taskId: string): boolean => {
    if (!user) return false;

    // Admin has all permissions
    if (user.role === "admin") return true;

    // Check for wildcard permission
    if (user.permissions.includes("*")) return true;

    // Check specific task permission
    return user.permissions.includes(taskId);
  };

  const canEdit = (): boolean => {
    if (!user) return false;
    return user.role !== "viewer";
  };

  return (
    <PermissionContext.Provider
      value={{ user, loading, hasPermission, canEdit }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export const usePermissions = () => useContext(PermissionContext);
