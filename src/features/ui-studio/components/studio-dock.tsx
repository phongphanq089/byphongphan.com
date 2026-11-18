/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useNavigate } from "@tanstack/react-router"
import { play } from "cuelume"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Layers,
  Maximize2,
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

import type { StudioItem } from "../model/types"
import {
  getStudioAdjacentItems,
  getStudioItemHref,
} from "../model/unified-registry.adapter"
import { useStudioStore } from "../store/studio-store"

interface StudioDockProps {
  item: StudioItem | null
}

type Expanded = "install" | "variants" | null
type MobileDrawerTarget = "install" | "variants" | null

const DOCK_BUTTON =
  "relative inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2 text-[11px] font-medium transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 sm:h-9 sm:gap-2 sm:rounded-xl sm:px-3 sm:text-xs"

const DOCK_BUTTON_IDLE =
  "text-muted-foreground hover:bg-muted/80 hover:text-foreground active:scale-[0.97]"

const DOCK_BUTTON_ACTIVE =
  "border border-primary/25 bg-primary/10 font-semibold text-primary shadow-xs active:scale-[0.97]"

const COMPARTMENT_MOTION = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { type: "spring", stiffness: 420, damping: 34 } as const,
} as const

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const

/**
 * Floating studio dock at the bottom of the preview stage.
 *
 * Responsiveness & Craft:
 * - Mobile (< 640px): Compact icon-only pill with 44px touch-accessible hit areas,
 *   touch-optimized bottom drawer for Install/Variants, and safe-area padding.
 * - Tablet (640px–1024px): Essential labels (Install, Code, Docs) and bounded variant title.
 * - Desktop (>= 1024px): Full labels, spring-morphed upper drawer compartment,
 *   rich tooltips with actual hotkeys (C, F, Left, Right).
 * - Primary color palette for active states and highlights.
 */
