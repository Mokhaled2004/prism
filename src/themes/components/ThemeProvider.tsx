"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { applyTheme } from "../apply"
import { getTheme, defaultThemeId, listThemes } from "../registry"

export interface ThemeContextValue {
  themeId: string
  themes: ReturnType<typeof listThemes>
  setThemeId: (id: string) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = "prism-theme-id"

function readStoredThemeId(): string {
  if (typeof window === "undefined") return defaultThemeId
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? defaultThemeId
  } catch {
    return defaultThemeId
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState(defaultThemeId)

  useEffect(() => {
    const stored = readStoredThemeId()
    setThemeIdState(stored)
    applyTheme(getTheme(stored))
  }, [])

  const setThemeId = useCallback((id: string) => {
    setThemeIdState(id)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, id)
    }
    applyTheme(getTheme(id))
  }, [])

  return (
    <ThemeContext.Provider value={{ themeId, themes: listThemes(), setThemeId }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>")
  return ctx
}