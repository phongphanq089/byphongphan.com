import type React from "react"

import { cn } from "@/shared/lib"

export interface PropDefinition {
  /** Name of the prop, e.g. "variant", "size", "className" */
  prop: string
  /** Type definition, e.g. '"circle" | "iris"', 'boolean', 'number' */
  type: string
  /** Default value if any, e.g. '"circle"', 'false', or '-' */
  default?: string
  /** Optional descriptive summary */
  description?: string
}

export interface PropsTableProps {
  items: PropDefinition[]
  className?: string
  /** Title above the table, e.g. "Props" or "CardCanvas Props" */
  title?: string
}

export function PropsTable({ items, className, title }: PropsTableProps) {
  if (!items || items.length === 0) return null

  const hasDescription = items.some((item) => Boolean(item.description))

  return (
    <div className={cn("my-6 flex w-full flex-col gap-2.5", className)}>
      {title && (
        <h4 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h4>
      )}

      <div className="w-full overflow-hidden overflow-x-auto rounded-xl border border-border/80 bg-card/40 shadow-xs backdrop-blur-xs dark:border-white/10 dark:bg-[#0c0c0e]">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="border-b border-border/80 bg-muted/20 dark:border-white/10 dark:bg-white/[0.02]">
            <tr>
              <th className="w-[140px] border-r border-border/60 px-4 py-3 text-xs font-semibold tracking-tight text-foreground sm:w-[160px] dark:border-white/10">
                Prop
              </th>
              <th className="min-w-[220px] border-r border-border/60 px-4 py-3 text-xs font-semibold tracking-tight text-foreground dark:border-white/10">
                Type
              </th>
              <th
                className={cn(
                  "w-[120px] px-4 py-3 text-xs font-semibold tracking-tight text-foreground sm:w-[140px]",
                  hasDescription &&
                    "border-r border-border/60 dark:border-white/10"
                )}
              >
                Default
              </th>
              {hasDescription && (
                <th className="min-w-[200px] px-4 py-3 text-xs font-semibold tracking-tight text-foreground">
                  Description
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 dark:divide-white/10">
            {items.map((item) => {
              const cleanDefault = item.default?.trim() ?? "-"
              const isDash =
                cleanDefault === "-" ||
                cleanDefault === "—" ||
                cleanDefault === "" ||
                cleanDefault === "undefined"

              return (
                <tr
                  key={item.prop}
                  className="transition-colors hover:bg-muted/15 dark:hover:bg-white/[0.015]"
                >
                  {/* 1. Prop Column */}
                  <td className="border-r border-border/40 px-4 py-3 align-middle text-xs font-medium text-foreground dark:border-white/10">
                    <code className="inline-flex items-center rounded-md border border-border/80 bg-muted/50 px-2 py-1 font-mono text-xs font-medium tracking-tight text-foreground dark:border-white/15 dark:bg-white/[0.04]">
                      {item.prop}
                    </code>
                  </td>

                  {/* 2. Type Column */}
                  <td className="border-r border-border/40 px-4 py-3 align-middle text-xs text-foreground/90 dark:border-white/10">
                    <code className="inline-block max-w-full rounded-md border border-border/80 bg-muted/40 px-2.5 py-1 font-mono text-xs leading-relaxed break-all text-foreground/90 dark:border-white/15 dark:bg-white/[0.04]">
                      {item.type}
                    </code>
                  </td>

                  {/* 3. Default Column */}
                  <td
                    className={cn(
                      "px-4 py-3 align-middle text-xs text-foreground/90",
                      hasDescription &&
                        "border-r border-border/40 dark:border-white/10"
                    )}
                  >
                    {isDash ? (
                      <span className="font-mono text-xs text-muted-foreground/60">
                        -
                      </span>
                    ) : (
                      <code className="inline-block rounded-md border border-border/80 bg-muted/40 px-2 py-1 font-mono text-xs font-medium text-foreground/90 dark:border-white/15 dark:bg-white/[0.04]">
                        {cleanDefault}
                      </code>
                    )}
                  </td>

                  {/* 4. Optional Description Column */}
                  {hasDescription && (
                    <td className="px-4 py-3 align-middle text-xs leading-relaxed text-muted-foreground">
                      {item.description ?? "—"}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
