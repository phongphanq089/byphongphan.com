import { Link, useRouterState } from "@tanstack/react-router"
import { Moon, Search, Sun } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useMemo, useRef, useState } from "react"
import useMeasure from "react-use-measure"

import { MAIN_NAV_ITEMS } from "@/shared/config"
import { cn } from "@/shared/lib"
import { useTheme } from "@/shared/providers/theme-provider"
import { Kbd, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/core"
import { MusicToggleButton } from "@/shared/ui/system/music-toggle-button"
import { openCommandMenu } from "@/widgets/command-menu"

const NAV_ITEMS = MAIN_NAV_ITEMS

const THEME_OPTIONS = [
  { key: "light", icon: Sun, text: "Light" },
  { key: "dark", icon: Moon, text: "Dark" },
] as const

type MenuView = "default" | "menu" | "theme"

const BottomMenu = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [elementRef] = useMeasure()
  const [hiddenRef, hiddenBounds] = useMeasure()
  const [view, setView] = useState<MenuView>("default")

  const { theme, setTheme } = useTheme()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  // Handle outside click to close submenu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setView("default")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const content = useMemo(() => {
    switch (view) {
      case "default":
        return null

      case "menu":
        return (
          <div className="flex min-w-[240px] flex-col gap-1 p-1.5">
            <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Navigation
            </div>
            {NAV_ITEMS.map(({ label, link }) => {
              const isActive =
                link === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(link)
              return (
                <Link
                  key={label}
                  to={link}
                  onClick={() => setView("default")}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 active:scale-98",
                    isActive
                      ? "bg-accent font-semibold text-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "size-2 shrink-0 rounded-xs bg-pp-primary transition-transform",
                      isActive && "scale-110 animate-pulse"
                    )}
                    style={{
                      boxShadow: isActive
                        ? "0 0 8px var(--pp-primary)"
                        : undefined,
                    }}
                  />

                  <span className="">{label}</span>
                  {isActive && (
                    <span
                      className="ml-auto size-1.5 rounded-full bg-pp-primary"
                      style={{
                        boxShadow: "0 0 8px var(--pp-primary)",
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        )

      case "theme":
        return (
          <div className="flex min-w-[210px] flex-col gap-1 p-1.5">
            <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Theme Mode
            </div>
            {THEME_OPTIONS.map(({ key, icon: Icon, text }) => {
              const isSelected = theme === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setTheme(key)
                    setView("default")
                  }}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150",
                    isSelected
                      ? "bg-accent text-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{text}</span>
                  {isSelected && (
                    <span className="ml-auto size-1.5 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        )

      default:
        return null
    }
  }, [view, theme, currentPath, setTheme])

  return (
    <div ref={containerRef} className="relative flex flex-col items-center">
      {/* Hidden for measurement */}
      <div
        ref={hiddenRef}
        className="pointer-events-none invisible absolute top-[-9999px] left-[-9999px]"
      >
        <div className="rounded-[18px] border border-border bg-background/95 py-1">
          {content}
        </div>
      </div>

      {/* Animated submenu */}
      <AnimatePresence mode="wait">
        {view !== "default" && (
          <motion.div
            key="submenu"
            initial={{
              opacity: 0,
              scaleY: 0.9,
              scaleX: 0.95,
              height: 0,
              width: 0,
              originY: 1,
              originX: 0.5,
            }}
            animate={{
              opacity: 1,
              scaleY: 1,
              scaleX: 1,
              height: hiddenBounds.height || "auto",
              width: hiddenBounds.width || "auto",
              originY: 1,
              originX: 0.5,
            }}
            exit={{
              opacity: 0,
              scaleY: 0.9,
              scaleX: 0.95,
              height: 0,
              width: 0,
              originY: 1,
              originX: 0.5,
            }}
            transition={{
              duration: 0.3,
              ease: [0.45, 0, 0.25, 1],
            }}
            style={{
              transformOrigin: "bottom center",
            }}
            className="absolute bottom-[58px] overflow-hidden"
          >
            <div
              ref={elementRef}
              className="rounded-[18px] border border-border/80 bg-background/95 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl dark:border-white/15 dark:bg-[#121215]/95"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={view}
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                    filter: "blur(10px)",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    filter: "blur(12px)",
                  }}
                  transition={{
                    duration: 0.25,
                    ease: [0.42, 0, 0.58, 1],
                  }}
                  className="py-1"
                >
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 flex h-12 items-center gap-1 rounded-lg border border-border/80 bg-background/90 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-2xl dark:border-white/15 dark:bg-[#121215]/90">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() =>
                setView((prev) => (prev === "menu" ? "default" : "menu"))
              }
              aria-label={view === "menu" ? "Close menu" : "Open menu"}
              className={cn(
                "flex size-9 items-center justify-center rounded-full transition-all duration-200 active:scale-95 md:hidden",
                view === "menu"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <div className="relative grid size-4 cursor-pointer items-center justify-center">
                <motion.div
                  animate={{
                    y: view === "menu" ? 0 : "-4px",
                    rotate: view === "menu" ? 45 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute h-0.5 w-3.5 rounded-full bg-current"
                />
                <motion.div
                  animate={{ opacity: view === "menu" ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute h-0.5 w-3.5 rounded-full bg-current"
                />
                <motion.div
                  animate={{
                    y: view === "menu" ? 0 : "4px",
                    rotate: view === "menu" ? -45 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute h-0.5 w-3.5 rounded-full bg-current"
                />
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={8}>
            {view === "menu" ? "Close Menu" : "Navigation Menu"}
          </TooltipContent>
        </Tooltip>

        <div className="mx-0.5 h-4 w-[1px] bg-border/60 md:hidden dark:bg-white/10" />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => {
                setView("default")
                openCommandMenu()
              }}
              aria-label="Search commands"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-muted/70 hover:text-foreground active:scale-95 md:hidden"
            >
              <Search className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={8}>
            Search <Kbd>⌘K</Kbd>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() =>
                setView((prev) => (prev === "theme" ? "default" : "theme"))
              }
              aria-label="Toggle theme mode"
              className={cn(
                "flex size-9 items-center justify-center rounded-full transition-all duration-200 active:scale-95 md:hidden",
                view === "theme"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {theme === "dark" ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={8}>
            Theme Settings
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center">
          <MusicToggleButton autoPlay={false} />
        </div>
      </div>
    </div>
  )
}

export default BottomMenu
