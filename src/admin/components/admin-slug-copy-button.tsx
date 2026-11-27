import { Check, Copy } from "lucide-react"
import { useState } from "react"

import { cn } from "@/shared/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui"

interface AdminSlugCopyButtonProps {
  slug: string
  prefix?: string
  className?: string
}

export function AdminSlugCopyButton({
  slug,
  prefix = "/",
  className,
}: AdminSlugCopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(slug)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => void handleCopy()}
          aria-label={`Copy slug ${slug}`}
          className={cn(
            "group/slug inline-flex max-w-[260px] items-center gap-1 rounded px-1 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground",
            className
          )}
        >
          <span className="truncate">
            {prefix}
            {slug}
          </span>
          {copied ? (
            <Check className="size-3 shrink-0 text-emerald-500" />
          ) : (
            <Copy className="size-3 shrink-0 opacity-0 transition-opacity group-hover/slug:opacity-100" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {copied ? "Copied slug!" : "Copy slug"}
      </TooltipContent>
    </Tooltip>
  )
}
