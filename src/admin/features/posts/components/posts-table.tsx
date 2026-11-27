import type { ReactTable } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui"

import type { postsTableFeatures } from "../table-config"
import type { AdminPost } from "../types"

interface PostsTableProps {
  table: ReactTable<typeof postsTableFeatures, AdminPost>
}

export function PostsTable({ table }: PostsTableProps) {
  const rows = table.getRowModel().rows

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border/70 bg-background/40">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-border/70 bg-muted/40 hover:bg-muted/40"
            >
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | {
                      headerClassName?: string
                      align?: "left" | "center" | "right"
                    }
                  | undefined
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                const toggleSort = header.column.getToggleSortingHandler()

                return (
                  <TableHead
                    key={header.id}
                    scope="col"
                    className={cn(
                      "h-auto px-3 py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase [&:has([role=checkbox])]:pr-3",
                      meta?.headerClassName
                    )}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={toggleSort}
                        className={cn(
                          "inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none",
                          meta?.align === "center" && "mx-auto",
                          sorted && "text-foreground"
                        )}
                      >
                        <table.FlexRender header={header} />
                        {sorted === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : sorted === "desc" ? (
                          <ArrowDown className="size-3" />
                        ) : (
                          <ArrowUpDown className="size-3 opacity-45" />
                        )}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="[&_tr]:border-border/60">
          {rows.map((row) => {
            const isSelected = row.getIsSelected()

            return (
              <TableRow
                key={row.id}
                data-state={isSelected ? "selected" : undefined}
                className={cn(
                  "group/row hover:bg-muted/30",
                  isSelected &&
                    "data-[state=selected]:bg-primary/[0.04] data-[state=selected]:hover:bg-primary/[0.06]"
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as
                    { cellClassName?: string } | undefined

                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-3 py-3 align-top whitespace-normal [&:has([role=checkbox])]:pr-3",
                        meta?.cellClassName
                      )}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
