import { FileDown, LayoutList, Save, Share2, Trash2 } from "lucide-react"

export interface FloatingActionDockProps {
  onSave?: () => void
  onShare?: () => void
  onExport?: () => void
  onOpenSidebar?: () => void
  onClear?: () => void
  className?: string
}

// Each action button in the side dock — precision tool, not a playground
function DockBtn({
  onClick,
  title,
  children,
  danger = false,
  accent = false,
}: {
  onClick?: () => void
  title: string
  children: React.ReactNode
  danger?: boolean
  accent?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex size-8 items-center justify-center transition-colors duration-100 ${
        danger
          ? "text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive"
          : accent
            ? "text-primary/70 hover:bg-primary/10 hover:text-primary"
            : "text-muted-foreground/40 hover:bg-muted/60 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

export function FloatingActionDock({
  onSave,
  onShare,
  onExport,
  onOpenSidebar,
  onClear,
  className = "",
}: FloatingActionDockProps) {
  return (
    <div
      className={`editor-float-panel absolute top-1/2 right-0 z-20 flex -translate-y-1/2 flex-col divide-y divide-border/30 overflow-hidden rounded-l-xl ${className}`}
    >
      {/* 1. Open Sidebar Tool Palette */}
      {onOpenSidebar && (
        <DockBtn
          onClick={onOpenSidebar}
          title="Open Tool Palette (Drag & Drop Blocks)"
          accent
        >
          <LayoutList className="size-3.5" />
        </DockBtn>
      )}

      {/* 2. Quick Save */}
      <DockBtn onClick={onSave} title="Save">
        <Save className="size-3.5" />
      </DockBtn>

      {/* 3. Share */}
      <DockBtn onClick={onShare} title="Share">
        <Share2 className="size-3.5" />
      </DockBtn>

      {/* 4. Export / Inspect Output */}
      <DockBtn onClick={onExport} title="Export / Inspect">
        <FileDown className="size-3.5" />
      </DockBtn>

      {/* 5. Clear Content */}
      <DockBtn onClick={onClear} title="Clear content" danger>
        <Trash2 className="size-3.5" />
      </DockBtn>
    </div>
  )
}
