import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import NextTopLoader from "nextjs-toploader";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <Providers>

            <NextTopLoader color="blue" height={1.5} zIndex={1600} />
            <NuqsAdapter>{children}</NuqsAdapter>
        </Providers>
        
        </NextThemesProvider>
        <Toaster />
      </body>
    </html>
  );
}
