/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "dark" | "light" | "system"
export type ResolvedTheme = "dark" | "light"

export type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export type ThemeProviderState = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  isDark: boolean
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "dark",
  isDark: true,
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function applyThemeToDOM(t: Theme) {
  if (typeof window === "undefined") return
  const root = window.document.documentElement

  const resolved =
    t === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : t

  // Use classList.toggle to avoid a frame where neither class is present,
  // which would trigger the FOUC-prevention visibility:hidden rule.
  root.classList.toggle("dark", resolved === "dark")
  root.classList.toggle("light", resolved === "light")
}

function disableTransitionsTemporarily() {
  if (typeof document === "undefined") return () => {}
  const css = document.createElement("style")
  css.appendChild(
    document.createTextNode(
      `*, *::before, *::after {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        -ms-transition: none !important;
        transition: none !important;
      }`
    )
  )
  document.head.appendChild(css)

  return () => {
    // Re-enable transitions on next animation frame without forcing synchronous layout reflow
    requestAnimationFrame(() => {
      if (document.head.contains(css)) {
        document.head.removeChild(css)
      }
    })
  }
}

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }
  return "dark"
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme
    }
    return defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (theme === "system") {
      return getSystemTheme()
    }
    return theme
  })

  useEffect(() => {
    applyThemeToDOM(theme)

    if (theme === "system") {
      setResolvedTheme(getSystemTheme())
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        applyThemeToDOM("system")
        setResolvedTheme(mediaQuery.matches ? "dark" : "light")
      }
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } else {
      setResolvedTheme(theme)
    }
  }, [theme])

  const switchTheme = (newTheme: Theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newTheme)
    }

    const updateStateAndDOM = () => {
      applyThemeToDOM(newTheme)
      setTheme(newTheme)
      setResolvedTheme(newTheme === "system" ? getSystemTheme() : newTheme)
    }

    const hasViewTransition =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (hasViewTransition) {
      document.startViewTransition(updateStateAndDOM)
      return
    }

    // Fallback for browsers without View Transitions API
    const restoreTransitions = disableTransitionsTemporarily()
    updateStateAndDOM()
    restoreTransitions()
  }

  const value = {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
    setTheme: switchTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
