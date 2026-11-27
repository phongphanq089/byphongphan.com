import { LayoutGrid, List } from "lucide-react"

import { Button } from "@/shared/ui"

export type AdminViewMode = "table" | "grid"

interface AdminViewModeToggleProps {
  value: AdminViewMode
  onChange: (mode: AdminViewMode) => void
}

export function AdminViewModeToggle({
  value,
  onChange,
}: AdminViewModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="View layout"
      className="inline-flex h-8 items-center rounded-lg border border-border/80 bg-muted/30 p-0.5"
    >
      <Button
        type="button"
        variant={value === "table" ? "secondary" : "ghost"}
        size="icon-xs"
        onClick={() => onChange("table")}
        aria-label="Table view"
        aria-pressed={value === "table"}
        className="h-6.5 w-7 rounded-md"
      >
        <List className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={value === "grid" ? "secondary" : "ghost"}
        size="icon-xs"
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        aria-pressed={value === "grid"}
        className="h-6.5 w-7 rounded-md"
      >
        <LayoutGrid className="size-3.5" />
      </Button>
    </div>
  )
}
