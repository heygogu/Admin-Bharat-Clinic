import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ProjectLogo from "@/assets/images/project_logo.webp";
import { Toaster } from "@/components/ui/sonner";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Providers } from "@/providers/ClerkProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
        <Toaster />
      </body>
    </html>
  );
}