export function StudioDock({ item }: StudioDockProps) {
  const panel = useStudioStore((state) => state.panel)
  const toggleCode = useStudioStore((state) => state.toggleCode)
  const toggleDocs = useStudioStore((state) => state.toggleDocs)
  const storedVariantId = useStudioStore((state) => state.activeVariantId)
  const setActiveVariantId = useStudioStore((state) => state.setActiveVariantId)
  const [measureRef, bounds] = useMeasure()
  const [expanded, setExpanded] = useState<Expanded>(null)
  const [mobileDrawerTarget, setMobileDrawerTarget] =
    useState<MobileDrawerTarget>(null)
  const isMobile = useMediaQuery("max-sm")
  const navigate = useNavigate()

  const { prev, next } = useMemo(
    () => (item ? getStudioAdjacentItems(item) : {}),
    [item]
  )

  // Switching breakpoints resets both expanded modes to prevent UI ghosting
  useEffect(() => {
    if (isMobile) {
      setExpanded(null)
    } else {
      setMobileDrawerTarget(null)
    }
  }, [isMobile])

  if (!item) return null

  const toggleCompartment = (target: Exclude<Expanded, null>) => {
    play("tap")
    setExpanded((current) => (current === target ? null : target))
  }

  const handleCompartmentPress = (target: Exclude<Expanded, null>) => {
    if (isMobile) {
      play("tap")
      setExpanded(null)
      setMobileDrawerTarget((current) => (current === target ? null : target))
      return
    }
    setMobileDrawerTarget(null)
    toggleCompartment(target)
  }

  const handleToggleCode = () => {
    play("tap")
    toggleCode()
  }

  const handleToggleDocs = () => {
    play("tap")
    toggleDocs()
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
    variants.find((variant) => variant.id === storedVariantId) ??
    variants[0] ??
    null

  return (
    <>
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 w-full max-w-[calc(100vw-1.5rem)] -translate-x-1/2 px-1 sm:bottom-4 sm:max-w-fit sm:px-0">
        {/* Measured container — width spring animated; compartment drives height */}
        <motion.div
          initial={false}
          animate={{ width: bounds.width || "auto" }}
          transition={SPRING}
          className="pointer-events-auto mx-auto origin-bottom overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-xl backdrop-blur-xl sm:rounded-3xl dark:border-white/10 dark:bg-zinc-950/95 dark:shadow-2xl"
        >
          <div
            ref={measureRef}
            className="flex w-max max-w-[calc(100vw-2rem)] flex-col"
          >
            {/* Upper compartment — desktop/tablet popup inside dock surface */}
            <AnimatePresence initial={false} mode="wait">
              {!isMobile && expanded === "install" ? (
                <motion.div
                  key="install"
                  {...COMPARTMENT_MOTION}
                  className="w-full overflow-hidden"
                >
                  <div className="w-full min-w-[380px] border-b border-border/60 p-3 sm:p-4">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5">
                        <Terminal
                          className="size-3.5 text-primary"
                          aria-hidden="true"
                        />
                        <span className="text-[11px] font-semibold tracking-wider text-foreground uppercase">
                          Install Command
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpanded(null)}
                        aria-label="Close install"
                        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      >
                        <X className="size-3.5" aria-hidden="true" />
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
                  className="w-full overflow-hidden"
                >
                  <div className="w-full min-w-[300px] border-b border-border/60 p-2.5 sm:p-3">
                    <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
                      <div className="flex items-center gap-1.5">
                        <Layers
                          className="size-3.5 text-primary"
                          aria-hidden="true"
                        />
                        <span className="text-[10px] font-semibold tracking-wider text-foreground uppercase">
                          Available Variants ({variants.length})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpanded(null)}
                        aria-label="Close variants"
                        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      >
                        <X className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <div
                      role="listbox"
                      aria-label="Variants"
                      className="flex max-h-60 flex-col gap-1 overflow-y-auto pr-0.5"
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
                              play("tap")
                              setActiveVariantId(variant.id)
                              setExpanded(null)
                            }}
                            className={cn(
                              "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                              isActive
                                ? "bg-primary/10 font-semibold text-primary"
                                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            )}
                          >
                            <span className="min-w-0 truncate">
                              {variant.title}
                            </span>
                            {isActive ? (
                              <Check
                                className="size-3.5 shrink-0 text-primary"
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

            {/* Bottom action row */}
            <div className="flex h-10 items-center justify-center gap-0.5 px-1.5 sm:h-12 sm:gap-1.5 sm:px-2">
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
                      aria-label={`Previous: ${prev.title}`}
                      className={cn(
                        DOCK_BUTTON,
                        DOCK_BUTTON_IDLE,
                        "size-8 p-0 sm:size-9"
                      )}
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="flex items-center gap-1.5 text-[11px]"
                  >
                    <span>Previous: {prev.title}</span>
                    <Kbd className="font-mono text-[10px]">←</Kbd>
                  </TooltipContent>
                </Tooltip>
              ) : null}

              {/* Install Command */}
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
                    <Terminal className="size-4 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">Install</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[11px]">
                  Install command
                </TooltipContent>
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
                        "max-w-28 sm:max-w-36 md:max-w-44",
                        isVariantsActive ? DOCK_BUTTON_ACTIVE : DOCK_BUTTON_IDLE
                      )}
                    >
                      <Layers className="size-4 shrink-0" aria-hidden="true" />
                      <span className="hidden truncate sm:inline">
                        {activeVariant?.title ?? "Variants"}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-[11px]">
                    Switch variant ({variants.length})
                  </TooltipContent>
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
                    onClick={handleToggleCode}
                    aria-label="View source code"
                    aria-pressed={panel === "code"}
                    className={cn(
                      DOCK_BUTTON,
                      panel === "code" ? DOCK_BUTTON_ACTIVE : DOCK_BUTTON_IDLE
                    )}
                  >
                    <Code2 className="size-4 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">Code</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="flex items-center gap-1.5 text-[11px]"
                >
                  <span>Source Code</span>
                  <Kbd className="font-mono text-[10px]">C</Kbd>
                </TooltipContent>
              </Tooltip>

              {/* Docs — hidden for blocks */}
              {hasDocs ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleToggleDocs}
                      aria-label="View documentation"
                      aria-pressed={panel === "docs"}
                      className={cn(
                        DOCK_BUTTON,
                        panel === "docs" ? DOCK_BUTTON_ACTIVE : DOCK_BUTTON_IDLE
                      )}
                    >
                      <BookOpen
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">Docs</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="flex items-center gap-1.5 text-[11px]"
                  >
                    <span>Documentation</span>
                    <Kbd className="font-mono text-[10px]">F</Kbd>
                  </TooltipContent>
                </Tooltip>
              ) : null}

              {/* Fullscreen Preview */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/blocks-preview/$slug"
                    params={{ slug: item.slug }}
                    search={
                      activeVariant ? { variant: activeVariant.id } : undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => play("tap")}
                    aria-label="Fullscreen preview"
                    className={cn(DOCK_BUTTON, DOCK_BUTTON_IDLE)}
                  >
                    <Maximize2 className="size-4 shrink-0" aria-hidden="true" />
                    <span className="hidden md:inline">Fullscreen</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[11px]">
                  Fullscreen Preview
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
                      aria-label={`Next: ${next.title}`}
                      className={cn(
                        DOCK_BUTTON,
                        DOCK_BUTTON_IDLE,
                        "size-8 p-0 sm:size-9"
                      )}
                    >
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="flex items-center gap-1.5 text-[11px]"
                  >
                    <span>Next: {next.title}</span>
                    <Kbd className="font-mono text-[10px]">→</Kbd>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile: bottom bottom-sheet drawer for Install / Variants */}
      {isMobile ? (
        <Drawer
          open={mobileDrawerTarget !== null}
          onOpenChange={(open) => {
            if (!open) setMobileDrawerTarget(null)
          }}
          position="bottom"
        >
          <DrawerPopup showBar className="max-h-[85dvh] rounded-t-3xl">
            <DrawerHeader className="flex shrink-0 flex-row items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
              <DrawerTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {mobileDrawerTarget === "install" ? (
                  <>
                    <Terminal
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                    <span>Install Command</span>
                  </>
                ) : (
                  <>
                    <Layers
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                    <span>Available Variants ({variants.length})</span>
                  </>
                )}
              </DrawerTitle>
              <DrawerClose
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close"
                    className="size-8 rounded-full"
                  />
                }
              >
                <X className="size-4" aria-hidden="true" />
              </DrawerClose>
            </DrawerHeader>

            <DrawerPanel scrollable scrollFade className="p-4 pb-12">
              {mobileDrawerTarget === "install" ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Run the command in your terminal to install this component
                    directly into your project.
                  </p>
                  <CodeBlockCommand name={item.slug} />
                </div>
              ) : (
                <div
                  role="listbox"
                  aria-label="Variants"
                  className="flex flex-col gap-2"
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
                          play("tap")
                          setActiveVariantId(variant.id)
                          setMobileDrawerTarget(null)
                        }}
                        className={cn(
                          "flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.99]",
                          isActive
                            ? "border-primary/40 bg-primary/10 font-semibold text-primary"
                            : "border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <span className="min-w-0 truncate">
                          {variant.title}
                        </span>
                        {isActive ? (
                          <Check
                            className="size-4 shrink-0 text-primary"
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
