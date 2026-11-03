import { Link, useRouterState } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import React, { useRef, useState } from "react"

import { MAIN_NAV_ITEMS, type NavItemConfig } from "@/shared/config"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/core"
import { PPPixelMark } from "@/shared/ui/icons/pp-pixel-mark"
import { ModeToggle } from "@/shared/ui/system/mode-toggle"

import { CommandMenuTrigger } from "../command-menu"
import { GitHubStarButton } from "./github-star-button"

function isRouteActive(itemLink: string, currentPath: string): boolean {
  if (itemLink === "/") {
    return currentPath === "/" || currentPath === ""
  }
  if (itemLink === "/blocks") {
    return currentPath.startsWith("/blocks") || currentPath.startsWith("/block")
  }
  return currentPath.startsWith(itemLink)
}

function getDisplayTitle(item: NavItemConfig): string {
  if (item.id === "hooks") return "Hooks"
  return item.title
}

export interface FlashlightNavbarProps {
  items?: NavItemConfig[]
  className?: string
}

export function FlashlightNavbar({
  items = MAIN_NAV_ITEMS,
  className,
}: FlashlightNavbarProps) {
  const navRef = useRef<HTMLElement>(null)
  const currentPath = useRouterState({ select: (s) => s.location.pathname })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const activeItem = items.find((item) => isRouteActive(item.link, currentPath))
  // The tab illuminated by the flashlight: follows hover, falls back to active route item
  const illuminatedId = hoveredId ?? (activeItem ? activeItem.id : null)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!navRef.current) return
    const rect = navRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    navRef.current.style.setProperty("--cursor-x", `${x}px`)
    navRef.current.style.setProperty("--cursor-y", `${y}px`)
  }

  return (
    <nav
      ref={navRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredId(null)}
      className={cn(
        "group/nav relative flex h-9 items-center rounded-full p-1 transition-all duration-300 select-none",
        className
      )}
    >
      {/* Ambient cursor spotlight tracking across the pill */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover/nav:opacity-100"
        style={{
          background:
            "radial-gradient(100px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(255, 255, 255, 0.06), transparent 70%)",
        }}
      />

      <ul className="relative z-10 flex h-full items-center gap-0.5">
        {items.map((item) => {
          const isIlluminated = item.id === illuminatedId
          const isActive = activeItem?.id === item.id

          return (
            <li key={item.id} className="relative flex h-full items-center">
              <Link
                to={item.link}
                onMouseEnter={() => setHoveredId(item.id)}
                className={cn(
                  "relative z-10 flex h-full items-center rounded-lg px-3.5 text-xs font-medium tracking-wide whitespace-nowrap transition-colors duration-200",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  isIlluminated || isActive
                    ? "font-semibold text-foreground dark:text-white"
                    : "text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                <span className="relative z-20">{getDisplayTitle(item)}</span>

                {isIlluminated && (
                  <motion.div
                    layoutId="flashlight-glow"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                      mass: 0.75,
                    }}
                    className="absolute inset-0 rounded-lg"
                  >
                    {/* 1. Inner elevated capsule pill */}
                    <div className="absolute inset-0 rounded-lg bg-black/[0.05] shadow-[inset_0_1px_0_rgba(0,0,0,0.05)] dark:bg-white/[0.09] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.14)]" />

                    {/* 2. Upward Flashlight Beam Diffusion */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-full rounded-lg"
                      style={{
                        background:
                          "radial-gradient(ellipse 75% 85% at 50% 100%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 80%)",
                      }}
                    />
                  </motion.div>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// Backward-compatible alias
export const SpotlightNavbar = FlashlightNavbar
export type SpotlightNavbarProps = FlashlightNavbarProps

export function Header() {
  return (
    <header className="flex h-12 w-full items-center justify-between bg-accent/40 backdrop-blur-md dark:bg-background/90">
      <Link
        to="/"
        className="flex h-full items-center gap-2 border-r border-border px-4 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/60 hover:text-foreground"
      >
        <PPPixelMark size={32} className="text-pp-primary" variant="glow" />
      </Link>

      <div className="relative z-10 flex shrink-0 items-stretch border-l border-border bg-background/50 backdrop-blur-xs lg:hidden">
        <div className="flex items-center border-r border-border">
          <GitHubStarButton />
        </div>
        <Button
          variant="ghost"
          className="group/btn h-full rounded-none border-0 px-3.5 py-3 font-mono text-[11px] font-medium text-foreground transition-all duration-200 hover:bg-accent/60 hover:text-foreground active:bg-accent sm:px-6 sm:text-xs"
          asChild
        >
          <Link to="/component-ui">
            <span>Component UI</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </div>

      {/* Desktop header — hidden below lg, visible at lg+ */}
      <div className="ml-auto hidden h-full items-center lg:flex">
        <div className="flex h-full items-center px-3">
          <FlashlightNavbar />
        </div>
        <div className="flex h-full items-center border-l border-border px-3">
          <CommandMenuTrigger compact />
        </div>
        <div className="flex h-full items-center border-l border-border">
          <GitHubStarButton />
        </div>
        <div className="flex h-full items-center border-l border-border px-3">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header
