import { Check, Copy } from "lucide-react"
import { useMemo, useState } from "react"

import { siteConfig } from "@/shared/config"
import { cn } from "@/shared/lib"
import { Button } from "@/shared/ui/core"

interface InstallationGuideProps {
  componentSlug: string
  dependencies?: string[]
  fileName?: string
  code?: string
  className?: string
}

export function InstallationGuide({
  componentSlug,
  dependencies = ["radix-ui", "lucide-react", "class-variance-authority"],
  fileName = `components/ui/${componentSlug}.tsx`,
  code,
  className,
}: InstallationGuideProps) {
  const [tab, setTab] = useState<"command" | "manual">("manual")
  const [packageManager, setPackageManager] = useState<
    "pnpm" | "npm" | "yarn" | "bun"
  >("bun")
  const [copiedDep, setCopiedDep] = useState(false)
  const [copiedUtil, setCopiedUtil] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedCli, setCopiedCli] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const registryUrl = `${siteConfig.url}/r/${componentSlug}.json`

  const cliCommand = useMemo(() => {
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

  const depCommand = useMemo(() => {
    const depString = dependencies.join(" ")
    switch (packageManager) {
      case "pnpm":
        return `pnpm add ${depString}`
      case "npm":
        return `npm install ${depString}`
      case "yarn":
        return `yarn add ${depString}`
      case "bun":
        return `bun add ${depString}`
      default:
        return `pnpm add ${depString}`
    }
  }, [packageManager, dependencies])

  const utilCode = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setter(true)
      setTimeout(() => setter(false), 2000)
    }
  }

  return (
    <div className={cn("my-6 flex w-full flex-col gap-5", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Installation
        </h2>

        {/* Tab Switcher: Command vs Manual */}
        <div className="flex items-center rounded-lg border border-border/80 bg-muted/40 p-0.5">
          <button
            type="button"
            onClick={() => setTab("command")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              tab === "command"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Command
          </button>
          <button
            type="button"
            onClick={() => setTab("manual")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              tab === "manual"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Manual
          </button>
        </div>
      </div>

      {/* 1. Command Mode */}
      {tab === "command" && (
        <div className="overflow-hidden rounded-xl border border-border/80 bg-card/60 shadow-xs">
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-2">
            <div className="flex items-center gap-1">
              {(["pnpm", "npm", "yarn", "bun"] as const).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPackageManager(pm)}
                  className={cn(
                    "rounded px-2 py-0.5 text-xs transition-colors",
                    packageManager === pm
                      ? "bg-accent font-bold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
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
              onClick={() => copyToClipboard(cliCommand, setCopiedCli)}
              className="size-6 text-muted-foreground hover:text-foreground"
            >
              {copiedCli ? (
                <Check className="size-3.5 text-emerald-400" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          </div>

          <div className="p-4">
            <code className="text-xs break-all text-foreground">
              {cliCommand}
            </code>
          </div>
        </div>
      )}

      {/* 2. Manual Stepper Mode */}
      {tab === "manual" && (
        <div className="relative flex flex-col gap-8 pl-8">
          {/* Vertical Connecting Line */}
          <div className="absolute top-3 bottom-4 left-3 w-px bg-border/80" />

          {/* Step 1: Install Dependencies */}
          <div className="relative flex flex-col gap-3">
            <div className="absolute -left-8 flex size-6 items-center justify-center rounded-full border border-border bg-background text-[11px] font-bold text-muted-foreground">
              1
            </div>

            <span className="text-xs font-semibold text-foreground">
              Install the following dependencies
            </span>

            <div className="overflow-hidden rounded-xl border border-border/80 bg-card/60">
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-1.5">
                <div className="flex items-center gap-1">
                  {(["pnpm", "yarn", "npm", "bun"] as const).map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPackageManager(pm)}
                      className={cn(
                        "rounded px-2 py-0.5 text-xs transition-colors",
                        packageManager === pm
                          ? "bg-accent font-bold text-foreground"
                          : "text-muted-foreground hover:text-foreground"
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
                  onClick={() => copyToClipboard(depCommand, setCopiedDep)}
                  className="size-6 text-muted-foreground hover:text-foreground"
                >
                  {copiedDep ? (
                    <Check className="size-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>

              <div className="p-3">
                <code className="text-xs break-all text-foreground">
                  {depCommand}
                </code>
              </div>
            </div>
          </div>

          {/* Step 2: Add cn helper */}
          <div className="relative flex flex-col gap-3">
            <div className="absolute -left-8 flex size-6 items-center justify-center rounded-full border border-border bg-background text-[11px] font-bold text-muted-foreground">
              2
            </div>

            <span className="text-xs font-semibold text-foreground">
              Add a cn helper
            </span>

            <div className="overflow-hidden rounded-xl border border-border/80 bg-card/60">
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-muted px-1 py-0.5 text-[10px] font-bold text-muted-foreground">
                    TS
                  </span>
                  <span className="text-xs text-muted-foreground">
                    lib/utils.ts
                  </span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => copyToClipboard(utilCode, setCopiedUtil)}
                  className="size-6 text-muted-foreground hover:text-foreground"
                >
                  {copiedUtil ? (
                    <Check className="size-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>

              <div className="p-3 text-xs text-foreground">
                <pre>
                  <code>{`export { cn } from "@/shared/lib/utils"`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3: Copy code into project */}
          {code && (
            <div className="relative flex flex-col gap-3">
              <div className="absolute -left-8 flex size-6 items-center justify-center rounded-full border border-border bg-background text-[11px] font-bold text-muted-foreground">
                3
              </div>

              <span className="text-xs font-semibold text-foreground">
                Copy and paste the following code into your project
              </span>

              <div className="overflow-hidden rounded-xl border border-border/80 bg-card/60">
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">⚛</span>
                    <span className="text-xs text-muted-foreground">
                      {fileName}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => copyToClipboard(code, setCopiedCode)}
                    className="size-6 text-muted-foreground hover:text-foreground"
                  >
                    {copiedCode ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </Button>
                </div>

                <div
                  className={cn(
                    "relative overflow-hidden p-4 text-xs leading-relaxed text-foreground transition-all duration-300",
                    !isExpanded && "max-h-60"
                  )}
                >
                  <pre className="overflow-x-auto">
                    <code>{code}</code>
                  </pre>

                  {!isExpanded && (
                    <div className="absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-gradient-to-t from-card to-transparent p-3">
                      <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="rounded-md border border-border bg-background px-3 py-1 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-accent"
                      >
                        Expand
                      </button>
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div className="flex justify-center border-t border-border/40 p-2">
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Collapse
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Notice */}
          <div className="relative flex flex-col gap-1">
            <div className="absolute -left-8 flex size-6 items-center justify-center rounded-full border border-border bg-background text-[11px] font-bold text-muted-foreground">
              {code ? 4 : 3}
            </div>

            <span className="text-xs font-semibold text-foreground">
              Update the import paths to match your project setup
            </span>
            <p className="text-xs text-muted-foreground">
              Ensure paths like <code>@/lib/utils</code> align with your
              tsconfig aliases.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
