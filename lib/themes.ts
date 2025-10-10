export interface Theme {
  name: string
  displayName: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  emoji: string
  description: string
}

export const THEMES: Record<string, Theme> = {
  default: {
    name: "default",
    displayName: "Default",
    emoji: "🎨",
    description: "Clean and professional design",
    colors: {
      primary: "#4f46e5", // indigo-600
      secondary: "#7c3aed", // purple-600
      accent: "#06b6d4", // cyan-500
      background: "#f9fafb", // gray-50
      surface: "#ffffff",
      text: "#111827", // gray-900
      textSecondary: "#6b7280", // gray-500
    }
  },
  halloween: {
    name: "halloween",
    displayName: "Halloween",
    emoji: "🎃",
    description: "Spooky and festive orange and black theme",
    colors: {
      primary: "#ea580c", // orange-600
      secondary: "#1f2937", // gray-800
      accent: "#a855f7", // purple-500
      background: "#1c1917", // stone-900
      surface: "#292524", // stone-800
      text: "#fafaf9", // stone-50
      textSecondary: "#a8a29e", // stone-400
    }
  },
  christmas: {
    name: "christmas",
    displayName: "Christmas",
    emoji: "🎄",
    description: "Festive red and green holiday theme",
    colors: {
      primary: "#dc2626", // red-600
      secondary: "#16a34a", // green-600
      accent: "#fbbf24", // yellow-400 (gold)
      background: "#f0fdf4", // green-50
      surface: "#ffffff",
      text: "#14532d", // green-900
      textSecondary: "#15803d", // green-700
    }
  },
  birthday: {
    name: "birthday",
    displayName: "Birthday",
    emoji: "🎂",
    description: "Colorful and celebratory theme",
    colors: {
      primary: "#ec4899", // pink-500
      secondary: "#8b5cf6", // violet-500
      accent: "#f59e0b", // amber-500
      background: "#fdf4ff", // fuchsia-50
      surface: "#ffffff",
      text: "#701a75", // fuchsia-900
      textSecondary: "#a21caf", // fuchsia-700
    }
  },
  newyear: {
    name: "newyear",
    displayName: "New Year",
    emoji: "🎆",
    description: "Elegant gold and blue celebration theme",
    colors: {
      primary: "#1e40af", // blue-800
      secondary: "#0891b2", // cyan-600
      accent: "#fbbf24", // yellow-400 (gold)
      background: "#eff6ff", // blue-50
      surface: "#ffffff",
      text: "#1e3a8a", // blue-900
      textSecondary: "#1e40af", // blue-800
    }
  }
}

export function getTheme(themeName: string): Theme {
  return THEMES[themeName] || THEMES.default
}

export function getThemeCSS(theme: Theme): string {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-secondary: ${theme.colors.textSecondary};
    }
  `
}

