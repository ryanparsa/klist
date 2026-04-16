"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
})

export function useTheme() {
  return React.useContext(ThemeContext)
}

function getResolved(theme: Theme): ResolvedTheme {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return theme
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>("light")

  // Initialize from localStorage on mount
  React.useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme) ?? "system"
    const resolved = getResolved(stored)
    setThemeState(stored)
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [])

  // Listen for system preference changes
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      if (theme === "system") {
        const resolved = getResolved("system")
        setResolvedTheme(resolved)
        applyTheme(resolved)
      }
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [theme])

  // Keyboard shortcut: d
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key.toLowerCase() !== "d") return
      const target = e.target as HTMLElement
      if (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      )
        return
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [resolvedTheme])

  const setTheme = React.useCallback((next: Theme) => {
    const resolved = getResolved(next)
    localStorage.setItem("theme", next)
    setThemeState(next)
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
