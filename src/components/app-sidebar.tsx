"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Mail,
  Users2,
  Code2,
  Calendar,
  FlaskConical,
  CreditCard,
  Activity,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";

import { motion } from "framer-motion";
// import { TeamSwitcher } from "@/components/team-switcher"
// import ProjectLogo from "@/app/assets/images/project-logo.png"
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import ProjectLogo from "@/assets/images/project_logo.webp";
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useUserRole } from "@/context/Provider";

// This is sample data.
const data = {
  // user: {
  //   name: "Manju",
  //   email: "business.contentqueries@gmail.com",
  //   avatar:
  //     "https://media.licdn.com/dms/image/v2/D4D03AQGTLWnjp7ZAZg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1681108382213?e=1747267200&v=beta&t=uJGzWvdykGknAnW4J-TEBwLFVSwPMoHrt-jq0io8424",
  // },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      roles: ["admin", "lab_technician", "receptionist"],
    },
    {
      title: "Patients",
      icon: Users,
      url: "/patients/page/1",
      roles: ["admin", "lab_technician", "receptionist"],
      // color: "text-violet-500",
    },
    {
      title: "Appointments",
      icon: Calendar,
      url: "/appointments/page/1",
      roles: ["admin", "lab_technician", "receptionist"],
      // color: "text-pink-700",
    },

    // {
    //   title: "Lab Results",
    //   icon: FlaskConical,
    //   url: "/lab-results",
    //   // color: "text-emerald-500",
    // },
    // {
    //   title:"Prescriptions",
    //   icon: FileText,
    //   url: "/prescriptions",
    // },
    {
      title: "Payments",
      icon: CreditCard,
      url: "/payments/page/1",
      roles: ["admin", "receptionist"],
      // color: "text-blue-500",
    },
    {
      title: "Reports",
      icon: Activity,
      url: "/reports",
      roles: ["admin"],
      // color: "text-yellow-500",
    },
    // {
    //   title: "Settings",
    //   icon: Settings,
    //   url: "/settings",
    //   // color: "text-gray-500",
    // },
  ],

  currentPage: {
    parent: "Home",
    title: "Dashboard",
  },
};

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const { role } = useUserRole();
  console.log(role, "roleAppSidebar");
const filteredNavItems = role
  ? data.navMain.filter((item) => item.roles.includes(role))
  : data.navMain;

  return (
    <SidebarProvider className="">
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center justify-center mt-2">
          {/* <TeamSwitcher teams={data.teams} /> */}
          <Image
            src={ProjectLogo}
            height={100}
            width={200}
            alt="Project Logo"
            className="rounded-full object-cover"
          />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={filteredNavItems} />
        </SidebarContent>
        <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="">
        <header className="flex  h-16 shrink-0 bg-secondary items-center gap-2 transition-[width,height] ease-linear ">
          <div className="flex items-center w-full gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <SidebarSeparator orientation="vertical" className="mr-2 h-4" />

            <div className="flex items-center gap-4 flex-1">
              {/* <DropdownMenu>
              <DropdownMenuTrigger asChild> */}

              <Button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="ml-auto mt-[2px] rounded-full"
                variant="outline"
                size="icon"
              >
                <motion.div
                  initial={{
                    rotate: theme === "light" ? 0 : 90,
                    scale: theme === "light" ? 1 : 0,
                  }}
                  animate={{
                    rotate: theme === "light" ? 0 : 90,
                    scale: theme === "light" ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                </motion.div>
                <motion.div
                  initial={{
                    rotate: theme === "light" ? -90 : 0,
                    scale: theme === "light" ? 0 : 1,
                  }}
                  animate={{
                    rotate: theme === "light" ? -90 : 0,
                    scale: theme === "light" ? 0 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                >
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                </motion.div>
                <span className="sr-only">Toggle theme</span>
              </Button>
              <SignedOut>
                <SignInButton />
                
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              {/* </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            </div>
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div> */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
