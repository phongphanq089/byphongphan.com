import { play } from "cuelume"
import { ArrowUpRight, Check, ChevronDown, Copy } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React, { useMemo, useState } from "react"

import { siteConfig } from "@/shared/config"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/core"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/core/dropdown-menu"
import {
  ChatGptIcon,
  ClaudeIcon,
  CursorIcon,
  GitHub,
  GrokIcon,
  MarkdownIcon,
  V0Icon,
} from "@/shared/ui/icons"

import type { StudioItem } from "../model/types"
import { getStudioSourceFiles } from "../model/unified-registry.adapter"

export interface DocItemInfo {
  slug: string
  title?: string
  name?: string
  description?: string
  collection?: string
  sourcePath?: string
}

export interface DocActionsDropdownProps {
  item: DocItemInfo
  segment?: string | null
  rawMdxContent?: string | null
  className?: string
  size?: "sm" | "default" | "lg"
}

export function DocActionsDropdown({
  item,
  segment,
  rawMdxContent,
  className,
  size = "sm",
}: DocActionsDropdownProps) {
  const [copied, setCopied] = useState(false)

  const itemTitle = item.title || item.name || item.slug
  const itemDesc = item.description || ""

  const resolvedSegment = useMemo(() => {
    if (segment) return segment
    if (item.collection === "hooks") return "hooks"
    if (item.collection === "blocks") return "blocks"
    return "components"
  }, [segment, item.collection])

  const docUrl = useMemo(
    () => `${siteConfig.url}/ui/${resolvedSegment}/${item.slug}.md`,
    [resolvedSegment, item.slug]
  )

  const primarySourcePath = useMemo(() => {
    if (item.sourcePath) return item.sourcePath
    try {
      const sources = getStudioSourceFiles(item as StudioItem)
      return sources[0]?.path
    } catch {
      return undefined
    }
  }, [item])

  const githubUrl = useMemo(() => {
    if (!primarySourcePath) {
      return "https://github.com/phongphanq089/byphongphan.com"
    }
    return `https://github.com/phongphanq089/byphongphan.com/blob/main/src/registry/${primarySourcePath}`
  }, [primarySourcePath])

  const prompt = useMemo(
    () =>
      `Web search I'm looking at this component documentation: ${docUrl}
I want to use it in a React (TypeScript) project.
Help me understand how to use it step-by-step, including explaining key concepts, showing practical examples with TypeScript code, and pointing out common pitfalls.
Be ready to answer follow-up questions and help debug issues based on the documentation.`,
    [docUrl]
  )

  const handleCopy = async () => {
    const textToCopy =
      rawMdxContent ||
      `# ${itemTitle}\n\n> ${itemDesc}\n\nDocumentation: ${docUrl}`

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      play("tap", { emphasis: "subtle" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const openExternal = (url: string) => {
    play("tap", { emphasis: "subtle" })
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border/80 bg-secondary/50 shadow-2xs transition-colors hover:border-border",
        className
      )}
    >
      {/* Primary Action: Copy page as markdown */}
      <Button
        type="button"
        variant="ghost"
        size={size === "lg" ? "default" : "sm"}
        onClick={handleCopy}
        className={cn(
          "gap-1.5 rounded-r-none border-r border-border/60 text-xs font-medium text-foreground hover:bg-accent/60",
          size === "lg" ? "h-9 px-3 text-sm" : "h-7 px-2.5 text-xs"
        )}
        title="Copy page as Markdown"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="inline-flex items-center gap-1.5 text-emerald-500"
            >
              <Check className="size-3.5" aria-hidden="true" />
              <span>Copied</span>
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="inline-flex items-center gap-1.5"
            >
              <Copy className="size-3.5 text-pp-primary" aria-hidden="true" />
              <span>Copy page</span>
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {/* Dropdown Menu Trigger for AI & Markdown Links */}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Open with AI and view options"
          className={cn(
            "inline-flex cursor-pointer items-center justify-center rounded-r-lg border-0 bg-transparent text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
            size === "lg" ? "size-9 px-2" : "size-7 px-1"
          )}
        >
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="bottom"
          sideOffset={6}
          className="w-56 p-1.5 shadow-xl"
        >
          {/* Markdown & Repo Views */}
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => openExternal(docUrl)}
              className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
            >
              <MarkdownIcon size={14} />
              <span>View as Markdown</span>
              <ArrowUpRight
                className="ml-auto size-3 opacity-50"
                aria-hidden="true"
              />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleCopy}
              className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
            >
              <Copy
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              <span>Copy page as Markdown</span>
            </DropdownMenuItem>

            {primarySourcePath && (
              <DropdownMenuItem
                onClick={() => openExternal(githubUrl)}
                className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
              >
                <GitHub size={14} />
                <span>Open in GitHub</span>
                <ArrowUpRight
                  className="ml-auto size-3 opacity-50"
                  aria-hidden="true"
                />
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1" />

          {/* AI Assistants Section */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-1.5 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase select-none">
              Ask with AI
            </DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() =>
                openExternal(
                  `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`
                )
              }
              className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
            >
              <ChatGptIcon size={14} />
              <span>Open in ChatGPT</span>
              <ArrowUpRight
                className="ml-auto size-3 opacity-50"
                aria-hidden="true"
              />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                openExternal(
                  `https://claude.ai/new?q=${encodeURIComponent(prompt)}`
                )
              }
              className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
            >
              <ClaudeIcon size={14} />
              <span>Open in Claude</span>
              <ArrowUpRight
                className="ml-auto size-3 opacity-50"
                aria-hidden="true"
              />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                openExternal(
                  `cursor://anysphere.cursor-always-local/open-remote?url=${encodeURIComponent(docUrl)}`
                )
              }
              className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
            >
              <CursorIcon size={14} />
              <span>Open in Cursor</span>
              <ArrowUpRight
                className="ml-auto size-3 opacity-50"
                aria-hidden="true"
              />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                openExternal(
                  `https://v0.dev/chat?q=${encodeURIComponent(prompt)}`
                )
              }
              className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
            >
              <V0Icon size={14} />
              <span>Open in v0</span>
              <ArrowUpRight
                className="ml-auto size-3 opacity-50"
                aria-hidden="true"
              />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                openExternal(
                  `https://x.com/i/grok?text=${encodeURIComponent(prompt)}`
                )
              }
              className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
            >
              <GrokIcon size={14} />
              <span>Open in Grok</span>
              <ArrowUpRight
                className="ml-auto size-3 opacity-50"
                aria-hidden="true"
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
