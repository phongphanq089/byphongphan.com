import { CheckSquare, Download, RotateCcw, Square, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"

import { useSelection } from "@/registry/hooks/use-selection"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

interface Invoice {
  id: string
  invoiceNumber: string
  client: string
  amount: string
  status: "paid" | "pending" | "draft"
  date: string
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-001",
    client: "Acme Corporation",
    amount: "$2,450.00",
    status: "paid",
    date: "2024-10-12",
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2024-002",
    client: "Starlight Digital",
    amount: "$1,120.00",
    status: "pending",
    date: "2024-10-15",
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2024-003",
    client: "Vanguard Studio",
    amount: "$4,890.00",
    status: "paid",
    date: "2024-10-19",
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2024-004",
    client: "Nexus Technologies",
    amount: "$850.00",
    status: "draft",
    date: "2024-10-22",
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2024-005",
    client: "Horizon Creative",
    amount: "$3,640.00",
    status: "pending",
    date: "2024-10-25",
  },
]

export function UseSelectionDemo() {
  const [invoices] = useState<Invoice[]>(INITIAL_INVOICES)

  const {
    selectedKeys,
    selectedItems,
    selectedCount,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    toggle,
    selectAll,
    clear,
    toggleAll,
  } = useSelection<Invoice>(invoices, {
    getKey: (item) => item.id,
    initialSelected: ["inv-001", "inv-003"],
  })

  const totalAmountSelected = useMemo(() => {
    return selectedItems.reduce((acc, curr) => {
      const num = parseFloat(curr.amount.replace(/[^0-9.-]+/g, "")) || 0
      return acc + num
    }, 0)
  }, [selectedItems])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val)
  }

  const getStatusBadgeVariant = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "draft":
        return "outline"
    }
  }

  return (
    <div className="w-full min-w-0 p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {/* Toolbar & Action Header */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Badge
              variant={selectedCount > 0 ? "default" : "secondary"}
              className="font-mono text-xs"
            >
              {selectedCount} of {invoices.length} selected
            </Badge>

            {selectedCount > 0 && (
              <span className="text-xs font-medium text-muted-foreground">
                Total:{" "}
                <span className="font-mono font-semibold text-foreground">
                  {formatCurrency(totalAmountSelected)}
                </span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedCount > 0 ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 text-xs"
                  onClick={() => alert(`Exported ${selectedCount} invoices`)}
                >
                  <Download className="size-3" />
                  Export
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={clear}
                >
                  <RotateCcw className="size-3" />
                  Clear
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={selectAll}
              >
                <CheckSquare className="size-3 text-primary" />
                Select All
              </Button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 px-3">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isPartiallySelected}
                      onCheckedChange={() => toggleAll()}
                      aria-label="Select all rows"
                    />
                  </div>
                </TableHead>
                <TableHead className="text-xs font-semibold">Invoice</TableHead>
                <TableHead className="text-xs font-semibold">Client</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="pr-4 text-right text-xs font-semibold">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {invoices.map((invoice) => {
                const checked = isSelected(invoice.id)
                return (
                  <TableRow
                    key={invoice.id}
                    data-state={checked ? "selected" : undefined}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggle(invoice.id)}
                  >
                    <TableCell
                      className="w-10 px-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggle(invoice.id)}
                          aria-label={`Select invoice ${invoice.invoiceNumber}`}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-xs font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>

                    <TableCell className="text-xs font-medium text-foreground">
                      <div className="flex flex-col">
                        <span>{invoice.client}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {invoice.date}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(invoice.status)}
                        className="text-[10px] capitalize"
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="pr-4 text-right font-mono text-xs font-semibold">
                      {invoice.amount}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default UseSelectionDemo
