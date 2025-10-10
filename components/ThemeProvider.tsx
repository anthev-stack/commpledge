"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { getTheme, Theme, THEMES } from "@/lib/themes"

interface ThemeContextType {
  theme: Theme
  themeName: string
  setTheme: (themeName: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState("default")
  const [theme, setTheme] = useState<Theme>(THEMES.default)

  useEffect(() => {
    // Fetch current theme from API
    const fetchTheme = async () => {
      try {
        const response = await fetch("/api/settings/theme")
        if (response.ok) {
          const data = await response.json()
          const newThemeName = data.theme || "default"
          setThemeName(newThemeName)
          setTheme(getTheme(newThemeName))
        }
      } catch (error) {
        console.error("Failed to fetch theme:", error)
      }
    }

    fetchTheme()

    // Poll for theme changes every 30 seconds
    const interval = setInterval(fetchTheme, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Apply theme CSS variables
    const root = document.documentElement
    root.style.setProperty("--color-primary", theme.colors.primary)
    root.style.setProperty("--color-secondary", theme.colors.secondary)
    root.style.setProperty("--color-accent", theme.colors.accent)
    root.style.setProperty("--color-background", theme.colors.background)
    root.style.setProperty("--color-surface", theme.colors.surface)
    root.style.setProperty("--color-text", theme.colors.text)
    root.style.setProperty("--color-text-secondary", theme.colors.textSecondary)

    // Add theme class to body for conditional styling
    document.body.className = `theme-${themeName}`
  }, [theme, themeName])

  const handleSetTheme = (newThemeName: string) => {
    setThemeName(newThemeName)
    setTheme(getTheme(newThemeName))
  }

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

