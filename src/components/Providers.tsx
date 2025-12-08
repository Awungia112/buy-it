"use client";

import { SessionProvider } from "next-auth/react";
import { TolgeeProvider } from "./TolgeeProvider";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TolgeeProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </TolgeeProvider>
    </SessionProvider>
  );
}
