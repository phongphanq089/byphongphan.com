import { Check, Code2, Copy } from "lucide-react"
import { useState } from "react"

import { cn } from "cn"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"

export interface CardShowcaseCodeProps {
  title?: string
  description?: string
  tag?: string
  className?: string
}

const SAMPLE_CODE = `<div className="flex items-center gap-3">
  <Checkbox id="showcase-check" defaultChecked />
  <label htmlFor="showcase-check" className="text-xs font-medium">
    Enable Hardware Acceleration
  </label>
</div>`

export function CardShowcaseCode({
  title = "Toggle & Checkbox Module",
  description = "Component stage with expandable syntax block and quick-copy action.",
  tag = "Controls",
  className,
}: CardShowcaseCodeProps) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-lg flex-col rounded-xl border border-border bg-card p-6 shadow-sm select-none",
        className
      )}
    >
      {/* Header with Title, Description, Tag & Code Toggle Button */}
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {tag && (
            <Badge
              variant="outline"
              className="border-primary/30 font-mono text-[10px] text-primary uppercase"
            >
              {tag}
            </Badge>
          )}
          <Button
            variant={showCode ? "secondary" : "outline"}
            size="sm"
            className="h-7 gap-1.5 px-2.5 text-xs"
            onClick={() => setShowCode(!showCode)}
          >
            <Code2 className="size-3.5" />
            <span>{showCode ? "Preview" : "Code"}</span>
          </Button>
        </div>
      </div>

      {/* Recessed Stage or Code View */}
      {showCode ? (
        <div className="relative flex min-h-[140px] flex-1 flex-col justify-between overflow-hidden rounded-lg border border-border/60 bg-neutral-950 p-4 font-mono text-xs text-neutral-300">
          <pre className="overflow-x-auto leading-relaxed whitespace-pre">
            <code>{SAMPLE_CODE}</code>
          </pre>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-neutral-500">
            <span>TSX • 3 lines</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 px-2 text-[10px] text-neutral-400 hover:text-white"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative flex min-h-[140px] flex-1 items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-background/50 p-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundSize: "20px 20px",
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
            }}
          />

          <div className="relative z-10 flex items-center gap-3 rounded-lg border border-border/60 bg-card/80 px-4 py-3 shadow-xs backdrop-blur-xs">
            <Checkbox id="showcase-checkbox-demo" defaultChecked />
            <label
              htmlFor="showcase-checkbox-demo"
              className="cursor-pointer text-xs font-medium text-foreground"
            >
              Enable Hardware Acceleration
            </label>
          </div>
        </div>
      )}

      {/* Footer Info Row */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono text-[11px]">
          {showCode ? "Syntax mode active" : "Canvas: Interactive preview"}
        </span>
        <Badge variant="outline" className="border-border/60 text-[10px]">
          {showCode ? "Source code" : "Interactive"}
        </Badge>
      </div>
    </div>
  )
}

export default CardShowcaseCode
