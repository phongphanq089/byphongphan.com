import { Check, Copy } from "lucide-react"
import { useState } from "react"

import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard"
import { cn } from "@/shared/lib/utils"

export function CopyToClipboardPreview() {
  const { isCopied, copy } = useCopyToClipboard({ timeout: 2000 })
  const [copiedManual, setCopiedManual] = useState(false)
  const codeCommand = "npm install @pp/hooks"

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copy(codeCommand)
    setCopiedManual(true)
    setTimeout(() => setCopiedManual(false), 2000)
  }

  const showCopied = isCopied || copiedManual

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 select-none">
      {/* Code command pill */}
      <div className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-[#0d121c]/80 px-3.5 py-2 backdrop-blur-sm transition-all duration-200 hover:border-white/20">
        <span className="font-mono text-xs text-muted-foreground/90 selection:bg-blue-500/30">
          {codeCommand}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="ml-2 flex size-6 items-center justify-center rounded text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground active:scale-90"
          aria-label="Copy command"
        >
          {showCopied ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>

      {/* Copied feedback badge with green indicator */}
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-medium transition-all duration-300",
          showCopied
            ? "scale-100 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 opacity-100 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            : "scale-100 border-emerald-500/20 bg-emerald-500/5 text-emerald-400/80 opacity-90"
        )}
      >
        <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
        <span>Copied</span>
      </div>
    </div>
  )
}
