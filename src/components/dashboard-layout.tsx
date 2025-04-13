"use client";

import type React from "react";
import { useEffect } from "react";

import { AppSidebar } from "@/components/app-sidebar";

import { extractRoleName } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/nextjs";
import { useUserRole } from "@/context/Provider";
import { Loader } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setRole, isLoading } = useUserRole();
  const { getToken } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  useEffect(() => {
    // Function to get the user's role from Clerk
    const getUserRole = async () => {
      try {
        const token = await getToken({ template: "org_role" });

        if (user && token) {
          const orgRole = user.organizationMemberships?.[0]?.role;
          console.log(orgRole, "orgRole");

          if (orgRole) {
            const roleName = extractRoleName(orgRole);
            setRole(roleName);
          }
          // Don't set role to null if orgRole doesn't exist but keep the previous value
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        // Don't set role to null on error
      }
    };

    if (isUserLoaded) {
      getUserRole();
    }
  }, [getToken, user, setRole, isUserLoaded]);

  // Show a loading state while we're fetching the role
  if (isLoading || !isUserLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={24} />
      </div>
    );
  }

  return <AppSidebar>{children}</AppSidebar>;
}
