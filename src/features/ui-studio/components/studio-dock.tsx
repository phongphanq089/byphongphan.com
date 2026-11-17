/* eslint-disable react-hooks/set-state-in-effect */
import { useNavigate } from "@tanstack/react-router"
import { play } from "cuelume"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Layers,
  Maximize2,
  Minimize2,
  Terminal,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useMemo, useState } from "react"
import useMeasure from "react-use-measure"

import { useMediaQuery } from "@/registry/hooks/use-media-query"
import { Button } from "@/registry/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from "@/registry/ui/drawer"
import { cn } from "@/shared/lib/utils"
import { Kbd, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/core"
import { CodeBlockCommand } from "@/shared/ui/core/code-block"

import { useStudioLayout } from "../hooks/studio-layout-context"
import type { StudioItem } from "../model/types"
import {
  getStudioAdjacentItems,
  getStudioItemHref,
} from "../model/unified-registry.adapter"

interface StudioDockProps {
  item: StudioItem | null
}

type Expanded = "install" | "variants" | null
type MobileDrawerTarget = "install" | "variants" | null

const DOCK_BUTTON =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-xl px-2  text-[11px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-9 sm:gap-2 sm:rounded-xl sm:px-3 sm:text-xs"
const DOCK_BUTTON_IDLE =
  "text-muted-foreground hover:bg-accent hover:text-foreground"
const DOCK_BUTTON_ACTIVE = "bg-accent text-foreground shadow-xs"
const COMPARTMENT_MOTION = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { type: "spring", stiffness: 400, damping: 32 } as const,
} as const
const SPRING = { type: "spring", stiffness: 400, damping: 32 } as const

/**
 * Floating dock docked to the bottom edge of the stage — a single unified
 * surface (unlike a popover, the Install/Variants compartments expand inside
 * the same card). `useMeasure` reports the card's natural width/height and a
 * spring-animated container morphs to it without layout thrash.
 */
export function StudioDock({ item }: StudioDockProps) {
  const { panel, toggleCode, toggleDocs, activeVariantId, setVariantId } =
    useStudioLayout()
  const [measureRef, bounds] = useMeasure()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [expanded, setExpanded] = useState<Expanded>(null)
  const [mobileDrawerTarget, setMobileDrawerTarget] =
    useState<MobileDrawerTarget>(null)
  const isMobile = useMediaQuery("max-sm")
  const navigate = useNavigate()

  const { prev, next } = useMemo(
    () => (item ? getStudioAdjacentItems(item) : {}),
    [item]
  )

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Switching breakpoints resets both modes
  useEffect(() => {
    if (isMobile) {
      setExpanded(null)
    } else {
      setMobileDrawerTarget(null)
    }
  }, [isMobile])

  // Only detail pages render the dock
  if (!item) return null

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
      }
    } catch {
      // Fullscreen may be blocked by browser policy
    }
  }

  const toggleCompartment = (target: Exclude<Expanded, null>) => {
    setExpanded((current) => (current === target ? null : target))
  }

  const handleCompartmentPress = (target: Exclude<Expanded, null>) => {
    if (isMobile) {
      setExpanded(null)
      setMobileDrawerTarget((current) => (current === target ? null : target))
      return
    }
    setMobileDrawerTarget(null)
    toggleCompartment(target)
  }

  const isInstallActive = isMobile
    ? mobileDrawerTarget === "install"
    : expanded === "install"
  const isVariantsActive = isMobile
    ? mobileDrawerTarget === "variants"
    : expanded === "variants"

  const hasDocs = item.collection !== "blocks"
  const variants = item.variants ?? []
  const activeVariant =
    variants.find((variant) => variant.id === activeVariantId) ??
    variants[0] ??
    null

  return (
    <>
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
        {/* Measured container — width spring only; compartment drives height */}
        <motion.div
          initial={false}
          animate={{ width: bounds.width || "auto" }}
          transition={SPRING}
          className="pointer-events-auto origin-bottom overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-xl sm:rounded-3xl dark:border-white/10 dark:bg-zinc-950/95"
        >
          <div ref={measureRef} className="flex w-max flex-col">
            {/* Upper compartment — desktop only; mobile uses a straight bottom drawer */}
            <AnimatePresence initial={false} mode="wait">
              {!isMobile && expanded === "install" ? (
                <motion.div
                  key="install"
                  {...COMPARTMENT_MOTION}
                  className="overflow-hidden"
                >
                  <div className="border-b border-border/60 p-3 sm:p-3.5">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Install
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpanded(null)}
                        aria-label="Close install"
                        title="Close"
                        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <CodeBlockCommand name={item.slug} />
                  </div>
                </motion.div>
              ) : null}

              {!isMobile && expanded === "variants" ? (
                <motion.div
                  key="variants"
                  {...COMPARTMENT_MOTION}
                  className="overflow-hidden"
                >
                  <div className="w-full border-b border-border/60 p-2.5">
                    <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
                      <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Variants
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpanded(null)}
                        aria-label="Close variants"
                        title="Close"
                        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      >
                        <X className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <div
                      role="listbox"
                      aria-label="Variants"
                      className="flex max-h-64 flex-col gap-1 overflow-y-auto"
                    >
                      {variants.map((variant) => {
                        const isActive = variant.id === activeVariant?.id
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            onClick={() => {
                              setVariantId(variant.id)
                              setExpanded(null)
                            }}
                            className={cn(
                              "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-[12px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                              isActive
                                ? "bg-accent text-foreground"
                                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                            )}
                          >
                            <span className="min-w-0 truncate">
                              {variant.title}
                            </span>
                            {isActive ? (
                              <Check
                                className="size-3.5 shrink-0 text-pp-primary"
                                aria-hidden="true"
                              />
                            ) : null}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Bottom action row — icon + label on desktop, icon-only on mobile */}
            <div className="flex h-11 items-center gap-1 px-1.5 sm:h-12 sm:gap-1.5 sm:px-2">
              {/* Previous item */}
              {prev ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        play("attention", {
                          direction: "back",
                          emphasis: "subtle",
                        })
                        void navigate({ href: getStudioItemHref(prev) })
                      }}
                      aria-label="Previous component"
                      className={cn(DOCK_BUTTON, DOCK_BUTTON_IDLE)}
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-[10px]">
                    Previous Component{" "}
                    <Kbd>
                      <ArrowLeft />
                    </Kbd>
                  </TooltipContent>
                </Tooltip>
              ) : null}

              {/* Install */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleCompartmentPress("install")}
                    aria-label="Install command"
                    aria-pressed={isInstallActive}
                    className={cn(
                      DOCK_BUTTON,
                      isInstallActive ? DOCK_BUTTON_ACTIVE : DOCK_BUTTON_IDLE
                    )}
                  >
                    <Terminal className="size-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Install</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Install command</TooltipContent>
              </Tooltip>

              {/* Variant picker — only when the item ships variants */}
              {variants.length > 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleCompartmentPress("variants")}
                      aria-label="Switch variant"
                      aria-pressed={isVariantsActive}
                      className={cn(
                        DOCK_BUTTON,
                        "max-w-32 sm:max-w-40",
                        isVariantsActive ? DOCK_BUTTON_ACTIVE : DOCK_BUTTON_IDLE
                      )}
                    >
                      <Layers className="size-4 shrink-0" aria-hidden="true" />
                      <span className="hidden truncate sm:inline">
                        {activeVariant?.title ?? "Variants"}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Switch variant</TooltipContent>
                </Tooltip>
              ) : null}

              <span
                aria-hidden="true"
                className="mx-0.5 h-4 w-px shrink-0 bg-border/60"
              />

              {/* Source code */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={toggleCode}
                    aria-label="View code"
                    aria-pressed={panel === "code"}
                    className={cn(
                      DOCK_BUTTON,
                      panel === "code" ? DOCK_BUTTON_ACTIVE : DOCK_BUTTON_IDLE
                    )}
                  >
                    <Code2 className="size-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Code</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px]">
                  Source Code{" "}
                  <Kbd>
                    <Code2 />
                  </Kbd>
                </TooltipContent>
              </Tooltip>

              {/* Docs — hidden for blocks */}
              {hasDocs ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={toggleDocs}
                      aria-label="View docs"
                      aria-pressed={panel === "docs"}
                      className={cn(
                        DOCK_BUTTON,
                        panel === "docs" ? DOCK_BUTTON_ACTIVE : DOCK_BUTTON_IDLE
                      )}
                    >
                      <BookOpen className="size-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Docs</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-[10px]">
                    Documentation{" "}
                    <Kbd>
                      <BookOpen />
                    </Kbd>
                  </TooltipContent>
                </Tooltip>
              ) : null}

              {/* Fullscreen */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => void toggleFullscreen()}
                    aria-label={
                      isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                    }
                    aria-pressed={isFullscreen}
                    className={cn(DOCK_BUTTON, DOCK_BUTTON_IDLE)}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="size-4" aria-hidden="true" />
                    ) : (
                      <Maximize2 className="size-4" aria-hidden="true" />
                    )}
                    <span className="hidden sm:inline">
                      {isFullscreen ? "Exit" : "Fullscreen"}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px]">
                  {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                </TooltipContent>
              </Tooltip>

              {/* Next item */}
              {next ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        play("attention", {
                          direction: "forward",
                          emphasis: "subtle",
                        })
                        void navigate({ href: getStudioItemHref(next) })
                      }}
                      aria-label="Next component"
                      className={cn(DOCK_BUTTON, DOCK_BUTTON_IDLE)}
                    >
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-[10px]">
                    Next Component{" "}
                    <Kbd>
                      <ArrowRight />
                    </Kbd>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile: bottom straight drawer for Install / Variants */}
      {isMobile ? (
        <Drawer
          open={mobileDrawerTarget !== null}
          onOpenChange={(open) => {
            if (!open) setMobileDrawerTarget(null)
          }}
          position="bottom"
        >
          <DrawerPopup showBar className="max-h-[85dvh]">
            <DrawerHeader className="flex shrink-0 flex-row items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
              <DrawerTitle className="text-sm font-semibold text-foreground">
                {mobileDrawerTarget === "install" ? "Install" : "Variants"}
              </DrawerTitle>
              <DrawerClose
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close"
                    className="size-8"
                  />
                }
              >
                <X className="size-4" aria-hidden="true" />
              </DrawerClose>
            </DrawerHeader>

            <DrawerPanel scrollable scrollFade className="p-4 pb-10">
              {mobileDrawerTarget === "install" ? (
                <CodeBlockCommand name={item.slug} />
              ) : (
                <div
                  role="listbox"
                  aria-label="Variants"
                  className="flex flex-col gap-1.5"
                >
                  {variants.map((variant) => {
                    const isActive = variant.id === activeVariant?.id
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => {
                          setVariantId(variant.id)
                          setMobileDrawerTarget(null)
                        }}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          isActive
                            ? "border-pp-primary/40 bg-pp-primary/5 text-foreground"
                            : "border-border/60 text-muted-foreground"
                        )}
                      >
                        <span className="min-w-0 truncate">
                          {variant.title}
                        </span>
                        {isActive ? (
                          <Check
                            className="size-4 shrink-0 text-pp-primary"
                            aria-hidden="true"
                          />
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              )}
            </DrawerPanel>
          </DrawerPopup>
        </Drawer>
      ) : null}
    </>
  )
}
