import { Check, Copy } from "lucide-react"
import { useState } from "react"

import { cn } from "@/shared/lib"
import { Button } from "@/shared/ui/core"

interface UsageGuideProps {
  importCode: string
  exampleCode: string
  className?: string
}

export function UsageGuide({
  importCode,
  exampleCode,
  className,
}: UsageGuideProps) {
  const [copiedImport, setCopiedImport] = useState(false)
  const [copiedExample, setCopiedExample] = useState(false)

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setter(true)
      setTimeout(() => setter(false), 2000)
    }
  }

  return (
    <div className={cn("my-6 flex w-full flex-col gap-4", className)}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        Usage
      </h2>

      {/* 1. Import Code Block */}
      <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-card/60 p-4 shadow-xs">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => copyToClipboard(importCode, setCopiedImport)}
          className="absolute top-3 right-3 size-6 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
        >
          {copiedImport ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>

        <pre className="overflow-x-auto font-mono text-xs text-foreground">
          <code>{importCode}</code>
        </pre>
      </div>

      {/* 2. Invocation Code Block */}
      <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-card/60 p-4 shadow-xs">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => copyToClipboard(exampleCode, setCopiedExample)}
          className="absolute top-3 right-3 size-6 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
        >
          {copiedExample ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>

        <pre className="overflow-x-auto font-mono text-xs text-foreground">
          <code>{exampleCode}</code>
        </pre>
      </div>
    </div>
  )
}
