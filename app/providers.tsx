"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/ThemeProvider"
import { CurrencyProvider } from "@/components/CurrencyProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}


