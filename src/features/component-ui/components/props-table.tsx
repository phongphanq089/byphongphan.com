import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React, { useId, useMemo, useState } from "react"

import { Table } from "@/registry/ui/table"
import { extractTextFromNode } from "@/shared/lib"
import { cn } from "@/shared/lib/utils"

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

export interface PropsTableProps extends React.HTMLAttributes<HTMLTableElement> {
  items?: PropDefinition[]
  title?: string
  className?: string
  children?: React.ReactNode
}

interface ParsedRow {
  id: string
  cells: React.ReactNode[]
  texts: string[]
}

interface ParsedTable {
  headers: string[]
  rawHeaders: React.ReactNode[]
  rows: ParsedRow[]
}

const API_KEYWORDS = [
  "prop",
  "props",
  "property",
  "properties",
  "param",
  "params",
  "parameter",
  "parameters",
  "return",
  "returns",
  "return value",
  "method",
  "methods",
  "method / property",
  "option",
  "options",
  "argument",
  "arguments",
  "field",
  "fields",
  "attribute",
  "attributes",
  "event",
  "events",
]

function isApiTable(headers: string[]): boolean {
  if (headers.length < 2) return false
  const lower = headers.map((h) => h.toLowerCase().trim())
  const first = lower[0]

  const matchesFirst = API_KEYWORDS.some(
    (kw) => first === kw || first.startsWith(kw) || first.includes(kw)
  )

  const hasTypeOrDesc = lower.some(
    (h) =>
      h.includes("type") ||
      h.includes("kiểu") ||
      h.includes("desc") ||
      h.includes("mô tả")
  )

  return matchesFirst && hasTypeOrDesc
}

function parseMdxTableChildren(children: React.ReactNode): ParsedTable | null {
  const childArray = React.Children.toArray(children).filter(
    React.isValidElement
  )
  if (childArray.length === 0) return null

  let headerCells: React.ReactNode[] = []
  const bodyRows: ParsedRow[] = []

  // Iterate over sections: thead, tbody, or direct trs
  for (const section of childArray) {
    if (!React.isValidElement(section)) continue

    const secChildren = React.Children.toArray(
      (section.props as { children?: React.ReactNode })?.children
    ).filter(React.isValidElement)

    const sectionType =
      typeof section.type === "string"
        ? section.type
        : (section.type as { name?: string })?.name || ""
    const hasTh = secChildren.some(
      (row) =>
        React.isValidElement(row) &&
        React.Children.toArray(
          (row.props as { children?: React.ReactNode })?.children
        ).some((cell) => {
          if (!React.isValidElement(cell)) return false
          const cType =
            typeof cell.type === "string"
              ? cell.type
              : (cell.type as { name?: string })?.name || ""
          return cType.toLowerCase().includes("th")
        })
    )

    if (
      headerCells.length === 0 &&
      (sectionType.toLowerCase().includes("head") || hasTh)
    ) {
      const headRow = secChildren[0]
      if (headRow && React.isValidElement(headRow)) {
        headerCells = React.Children.toArray(
          (headRow.props as { children?: React.ReactNode })?.children
        ).filter(React.isValidElement)
        continue
      }
    }

    // Otherwise, treat rows inside this section as body rows
    for (const row of secChildren) {
      if (!React.isValidElement(row)) continue
      const cells = React.Children.toArray(
        (row.props as { children?: React.ReactNode })?.children
      ).filter(React.isValidElement)

      if (cells.length > 0) {
        bodyRows.push({
          id: `row-${bodyRows.length}`,
          cells: cells.map((c) =>
            React.isValidElement(c)
              ? (c.props as { children?: React.ReactNode })?.children
              : c
          ),
          texts: cells.map((c) =>
            extractTextFromNode(
              React.isValidElement(c)
                ? (c.props as { children?: React.ReactNode })?.children
                : c
            ).trim()
          ),
        })
      }
    }
  }

  // Fallback: If no thead was explicitly labeled, but childArray has trs directly
  if (headerCells.length === 0 && childArray.length > 0) {
    const firstRow = childArray[0]
    if (React.isValidElement(firstRow)) {
      headerCells = React.Children.toArray(
        (firstRow.props as { children?: React.ReactNode })?.children
      ).filter(React.isValidElement)

      for (let i = 1; i < childArray.length; i++) {
        const row = childArray[i]
        if (!React.isValidElement(row)) continue
        const cells = React.Children.toArray(
          (row.props as { children?: React.ReactNode })?.children
        ).filter(React.isValidElement)
        if (cells.length > 0) {
          bodyRows.push({
            id: `row-${bodyRows.length}`,
            cells: cells.map((c) =>
              React.isValidElement(c)
                ? (c.props as { children?: React.ReactNode })?.children
                : c
            ),
            texts: cells.map((c) =>
              extractTextFromNode(
                React.isValidElement(c)
                  ? (c.props as { children?: React.ReactNode })?.children
                  : c
              ).trim()
            ),
          })
        }
      }
    }
  }

  if (headerCells.length === 0 || bodyRows.length === 0) {
    return null
  }

  const rawHeaders = headerCells.map((c) =>
    React.isValidElement(c)
      ? (c.props as { children?: React.ReactNode })?.children
      : c
  )
  const headers = headerCells.map((c) =>
    extractTextFromNode(
      React.isValidElement(c)
        ? (c.props as { children?: React.ReactNode })?.children
        : c
    ).trim()
  )

  return { headers, rawHeaders, rows: bodyRows }
}

