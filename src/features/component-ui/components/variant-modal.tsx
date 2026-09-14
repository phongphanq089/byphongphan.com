import { Check, Copy } from "lucide-react"
import { useMemo, useState } from "react"

import { siteConfig } from "@/shared/config"
import { cn } from "@/shared/lib"
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/core"

import type { ComponentVariant } from "../types"

interface VariantModalProps {
  variant: ComponentVariant | null
  componentSlug: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VariantModal({
  variant,
  componentSlug,
  open,
  onOpenChange,
}: VariantModalProps) {
  const [packageManager, setPackageManager] = useState<
    "pnpm" | "npm" | "yarn" | "bun"
  >("npm")
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const registryUrl = `${siteConfig.url}/r/${componentSlug}.json`

  const installCommand = useMemo(() => {
    switch (packageManager) {
      case "pnpm":
        return `pnpm dlx shadcn@latest add ${registryUrl}`
      case "npm":
        return `npx shadcn@latest add ${registryUrl}`
      case "yarn":
        return `npx shadcn@latest add ${registryUrl}`
      case "bun":
        return `bunx --bun shadcn@latest add ${registryUrl}`
      default:
        return `npx shadcn@latest add ${registryUrl}`
    }
  }, [packageManager, registryUrl])

  const handleCopyInstall = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(installCommand)
      setCopiedInstall(true)
      setTimeout(() => setCopiedInstall(false), 2000)
    }
  }

  const handleCopyCode = () => {
    if (variant && navigator.clipboard) {
      navigator.clipboard.writeText(variant.code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  if (!variant) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0f] p-6 text-foreground shadow-2xl">
        <DialogHeader className="flex flex-col gap-1 text-left">
          <DialogTitle className="text-base font-semibold text-foreground">
            {variant.title}
          </DialogTitle>
          {variant.description && (
            <p className="text-xs text-muted-foreground">
              {variant.description}
            </p>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-6 pt-2">
          {/* 1. Installation Section */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Installation
            </h4>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/70">
              {/* Package Manager Tab Bar */}
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-2">
                <div className="flex items-center gap-1">
                  {(["pnpm", "npm", "yarn", "bun"] as const).map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPackageManager(pm)}
                      className={cn(
                        "rounded px-2 py-0.5 text-xs transition-colors",
                        packageManager === pm
                          ? "bg-white/20 font-bold text-white shadow-xs"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      {pm}
                    </button>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopyInstall}
                  className="size-6 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  {copiedInstall ? (
                    <Check className="size-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>

              {/* Command Snippet */}
              <div className="p-3">
                <code className="font-mono text-xs break-all text-white/90">
                  {installCommand}
                </code>
              </div>
            </div>
          </div>

          {/* 2. Code Section */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
                Code
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleCopyCode}
                className="size-6 text-white/70 hover:bg-white/10 hover:text-white"
              >
                {copiedCode ? (
                  <Check className="size-3.5 text-emerald-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>
            </div>

            <div className="relative max-h-[380px] overflow-y-auto rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs leading-relaxed text-white/90">
              <pre>
                <code>{variant.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
