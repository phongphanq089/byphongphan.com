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
  root.classList.remove("light", "dark")

  if (t === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light"
    root.classList.add(systemTheme)
    return
  }

  root.classList.add(t)
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
    // Force a DOM reflow
    void window.getComputedStyle(document.body).opacity

    // Re-enable transitions on next tick
    setTimeout(() => {
      if (document.head.contains(css)) {
        document.head.removeChild(css)
      }
    }, 1)
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

    const restoreTransitions = disableTransitionsTemporarily()

    const updateStateAndDOM = () => {
      applyThemeToDOM(newTheme)
      setTheme(newTheme)
      setResolvedTheme(newTheme === "system" ? getSystemTheme() : newTheme)
      restoreTransitions()
    }

    const hasViewTransition =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (hasViewTransition) {
      document.startViewTransition(updateStateAndDOM)
      return
    }

    updateStateAndDOM()
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
