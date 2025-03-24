"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";

// ...
export function Providers({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    >
       <NextTopLoader color={
        resolvedTheme === "dark" ? "white" : "black"
       } height={1.5}  showSpinner={false} />
      {children}
    </ClerkProvider>
  );
}
