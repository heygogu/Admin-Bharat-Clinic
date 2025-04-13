import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ProjectLogo from "@/assets/images/project_logo.webp";
import { Toaster } from "@/components/ui/sonner";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Providers } from "@/providers/ClerkProvider";
import { extractRoleName } from "@/lib/utils";
import { UserRoleProvider } from "@/context/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bharat Dental Clinic",
  description: "Bharat Dental Clinic, Karnal (Haryana)",
  icons: {
    icon: ProjectLogo.src,
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 // Extract the role name from org_role (e.g., "org:admin" -> "admin")
 const {sessionClaims}=await auth()
 const roleName = sessionClaims?.org_role
   ? extractRoleName(sessionClaims.org_role as string)
   : null;
  console.log("roleNameLayout", roleName);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserRoleProvider initialRole={roleName}>

        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
        <Providers>

           
            <NuqsAdapter>{children}</NuqsAdapter>
        </Providers>
        
        </NextThemesProvider>
        <Toaster position="top-right" />
          </UserRoleProvider>
      </body>
    </html>
  );
}
