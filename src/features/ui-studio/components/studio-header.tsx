/* eslint-disable react-hooks/set-state-in-effect */
import {
  BookOpenIcon,
  CheckIcon,
  CodeIcon,
  CornersOutIcon,
  DotsThreeVerticalIcon,
  MagnifyingGlassIcon,
  SidebarSimpleIcon,
  SquaresFourIcon,
  TerminalIcon,
  XIcon,
} from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import { play } from "cuelume"
import { useEffect, useState } from "react"

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
import {
  Kbd,
  ModeToggle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui"
import { CodeBlockCommand } from "@/shared/ui/core/code-block"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/core/dropdown-menu"
import { CommandMenuTrigger } from "@/widgets/command-menu"
import { openCommandMenu } from "@/widgets/command-menu/use-command-menu"
import { GitHubStarButton } from "@/widgets/profile-header"

import type { StudioItem } from "../model/types"
import { useStudioStore } from "../store/studio-store"

interface StudioHeaderProps {
  activeItem: StudioItem | null
}

const ACTION_ICON_BTN =
  "relative inline-flex size-9 items-center justify-center rounded-lg bg-muted/75 text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary active:scale-95 dark:bg-white/[0.07] dark:hover:bg-white/[0.14]"

const ACTION_ICON_BTN_ACTIVE =
  "bg-foreground text-background hover:bg-foreground/90 hover:text-background dark:bg-foreground dark:text-background dark:hover:bg-foreground/90"

/**
 * Fixed, borderless floating studio header:
 * - Left: standalone `rounded-lg` Sidebar Toggle (`SidebarSimpleIcon`) + `All Items` shortcut
 * - Right: full action bar on `>= sm`, compact bar + DropdownMenu on `< sm`,
 *   with `Install` opening a centered max-width bottom `Drawer` across all viewports.
 */
export function StudioHeader({ activeItem }: StudioHeaderProps) {
  const sidebarOpen = useStudioStore((state) => state.sidebarOpen)
  const toggleSidebar = useStudioStore((state) => state.toggleSidebar)
  const panel = useStudioStore((state) => state.panel)
  const toggleDocs = useStudioStore((state) => state.toggleDocs)
  const toggleCode = useStudioStore((state) => state.toggleCode)
  const storedVariantId = useStudioStore((state) => state.activeVariantId)

  const [installOpen, setInstallOpen] = useState(false)

  // Close install drawer when active item changes
  useEffect(() => {
    setInstallOpen(false)
  }, [activeItem?.id])

  const hasDocs = activeItem !== null && activeItem.collection !== "blocks"
  const variants = activeItem?.variants ?? []
  const activeVariant =
    variants.find((variant) => variant.id === storedVariantId) ??
    variants[0] ??
    null

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-3 z-40 flex items-center justify-between gap-2 px-3 py-3 select-none sm:px-8 sm:py-3.5">
        {/* Top-left: Sidebar Toggle + All Items inline */}
        <div className="pointer-events-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Toggle sidebar (Ctrl+B)"
                aria-expanded={sidebarOpen}
                onClick={() => {
                  play("tap", { emphasis: "subtle" })
                  toggleSidebar()
                }}
                className={cn(
                  "inline-flex size-11 cursor-pointer items-center justify-center rounded-lg bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none dark:bg-white/[0.08] dark:hover:bg-white/[0.14]",
                  sidebarOpen && "text-foreground"
                )}
              >
                <SidebarSimpleIcon size={32} weight="fill" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[11px]">
              {sidebarOpen ? "Close sidebar" : "Open sidebar"}{" "}
              <Kbd className="ml-1 font-mono text-[10px]">Ctrl+B</Kbd>
            </TooltipContent>
          </Tooltip>

          <Link
            to="/ui"
            onClick={() => play("tap", { emphasis: "subtle" })}
            aria-current={!activeItem ? "page" : undefined}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-lg px-3 text-xs font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:px-3.5 sm:text-[13px]",
              !activeItem
                ? "bg-foreground text-background shadow-xs hover:bg-foreground/90"
                : "bg-muted/85 text-muted-foreground hover:bg-muted hover:text-foreground dark:bg-white/[0.08] dark:hover:bg-white/[0.14]"
            )}
          >
            <SquaresFourIcon size={18} aria-hidden="true" />
            <span>All Items</span>
          </Link>
        </div>

        {/* Top-right: Floating unified action bar */}
        <div className="pointer-events-auto relative flex items-center">
          {/* Desktop / Tablet (`>= sm`): full horizontal action bar */}
          <div className="hidden items-center gap-1 rounded-lg border border-border/60 bg-background/85 p-1 shadow-xs backdrop-blur-md sm:flex">
            {activeItem ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-expanded={installOpen}
                  onClick={() => {
                    play("tap", { emphasis: "subtle" })
                    setInstallOpen(true)
                  }}
                  className={cn(
                    "h-9 gap-2 rounded-lg px-3.5 text-[13px] font-medium transition-colors",
                    installOpen
                      ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background"
                      : "bg-muted/80 text-foreground hover:bg-muted dark:bg-white/[0.08] dark:hover:bg-white/[0.14]"
                  )}
                >
                  <TerminalIcon size={16} aria-hidden="true" />
                  <span>Install</span>
                </Button>

                <span
                  aria-hidden="true"
                  className="mx-0.5 h-5 w-px shrink-0 bg-border/60"
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        play("tap", { emphasis: "subtle" })
                        openCommandMenu()
                      }}
                      aria-label="Search studio items"
                      className={ACTION_ICON_BTN}
                    >
                      <MagnifyingGlassIcon size={18} aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-[11px]">
                    Search{" "}
                    <Kbd className="ml-1 font-mono text-[10px]">Ctrl+K</Kbd>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/blocks-preview/$slug"
                      params={{ slug: activeItem.slug }}
                      search={
                        activeVariant
                          ? { variant: activeVariant.id }
                          : undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => play("tap", { emphasis: "subtle" })}
                      aria-label="Fullscreen preview"
                      className={ACTION_ICON_BTN}
                    >
                      <CornersOutIcon size={18} aria-hidden="true" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-[11px]">
                    Fullscreen Preview
                  </TooltipContent>
                </Tooltip>

                {hasDocs ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          play("tap", { emphasis: "subtle" })
                          toggleDocs()
                        }}
                        aria-label="Toggle documentation"
                        aria-pressed={panel === "docs"}
                        className={cn(
                          ACTION_ICON_BTN,
                          panel === "docs" && ACTION_ICON_BTN_ACTIVE
                        )}
                      >
                        <BookOpenIcon size={18} aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-[11px]">
                      Documentation{" "}
                      <Kbd className="ml-1 font-mono text-[10px]">F</Kbd>
                    </TooltipContent>
                  </Tooltip>
                ) : null}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        play("tap", { emphasis: "subtle" })
                        toggleCode()
                      }}
                      aria-label="Toggle source code"
                      aria-pressed={panel === "code"}
                      className={cn(
                        ACTION_ICON_BTN,
                        panel === "code" && ACTION_ICON_BTN_ACTIVE
                      )}
                    >
                      <CodeIcon size={18} aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-[11px]">
                    Source Code{" "}
                    <Kbd className="ml-1 font-mono text-[10px]">C</Kbd>
                  </TooltipContent>
                </Tooltip>

                <ModeToggle className="size-9 rounded-lg bg-muted/75 shadow-none hover:bg-muted dark:bg-white/[0.07] dark:hover:bg-white/[0.14]" />
              </>
            ) : (
              <>
                <CommandMenuTrigger
                  compact
                  className="h-9 rounded-lg border-0 bg-muted/75 px-3 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground dark:bg-white/[0.07] dark:hover:bg-white/[0.14]"
                />
                <span
                  aria-hidden="true"
                  className="mx-0.5 h-5 w-px shrink-0 bg-border/60"
                />
                <GitHubStarButton className="size-9 rounded-lg bg-muted/75 text-muted-foreground hover:bg-muted hover:text-foreground dark:bg-white/[0.07] dark:hover:bg-white/[0.14]" />
                <ModeToggle className="size-9 rounded-lg bg-muted/75 shadow-none hover:bg-muted dark:bg-white/[0.07] dark:hover:bg-white/[0.14]" />
              </>
            )}
          </div>

          {/* Mobile (`< sm`): compact bar with Search + Theme + Actions dropdown list */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-background/85 p-1 shadow-xs backdrop-blur-md sm:hidden">
            <button
              type="button"
              onClick={() => {
                play("tap", { emphasis: "subtle" })
                openCommandMenu()
              }}
              aria-label="Search studio items"
              className={ACTION_ICON_BTN}
            >
              <MagnifyingGlassIcon size={18} aria-hidden="true" />
            </button>

            {activeItem ? (
              <>
                <ModeToggle className="size-9 rounded-lg bg-muted/75 shadow-none hover:bg-muted dark:bg-white/[0.07] dark:hover:bg-white/[0.14]" />

                <DropdownMenu>
                  <DropdownMenuTrigger
                    type="button"
                    aria-label="Item actions"
                    onClick={() => play("tap", { emphasis: "subtle" })}
                    className={ACTION_ICON_BTN}
                  >
                    <DotsThreeVerticalIcon
                      size={18}
                      weight="bold"
                      aria-hidden="true"
                    />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    sideOffset={8}
                    className="w-52 p-1.5 shadow-xl"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        play("tap", { emphasis: "subtle" })
                        setInstallOpen(true)
                      }}
                      className="cursor-pointer gap-2.5 rounded-md py-2 text-[13px] font-medium"
                    >
                      <TerminalIcon size={16} aria-hidden="true" />
                      <span>Install command</span>
                    </DropdownMenuItem>

                    {hasDocs ? (
                      <DropdownMenuItem
                        onClick={() => {
                          play("tap", { emphasis: "subtle" })
                          toggleDocs()
                        }}
                        className="cursor-pointer gap-2.5 rounded-md py-2 text-[13px] font-medium"
                      >
                        <BookOpenIcon size={16} aria-hidden="true" />
                        <span>Documentation</span>
                        {panel === "docs" ? (
                          <CheckIcon
                            size={14}
                            className="ml-auto text-pp-secondary"
                            aria-hidden="true"
                          />
                        ) : null}
                      </DropdownMenuItem>
                    ) : null}

                    <DropdownMenuItem
                      onClick={() => {
                        play("tap", { emphasis: "subtle" })
                        toggleCode()
                      }}
                      className="cursor-pointer gap-2.5 rounded-md py-2 text-[13px] font-medium"
                    >
                      <CodeIcon size={16} aria-hidden="true" />
                      <span>Source Code</span>
                      {panel === "code" ? (
                        <CheckIcon
                          size={14}
                          className="ml-auto text-pp-secondary"
                          aria-hidden="true"
                        />
                      ) : null}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuItem
                      render={
                        <Link
                          to="/blocks-preview/$slug"
                          params={{ slug: activeItem.slug }}
                          search={
                            activeVariant
                              ? { variant: activeVariant.id }
                              : undefined
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => play("tap", { emphasis: "subtle" })}
                        />
                      }
                      className="cursor-pointer gap-2.5 rounded-md py-2 text-[13px] font-medium"
                    >
                      <CornersOutIcon size={16} aria-hidden="true" />
                      <span>Fullscreen Preview</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <GitHubStarButton className="size-9 rounded-lg bg-muted/75 text-muted-foreground hover:bg-muted hover:text-foreground dark:bg-white/[0.07] dark:hover:bg-white/[0.14]" />
                <ModeToggle className="size-9 rounded-lg bg-muted/75 shadow-none hover:bg-muted dark:bg-white/[0.07] dark:hover:bg-white/[0.14]" />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Responsive centered max-width Drawer for Install command (desktop & mobile) */}
      {activeItem ? (
        <Drawer
          open={installOpen}
          onOpenChange={setInstallOpen}
          position="bottom"
        >
          <DrawerPopup
            showBar
            variant="inset"
            className="mx-auto max-h-[85dvh] w-full max-w-2xl rounded-t-3xl sm:rounded-2xl"
          >
            <DrawerHeader className="flex shrink-0 flex-row items-center justify-between gap-2 border-b border-border/60 px-4 py-3 sm:px-5">
              <DrawerTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <TerminalIcon
                  size={18}
                  className="text-pp-primary"
                  aria-hidden="true"
                />
                <span>Install {activeItem.title}</span>
              </DrawerTitle>
              <DrawerClose
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close"
                    className="size-9 rounded-lg"
                  />
                }
              >
                <XIcon size={18} aria-hidden="true" />
              </DrawerClose>
            </DrawerHeader>
            <DrawerPanel className="p-4 pb-8 sm:p-5 sm:pb-6">
              <p className="mb-3 text-xs text-muted-foreground">
                Run this command to install into your project:
              </p>
              <CodeBlockCommand name={activeItem.slug} />
            </DrawerPanel>
          </DrawerPopup>
        </Drawer>
      ) : null}
    </>
  )
}
