import { FileCode2, Loader2 } from "lucide-react"
import { Suspense } from "react"

import { CodeBlock, CodeBlockCopyButton } from "@/registry/ui/code-block"
import { cn } from "@/shared/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/core"
import { ScrollFadeEffect } from "@/shared/ui/core/scroll-fade-effect"

export interface ComponentStagePreviewProps {
  slug: string
  liveDemo?: React.ComponentType | null
  code: string
  className?: string
  schematicType?: unknown
  eager?: boolean
}

export function ComponentStagePreview({
  slug,
  liveDemo: LiveDemo,
  code,
  className,
}: ComponentStagePreviewProps) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-accent px-2 pb-2 shadow transition-all duration-300 dark:border-white/10",
        className
      )}
    >
      <Tabs defaultValue="preview" className="flex w-full flex-col gap-0">
        <div className="flex h-11 items-center justify-between px-4">
          <TabsList variant="line" className="h-full gap-4 bg-transparent p-0">
            <TabsTrigger
              value="preview"
              className="relative -mb-px h-full cursor-pointer rounded-none border-b-2 border-transparent px-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground data-active:text-foreground data-active:shadow-none"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="relative -mb-px h-full cursor-pointer rounded-none border-b-2 border-transparent px-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground data-active:text-foreground data-active:shadow-none"
            >
              Code
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-1.5 font-mono text-xs text-muted-foreground sm:flex">
              <FileCode2 className="size-3.5 text-primary" />
              <span>{slug}.tsx</span>
            </div>
            <div className="hidden h-3 w-px bg-border/60 sm:block" />
            <CodeBlockCopyButton
              value={code}
              position="inline"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            />
          </div>
        </div>

        <TabsContent
          value="preview"
          className="m-0 w-full flex-1 overflow-hidden rounded-lg bg-background outline-none"
        >
          <div className="relative flex min-h-[380px] w-full items-center justify-center p-4 md:p-8">
            {LiveDemo ? (
              <Suspense fallback={<StageLoader />}>
                <LiveDemo />
              </Suspense>
            ) : (
              <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
                No preview available
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="code"
          className="m-0 flex-1 rounded-lg bg-background outline-none"
        >
          <ScrollFadeEffect className="max-h-[520px] w-full">
            <CodeBlock
              code={code}
              language="tsx"
              showLineNumbers
              className="rounded-none border-0 bg-transparent"
            />
          </ScrollFadeEffect>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StageLoader() {
  return (
    <div className="flex min-h-[250px] w-full items-center justify-center">
      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground/60">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span className="tracking-wider uppercase">Loading preview...</span>
      </div>
    </div>
  )
}
