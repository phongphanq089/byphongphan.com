import type { ElementFormatType, NodeKey } from "lexical"
import * as React from "react"

import { cn } from "../utils/cn"

export function BlockWithAlignableContents({
  format,
  nodeKey,
  className,
  children,
}: {
  format?: ElementFormatType
  nodeKey?: NodeKey
  className?: string
  children: React.ReactNode
}) {
  const alignmentClass =
    format === "center"
      ? "justify-center text-center"
      : format === "right"
        ? "justify-end text-right"
        : "justify-start text-left"

  return (
    <div
      data-lexical-node={nodeKey}
      className={cn("my-4 flex w-full select-none", alignmentClass, className)}
    >
      {children}
    </div>
  )
}