interface ApiItemData {
  id: string
  nameNode: React.ReactNode
  nameText: string
  typeNode: React.ReactNode
  typeText: string
  defaultNode?: React.ReactNode
  defaultText?: string
  descNode?: React.ReactNode
  descText?: string
}

function ApiItemRow({
  item,
  isOpen,
  onToggle,
}: {
  item: ApiItemData
  isOpen: boolean
  onToggle: () => void
}) {
  const cleanDefault = item.defaultText?.trim()
  const hasDefault =
    Boolean(cleanDefault) &&
    cleanDefault !== "-" &&
    cleanDefault !== "—" &&
    cleanDefault !== "undefined" &&
    cleanDefault !== "null" &&
    cleanDefault !== ""

  const hasDesc = Boolean(item.descText && item.descText.trim().length > 0)

  return (
    <div className="border-b border-border/40 last:border-b-0 dark:border-white/[0.06]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors select-none",
          "hover:bg-muted/30 dark:hover:bg-white/[0.02]",
          "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
          isOpen && "bg-muted/15 dark:bg-white/[0.015]"
        )}
      >
        {/* Left: Prop / Param / Method Name */}
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-[13px] font-semibold tracking-tight break-all text-foreground">
            {item.nameNode}
          </span>
        </div>

        {/* Right: Type Summary & Chevron */}
        <div className="ml-auto flex shrink-0 items-center gap-3">
          {item.typeText && (
            <span className="max-w-[130px] truncate text-right font-mono text-xs text-muted-foreground/80 transition-colors group-hover:text-foreground sm:max-w-[260px] md:max-w-[360px]">
              {item.typeText}
            </span>
          )}
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-200",
              isOpen && "rotate-180 text-foreground"
            )}
          />
        </div>
      </button>

      {/* Expanded Accordion Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/40 bg-muted/10 dark:border-white/[0.06] dark:bg-white/[0.01]"
          >
            <div className="flex flex-col gap-3 px-4 py-3.5 text-xs">
              {hasDesc && (
                <div className="text-[13px] leading-relaxed text-muted-foreground">
                  {item.descNode}
                </div>
              )}

              <div className="flex flex-col gap-2 border-t border-border/30 pt-1 dark:border-white/[0.05]">
                {item.typeNode && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="min-w-[50px] font-mono text-[11px] text-muted-foreground/70 select-none">
                      Type
                    </span>
                    <code className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-[12px] font-medium break-all text-amber-600 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
                      {item.typeNode}
                    </code>
                  </div>
                )}

                {hasDefault && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="min-w-[50px] font-mono text-[11px] text-muted-foreground/70 select-none">
                      Default
                    </span>
                    <code className="rounded border border-border/60 bg-muted/50 px-2 py-0.5 font-mono text-[12px] font-medium text-foreground dark:border-white/10 dark:bg-white/[0.04]">
                      {item.defaultNode ?? cleanDefault}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function PropsTable({
  items,
  title,
  className,
  children,
  ...restProps
}: PropsTableProps) {
  const instanceId = useId()

  // 1. If explicit `items` prop is provided (direct JSX mode)
  const explicitApiItems = useMemo<ApiItemData[] | null>(() => {
    if (!items || items.length === 0) return null
    return items.map((item, idx) => ({
      id: `${item.prop || idx}`,
      nameNode: <code>{item.prop}</code>,
      nameText: item.prop,
      typeNode: <code>{item.type}</code>,
      typeText: item.type,
      defaultNode: item.default ? <code>{item.default}</code> : null,
      defaultText: item.default,
      descNode: item.description,
      descText: item.description,
    }))
  }, [items])

  // 2. Parse from children (MDX table mode)
  const parsedTable = useMemo(() => {
    if (explicitApiItems || !children) return null
    return parseMdxTableChildren(children)
  }, [explicitApiItems, children])

  // Check if parsed table is an API / Prop / Param table
  const parsedApiData = useMemo<{
    nameLabel: string
    typeLabel: string
    items: ApiItemData[]
  } | null>(() => {
    if (!parsedTable || !isApiTable(parsedTable.headers)) return null

    const { headers, rows } = parsedTable
    let nameIdx = 0
    let typeIdx = -1
    let defaultIdx = -1
    let descIdx = -1

    headers.forEach((h, idx) => {
      const lower = h.toLowerCase().trim()
      if (idx === 0) {
        nameIdx = idx
      } else if (
        lower.includes("type") ||
        lower.includes("signature") ||
        lower.includes("kiểu")
      ) {
        typeIdx = idx
      } else if (
        lower.includes("default") ||
        lower.includes("initial") ||
        lower.includes("mặc định")
      ) {
        defaultIdx = idx
      } else if (
        lower.includes("desc") ||
        lower.includes("mô tả") ||
        lower.includes("detail") ||
        lower.includes("summary") ||
        lower.includes("explain")
      ) {
        descIdx = idx
      }
    })

    if (typeIdx === -1 && headers.length > 1) {
      typeIdx = 1
    }
    if (descIdx === -1) {
      if (defaultIdx !== -1 && headers.length > 3) {
        descIdx = 3
      } else if (defaultIdx === -1 && headers.length > 2) {
        descIdx = 2
      }
    }

    const nameLabel = headers[nameIdx] || "Prop"
    const typeLabel =
      typeIdx !== -1 && headers[typeIdx] ? headers[typeIdx] : "Type"

    const apiItems: ApiItemData[] = rows.map((row, idx) => {
      const nameText = row.texts[nameIdx] || ""
      const nameNode = row.cells[nameIdx] ?? nameText

      const typeText = typeIdx !== -1 ? row.texts[typeIdx] || "" : ""
      const typeNode = typeIdx !== -1 ? (row.cells[typeIdx] ?? typeText) : null

      const defaultText = defaultIdx !== -1 ? row.texts[defaultIdx] || "" : ""
      const defaultNode =
        defaultIdx !== -1 ? (row.cells[defaultIdx] ?? defaultText) : null

      const descText = descIdx !== -1 ? row.texts[descIdx] || "" : ""
      const descNode = descIdx !== -1 ? (row.cells[descIdx] ?? descText) : null

      return {
        id: `${instanceId}-${nameText || idx}`,
        nameNode,
        nameText,
        typeNode,
        typeText,
        defaultNode,
        defaultText,
        descNode,
        descText,
      }
    })

    return { nameLabel, typeLabel, items: apiItems }
  }, [parsedTable, instanceId])

  // Final items list
  const activeItems = explicitApiItems || parsedApiData?.items
  const nameLabel = parsedApiData?.nameLabel || "Prop"
  const typeLabel = parsedApiData?.typeLabel || "Type"

  // Open/Close states for accordion rows
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const allOpen = useMemo(() => {
    if (!activeItems || activeItems.length === 0) return false
    return activeItems.every((it) => Boolean(openMap[it.id]))
  }, [activeItems, openMap])

  const toggleAll = () => {
    if (!activeItems) return
    const nextState = !allOpen
    const updated: Record<string, boolean> = {}
    for (const it of activeItems) {
      updated[it.id] = nextState
    }
    setOpenMap(updated)
  }

  // 3. Fallback: If not an API table and no explicit items, render as standard table
  if (!activeItems) {
    return (
      <div className="my-6 w-full overflow-hidden rounded-xl border border-border/60 bg-background/40 shadow-2xs dark:border-white/10 dark:bg-white/[0.01]">
        <Table
          className={cn("w-full border-collapse text-sm", className)}
          {...restProps}
        >
          {children}
        </Table>
      </div>
    )
  }

  return (
    <div className={cn("my-6 flex w-full flex-col gap-2.5", className)}>
      {title && (
        <h4 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h4>
      )}

      <div className="w-full overflow-hidden rounded-xl border border-border/80 bg-card/40 shadow-xs backdrop-blur-xs dark:border-white/10 dark:bg-[#0c0c0e]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/25 px-4 py-2.5 text-xs font-medium text-muted-foreground select-none dark:border-white/10 dark:bg-white/[0.02]">
          <span className="font-medium text-foreground/85">{nameLabel}</span>
          <div className="flex items-center gap-4">
            <span className="font-medium text-foreground/85">{typeLabel}</span>
            <button
              type="button"
              onClick={toggleAll}
              className="cursor-pointer text-[11px] text-muted-foreground/70 transition-colors select-none hover:text-foreground"
            >
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>
        </div>

        {/* Collapsible API Rows */}
        <div className="flex flex-col">
          {activeItems.map((item) => (
            <ApiItemRow
              key={item.id}
              item={item}
              isOpen={Boolean(openMap[item.id])}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
