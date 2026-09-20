import { ChevronDown } from "lucide-react"
import { useState } from "react"

import { cn } from "@/shared/lib"
import { Button } from "@/shared/ui/core"

import type { ComponentApiDoc, PropItem } from "../types"

interface ApiReferenceProps {
  sections: ComponentApiDoc[]
  className?: string
}

function PropRow({ prop }: { prop: PropItem }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-border/40 last:border-b-0">
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex h-auto w-full items-center justify-between px-4 py-3 text-left text-xs"
      >
        <div className="flex items-center gap-2">
          <code className="font-medium text-foreground">{prop.name}</code>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground group-hover:text-foreground">
            {prop.type}
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground/60 transition-transform duration-200",
              isOpen && "rotate-180 text-foreground"
            )}
          />
        </div>
      </Button>

      {isOpen && (
        <div className="flex flex-col gap-2 bg-muted/20 px-4 py-3 text-xs">
          <p className="leading-relaxed text-muted-foreground">
            {prop.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            {prop.default && (
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground/70">Default:</span>
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  {prop.default}
                </code>
              </div>
            )}
            {prop.typeDetails && (
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground/70">Signature:</span>
                <code className="rounded bg-muted px-1.5 py-0.5 text-pp-primary">
                  {prop.typeDetails}
                </code>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function ApiReference({ sections, className }: ApiReferenceProps) {
  if (!sections || sections.length === 0) return null

  return (
    <div className={cn("my-6 flex w-full flex-col gap-8", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          API reference
        </h2>
        <p className="text-xs text-muted-foreground">
          Detailed prop definitions, callbacks, and type signatures for each
          sub-component.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.componentName} className="flex flex-col gap-2.5">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {section.componentName}
            </h3>
            {section.description && (
              <p className="text-xs text-muted-foreground">
                {section.description}
              </p>
            )}

            <div className="overflow-hidden rounded-xl border border-border/80 bg-card/60 shadow-xs backdrop-blur-xs">
              {/* Table Header */}
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2.5 text-[11px] font-medium text-muted-foreground">
                <span>Prop</span>
                <span>Type</span>
              </div>

              {/* Rows */}
              <div className="flex flex-col">
                {section.props.map((prop) => (
                  <PropRow key={prop.name} prop={prop} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
