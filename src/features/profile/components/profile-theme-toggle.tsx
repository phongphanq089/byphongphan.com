import { Moon, Sun } from "lucide-react"

import { useTheme } from "@/shared/providers/theme-provider"

/** Theme action in the profile header: rounded outline button inline with the HQ badge. */
export function ProfileThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="inline-flex size-9 items-center justify-center rounded-full border border-border/80 bg-background/70 text-foreground backdrop-blur-md transition-all duration-300 outline-none hover:scale-105 hover:border-foreground/40 hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/60 sm:size-10"
    >
      {isDark ? (
        <Sun className="size-4 sm:size-4.5" aria-hidden="true" />
      ) : (
        <Moon className="size-4 sm:size-4.5" aria-hidden="true" />
      )}
    </button>
  )
}
