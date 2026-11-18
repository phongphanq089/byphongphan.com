import { play } from "cuelume"
import { Check, ChevronDown, Copy } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

import { siteConfig } from "@/shared/config"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/core"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/core/dropdown-menu"

type AiClient = "cursor" | "claude" | "vscode" | "opencode"
type PackageManager = "npm" | "pnpm" | "bun" | "yarn"

const CLIENTS: { id: AiClient; label: string }[] = [
  { id: "cursor", label: "cursor" },
  { id: "claude", label: "claude" },
  { id: "vscode", label: "vscode" },
  { id: "opencode", label: "opencode" },
]

const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "bun", "yarn"]

const SAMPLE_PROMPTS = [
  "Add a line nav component",
  "Add a spotlight card component",
  "Add a koi background component",
  "Add a time scrubber component",
  "Add an artcraft scroll scrubber",
  "Add a useClickOutside hook",
  "Add a middle truncation component",
  "Add a scroll indicator with tick marks",
]

export function McpGuide() {
  const [selectedClient, setSelectedClient] = useState<AiClient>("vscode")
  const [selectedPkg, setSelectedPkg] = useState<PackageManager>("npm")

  // Copy states for individual sections
  const [copiedStep1, setCopiedStep1] = useState(false)
  const [copiedStep2, setCopiedStep2] = useState(false)
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(
    null
  )

  // Construct CLI command
  const getCommand = () => {
    switch (selectedPkg) {
      case "pnpm":
        return `pnpm dlx shadcn@latest mcp init --client ${selectedClient}`
      case "bun":
        return `bunx --bun shadcn@latest mcp init --client ${selectedClient}`
      case "yarn":
        return `yarn dlx shadcn@latest mcp init --client ${selectedClient}`
      case "npm":
      default:
        return `npx shadcn@latest mcp init --client ${selectedClient}`
    }
  }

  const componentsJsonSnippet = `{
  "registries": {
    "@phongphan": "${siteConfig.url}/r/{name}.json"
  }
}`

  const copyToClipboard = async (text: string, onSuccess: () => void) => {
    try {
      await navigator.clipboard.writeText(text)
      play("tap", { emphasis: "subtle" })
      onSuccess()
    } catch {
      // Fallback
    }
  }

  const handleCopyStep1 = () => {
    void copyToClipboard(getCommand(), () => {
      setCopiedStep1(true)
      setTimeout(() => setCopiedStep1(false), 2000)
    })
  }

  const handleCopyStep2 = () => {
    void copyToClipboard(componentsJsonSnippet, () => {
      setCopiedStep2(true)
      setTimeout(() => setCopiedStep2(false), 2000)
    })
  }

  const handleCopyPrompt = (prompt: string, index: number) => {
    void copyToClipboard(prompt, () => {
      setCopiedPromptIndex(index)
      setTimeout(() => setCopiedPromptIndex(null), 2000)
    })
  }

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-8 sm:py-12 md:px-8 md:py-16">
      {/* ── Page Header ── */}
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Build with your AI editor
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Connect the shadcn MCP server and ask for any phongphan component by
          name. Your editor searches the registry and installs it for you.
        </p>
      </header>

      {/* ── Steps Container ── */}
      <div className="flex flex-col gap-12">
        {/* ── Step 01: Install MCP Server ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="pt-1 font-mono text-xs font-semibold tracking-widest text-primary select-none">
              01
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                Install the MCP server
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Pick your AI client, run the command, then restart the client.
              </p>
            </div>
          </div>

          <div className="ml-0 flex flex-col gap-3 sm:ml-7">
            {/* AI Client Tabs */}
            <div className="inline-flex self-start rounded-lg border border-border/70 bg-secondary/40 p-1 backdrop-blur-xs">
              {CLIENTS.map((client) => {
                const isSelected = selectedClient === client.id
                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => {
                      play("tap", { emphasis: "subtle" })
                      setSelectedClient(client.id)
                    }}
                    className={cn(
                      "cursor-pointer rounded-md px-3 py-1 font-mono text-xs font-medium lowercase transition-all select-none",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {client.label}
                  </button>
                )
              })}
            </div>

            {/* Command Box with Package Manager Switcher */}
            <div className="group flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-border/80 bg-card/60 px-3.5 py-3 shadow-2xs backdrop-blur-md transition-colors focus-within:border-primary/60 hover:border-primary/40">
              <div className="flex min-w-0 items-center gap-3">
                {/* Package Manager Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="Select package manager"
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-1 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    <span>{selectedPkg}</span>
                    <ChevronDown
                      className="size-3 opacity-60"
                      aria-hidden="true"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    side="bottom"
                    sideOffset={4}
                    className="w-24 p-1 shadow-xl"
                  >
                    {PACKAGE_MANAGERS.map((pkg) => (
                      <DropdownMenuItem
                        key={pkg}
                        onClick={() => {
                          play("tap", { emphasis: "subtle" })
                          setSelectedPkg(pkg)
                        }}
                        className={cn(
                          "cursor-pointer font-mono text-xs font-medium capitalize",
                          selectedPkg === pkg && "font-semibold text-primary"
                        )}
                      >
                        {pkg}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Command text */}
                <code className="truncate font-mono text-xs text-foreground/90 sm:text-[13px]">
                  {getCommand()}
                </code>
              </div>

              {/* Copy button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopyStep1}
                aria-label="Copy command"
                className="size-7 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copiedStep1 ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="text-emerald-500"
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <Copy className="size-3.5" aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Step 02: Add registry to project ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="pt-1 font-mono text-xs font-semibold tracking-widest text-primary select-none">
              02
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                Add the registry to your project
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Add the snippet to your{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                  components.json
                </code>{" "}
                file so the server can find phongphan components.
              </p>
            </div>
          </div>

          <div className="ml-0 sm:ml-7">
            <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card/60 p-4 shadow-2xs backdrop-blur-md transition-colors hover:border-primary/40">
              <div className="absolute top-3 right-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyStep2}
                  className="h-7 gap-1.5 px-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copiedStep2 ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className="inline-flex items-center gap-1 text-emerald-500"
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
                        className="inline-flex items-center gap-1"
                      >
                        <Copy className="size-3.5" aria-hidden="true" />
                        <span>Copy</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>

              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground/90 sm:text-[13px]">
                <code>
                  {"{\n"}
                  {"  "}
                  <span className="font-medium text-primary">"registries"</span>
                  {": {\n"}
                  {"    "}
                  <span className="font-medium text-primary">"@phongphan"</span>
                  {': "'}
                  <span className="text-foreground/80">
                    {siteConfig.url}/r/
                  </span>
                  <span className="font-medium text-primary">{"{name}"}</span>
                  {'.json"\n'}
                  {"  }\n"}
                  {"}"}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* ── Step 03: Ask for a component ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="pt-1 font-mono text-xs font-semibold tracking-widest text-primary select-none">
              03
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                Ask for a component
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Describe what you want. A few prompts to start with:
              </p>
            </div>
          </div>

          <div className="ml-0 flex flex-col gap-2 sm:ml-7">
            {SAMPLE_PROMPTS.map((prompt, idx) => {
              const isCopied = copiedPromptIndex === idx
              return (
                <div
                  key={prompt}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card/40 px-4 py-2.5 transition-all hover:border-primary/40 hover:bg-primary/[0.02]"
                >
                  <span className="font-mono text-xs text-foreground/90 sm:text-[13px]">
                    {prompt}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyPrompt(prompt, idx)}
                    className="h-6 gap-1 px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isCopied ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.7, opacity: 0 }}
                          transition={{ duration: 0.12 }}
                          className="inline-flex items-center gap-1 text-emerald-500"
                        >
                          <Check className="size-3" aria-hidden="true" />
                          <span>Copied</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.7, opacity: 0 }}
                          transition={{ duration: 0.12 }}
                          className="inline-flex items-center gap-1"
                        >
                          <Copy className="size-3" aria-hidden="true" />
                          <span>Copy</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
