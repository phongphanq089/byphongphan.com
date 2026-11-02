import { Check, Copy } from "lucide-react"

import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

export function UseCopyToClipboardDemo() {
  const { isCopied, copy, copiedText } = useCopyToClipboard({ timeout: 2000 })
  const snippet = "pnpm add @pp/hooks"

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 p-6">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Clipboard Feedback
        </span>
        {isCopied ? (
          <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Copied!
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Idle
          </Badge>
        )}
      </div>

      <div className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0B0F17] px-4 py-3 shadow-inner">
        <code className="font-mono text-xs text-foreground selection:bg-blue-500/30">
          {snippet}
        </code>
        <Button
          size="sm"
          variant="outline"
          onClick={() => copy(snippet)}
          className="h-8 gap-1.5 border-white/10 bg-white/5 text-xs text-foreground hover:bg-white/10"
        >
          {isCopied ? (
            <>
              <Check className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>

      {copiedText && (
        <span className="font-mono text-[11px] text-muted-foreground">
          Last copied: &quot;{copiedText}&quot;
        </span>
      )}
    </div>
  )
}
