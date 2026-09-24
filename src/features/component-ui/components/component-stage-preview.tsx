/* eslint-disable react-hooks/set-state-in-effect */
import { FileCode2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { CodeBlock, CodeBlockCopyButton } from "@/registry/ui/code-block"
import { cn } from "@/shared/lib"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/core"
import { ScrollFadeEffect } from "@/shared/ui/core/scroll-fade-effect"

import type { SchematicType } from "../types"
import { RenderSchematic } from "./schematics"

export interface ComponentStagePreviewProps {
  slug: string
  schematicType?: SchematicType
  liveDemo?: React.ComponentType | null
  code: string
  className?: string
}

export function ComponentStagePreview({
  slug,
  schematicType,
  liveDemo: LiveDemo,
  code,
  className,
}: ComponentStagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [currentTab, setCurrentTab] = useState("preview")
  const [hasViewedCode, setHasViewedCode] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "300px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleTabChange = (val: string) => {
    setCurrentTab(val)
    if (val === "code") {
      setHasViewedCode(true)
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-accent px-2 pb-2 shadow transition-all duration-300 dark:border-white/10",
        className
      )}
    >
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="flex w-full flex-col gap-0"
      >
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
            <div className="relative z-10 flex w-full items-center justify-center">
              {isInView ? (
                LiveDemo ? (
                  <div className="flex w-full items-center justify-center">
                    <LiveDemo />
                  </div>
                ) : (
                  <div className="scale-110 sm:scale-125">
                    <RenderSchematic type={schematicType} />
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground/50">
                  <div className="size-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                  <span className="text-xs">Loading preview...</span>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="code"
          className="m-0 flex-1 rounded-lg bg-background outline-none"
        >
          {hasViewedCode ? (
            <ScrollFadeEffect className="max-h-[520px] w-full">
              <CodeBlock
                code={code}
                language="tsx"
                showLineNumbers
                className="rounded-none border-0 bg-transparent"
              />
            </ScrollFadeEffect>
          ) : (
            <div className="flex min-h-[240px] items-center justify-center text-muted-foreground/50">
              <div className="size-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
