/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useRouterState } from "@tanstack/react-router"
import { animate } from "motion/react"
import React, { useCallback, useEffect, useRef, useState } from "react"

import { MAIN_NAV_ITEMS, type NavItemConfig } from "@/shared/config"
import { useMediaQuery } from "@/shared/hooks/use-media-query"
import { cn } from "@/shared/lib/utils"
import { ModeToggle, PPPixelMark } from "@/shared/ui"
import GenerateButton from "@/shared/ui/animation/generate-button"

import { CommandMenuTrigger } from "../command-menu"

function isRouteActive(itemLink: string, currentPath: string): boolean {
  if (itemLink === "/") {
    return currentPath === "/" || currentPath === ""
  }
  if (itemLink === "/blocks") {
    return currentPath.startsWith("/blocks") || currentPath.startsWith("/block")
  }
  return currentPath.startsWith(itemLink)
}

export interface SpotlightNavbarProps {
  items?: NavItemConfig[]
  className?: string
}

export function SpotlightNavbar({
  items = MAIN_NAV_ITEMS,
  className,
}: SpotlightNavbarProps) {
  const navRef = useRef<HTMLElement>(null)
  const currentPath = useRouterState({ select: (s) => s.location.pathname })

  const activeIndex = items.findIndex((item) =>
    isRouteActive(item.link, currentPath)
  )

  const [isHovered, setIsHovered] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const spotlightX = useRef(0)
  const lineX = useRef(0)
  const lineW = useRef(0)
  const isInitial = useRef(true)

  const updateActivePosition = useCallback(() => {
    if (!navRef.current) return

    if (activeIndex === -1) {
      setIsReady(false)
      return
    }

    const activeEl = navRef.current.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    )
    if (!activeEl) return

    const navRect = navRef.current.getBoundingClientRect()
    const textEl = activeEl.querySelector<HTMLElement>("span")
    const textRect = textEl
      ? textEl.getBoundingClientRect()
      : activeEl.getBoundingClientRect()

    // Symmetrical geometric center of the item's text relative to nav container
    const targetCenter = textRect.left - navRect.left + textRect.width / 2
    // Line width matches the text width with balanced subtle extension for rounded caps
    const targetWidth = Math.round(textRect.width + 6)

    if (isInitial.current) {
      lineX.current = targetCenter
      lineW.current = targetWidth
      spotlightX.current = targetCenter
      navRef.current.style.setProperty("--line-x", `${targetCenter}px`)
      navRef.current.style.setProperty("--line-w", `${targetWidth}px`)
      navRef.current.style.setProperty("--spotlight-x", `${targetCenter}px`)
      isInitial.current = false
      setIsReady(true)
    } else {
      setIsReady(true)
      animate(lineX.current, targetCenter, {
        type: "spring",
        stiffness: 340,
        damping: 30,
        onUpdate: (v) => {
          lineX.current = v
          navRef.current?.style.setProperty("--line-x", `${v}px`)
        },
      })
      animate(lineW.current, targetWidth, {
        type: "spring",
        stiffness: 340,
        damping: 30,
        onUpdate: (v) => {
          lineW.current = v
          navRef.current?.style.setProperty("--line-w", `${v}px`)
        },
      })

      if (!isHovered) {
        animate(spotlightX.current, targetCenter, {
          type: "spring",
          stiffness: 260,
          damping: 24,
          onUpdate: (v) => {
            spotlightX.current = v
            navRef.current?.style.setProperty("--spotlight-x", `${v}px`)
          },
        })
      }
    }
  }, [activeIndex, isHovered])

  // Recalculate positions immediately on window resize without spring delay
  const handleResize = useCallback(() => {
    if (!navRef.current || activeIndex === -1) return
    const activeEl = navRef.current.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    )
    if (!activeEl) return

    const navRect = navRef.current.getBoundingClientRect()
    const textEl = activeEl.querySelector<HTMLElement>("span")
    const textRect = textEl
      ? textEl.getBoundingClientRect()
      : activeEl.getBoundingClientRect()
    const targetCenter = textRect.left - navRect.left + textRect.width / 2
    const targetWidth = Math.round(textRect.width + 6)

    lineX.current = targetCenter
    lineW.current = targetWidth
    spotlightX.current = targetCenter
    navRef.current.style.setProperty("--line-x", `${targetCenter}px`)
    navRef.current.style.setProperty("--line-w", `${targetWidth}px`)
    navRef.current.style.setProperty("--spotlight-x", `${targetCenter}px`)
  }, [activeIndex])

  useEffect(() => {
    updateActivePosition()
    window.addEventListener("resize", handleResize)
    document.fonts?.ready?.then(() => {
      handleResize()
    })
    return () => window.removeEventListener("resize", handleResize)
  }, [updateActivePosition, handleResize])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!navRef.current) return
    const rect = navRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left

    setIsHovered(true)
    spotlightX.current = x
    navRef.current.style.setProperty("--spotlight-x", `${x}px`)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!navRef.current || activeIndex === -1) return

    const activeEl = navRef.current.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    )
    if (activeEl) {
      const navRect = navRef.current.getBoundingClientRect()
      const textEl = activeEl.querySelector<HTMLElement>("span")
      const textRect = textEl
        ? textEl.getBoundingClientRect()
        : activeEl.getBoundingClientRect()
      const targetCenter = textRect.left - navRect.left + textRect.width / 2

      animate(spotlightX.current, targetCenter, {
        type: "spring",
        stiffness: 240,
        damping: 24,
        onUpdate: (v) => {
          spotlightX.current = v
          navRef.current?.style.setProperty("--spotlight-x", `${v}px`)
        },
      })
    }
  }

  return (
    <nav
      ref={navRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative flex h-full items-center select-none", className)}
    >
      {/* 1. Subtle cursor & active spotlight illumination */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered || activeIndex >= 0 ? 1 : 0,
          background: `
            radial-gradient(
              120px circle at var(--spotlight-x, 0px) 50%,
              rgba(0, 0, 0, 0.04) 0%,
              transparent 100%
            )
          `,
        }}
      />

      {/* 2. Navigation items flush with header height */}
      <ul className="relative z-10 flex h-full items-center">
        {items.map((item, idx) => {
          const isActive = activeIndex === idx
          return (
            <li key={item.id} className="relative flex h-full items-center">
              <Link
                to={item.link}
                data-index={idx}
                className={cn(
                  "relative flex h-full items-center px-3.5 text-xs font-medium tracking-wider whitespace-nowrap transition-colors duration-150",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  isActive
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* 3. Single active bottom line strictly centered under the item label */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 z-20 -translate-x-1/2 transition-opacity duration-200",
          isReady && activeIndex >= 0 ? "opacity-100" : "opacity-0"
        )}
        style={{
          left: "var(--line-x, 0px)",
          width: "var(--line-w, 0px)",
        }}
      >
        {/* Ambient upward glow bloom */}
        <div className="absolute -top-2 right-0 left-0 h-2 bg-gradient-to-t from-primary/20 to-transparent blur-[2px]" />

        {/* Crisp active accent line with smooth rounded caps */}
        <div className="relative h-[2px] w-full rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
      </div>
    </nav>
  )
}

export function Header() {
  const isDownLg = useMediaQuery("max-lg")

  return (
    <header className="flex h-12 w-full items-center justify-between bg-accent/40 backdrop-blur-md dark:bg-[#111111]">
      <Link
        to="/"
        className="flex h-full items-center gap-2 border-r border-border px-4 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/60 hover:text-foreground"
      >
        <PPPixelMark size={32} className="text-pp-primary" />
      </Link>

      {isDownLg ? (
        <div className="flex h-full items-center gap-3 px-3">
          <GenerateButton hue={210} />
        </div>
      ) : (
        <div className="ml-auto flex h-full items-center">
          <SpotlightNavbar className="h-full" />
          <div className="flex h-full items-center gap-2 border-l border-border px-3">
            <CommandMenuTrigger compact />
            <ModeToggle />
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
