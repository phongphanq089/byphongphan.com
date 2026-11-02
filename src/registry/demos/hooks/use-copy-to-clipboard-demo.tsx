import { Check, Copy } from "lucide-react"

import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard"
import { Button } from "@/registry/ui/button"
import { cn } from "cn"

export function UseCopyToClipboardDemo() {
  const { isCopied, copy, copiedText } = useCopyToClipboard({
    timeout: 2000,
  })

  const snippet = "pnpm add @pp/hooks"

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 p-3 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Copy to clipboard
        </span>

        <span
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          aria-live="polite"
        >
          <span
            className={cn(
              "size-1.5 rounded-full transition-colors",
              isCopied ? "bg-emerald-500" : "bg-muted-foreground/40"
            )}
          />
          {isCopied ? "Copied to clipboard" : "Ready to copy"}
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-muted/30 p-2 sm:p-2.5">
        <code className="min-w-0 flex-1 truncate px-2 font-mono text-xs text-foreground sm:text-sm">
          {snippet}
        </code>

        <Button
          size="sm"
          variant="outline"
          onClick={() => copy(snippet)}
          className="h-8 shrink-0 gap-1.5 px-2.5 text-xs"
        >
          {isCopied ? (
            <>
              <Check className="size-3.5 text-emerald-500" />
              <span>Copied</span>
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
        <p className="truncate text-[11px] text-muted-foreground">
          Last copied: <code className="font-mono">{copiedText}</code>
        </p>
      )}
    </div>
  )
}

export default UseCopyToClipboardDemo
