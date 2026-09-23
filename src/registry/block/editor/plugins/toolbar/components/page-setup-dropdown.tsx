import {
  Check,
  ChevronDown,
  FileText,
  LayoutTemplate,
  MoveHorizontal,
  MoveVertical,
  Printer,
  Settings2,
  ZoomIn,
} from "lucide-react"
import * as React from "react"

import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { usePageSetup } from "../../../core/page-setup/page-setup-context"
import { PageSetupDialog } from "../../../core/page-setup/page-setup-dialog"
import type { PageSizePreset } from "../../../core/page-setup/types"
import { PAGE_SIZE_DIMENSIONS } from "../../../core/page-setup/types"

export function PageSetupDropdown({
  disabled = false,
}: {
  disabled?: boolean
}) {
  const {
    pageSetup,
    setSize,
    setOrientation,
    setMargins,
    setLayoutMode,
    setScale,
  } = usePageSetup()

  const [dialogOpen, setDialogOpen] = React.useState(false)

  const activeDim = PAGE_SIZE_DIMENSIONS[pageSetup.size]
  const isLandscape = pageSetup.orientation === "landscape"
  const isPaged = pageSetup.layoutMode === "paged"

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="h-8 gap-1.5 px-2 text-xs font-normal hover:bg-muted"
            title="Page Size & Document Setup"
          >
            <FileText className="h-4 w-4 text-primary" />
            <span className="hidden font-medium sm:inline">
              {activeDim.name}
            </span>
            <span className="hidden text-[10px] text-muted-foreground md:inline">
              · {isLandscape ? "Landscape" : "Portrait"}
            </span>
            <ChevronDown className="ml-0.5 h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56">
          <div className="px-2 py-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Paper Format
          </div>

          {(
            ["a4", "letter", "legal", "a5", "a3", "fluid"] as PageSizePreset[]
          ).map((sizeKey) => {
            const dim = PAGE_SIZE_DIMENSIONS[sizeKey]
            const isSelected = pageSetup.size === sizeKey
            return (
              <DropdownMenuItem
                key={sizeKey}
                onClick={() => setSize(sizeKey)}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{dim.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {dim.widthMm
                      ? `${dim.widthMm} × ${dim.heightMm} mm`
                      : "Fluid Width"}
                  </span>
                </div>
                {isSelected && <Check className="size-3.5 text-primary" />}
              </DropdownMenuItem>
            )
          })}

          <DropdownMenuSeparator />

          {/* Orientation Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-xs">
              <span className="flex items-center gap-2">
                {isLandscape ? (
                  <MoveHorizontal className="size-3.5 text-muted-foreground" />
                ) : (
                  <MoveVertical className="size-3.5 text-muted-foreground" />
                )}
                Orientation
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40">
              <DropdownMenuItem
                onClick={() => setOrientation("portrait")}
                className="flex items-center justify-between text-xs"
              >
                <span>↕ Portrait (Dọc)</span>
                {!isLandscape && <Check className="size-3.5 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOrientation("landscape")}
                className="flex items-center justify-between text-xs"
              >
                <span>↔ Landscape (Ngang)</span>
                {isLandscape && <Check className="size-3.5 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Margins Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-xs">
              <span className="flex items-center gap-2">
                <LayoutTemplate className="size-3.5 text-muted-foreground" />
                Margins
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuItem
                onClick={() => setMargins("normal")}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex flex-col">
                  <span>Normal</span>
                  <span className="text-[10px] text-muted-foreground">
                    25.4 mm (1 in)
                  </span>
                </div>
                {pageSetup.margins === "normal" && (
                  <Check className="size-3.5 text-primary" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setMargins("narrow")}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex flex-col">
                  <span>Narrow</span>
                  <span className="text-[10px] text-muted-foreground">
                    12.7 mm (0.5 in)
                  </span>
                </div>
                {pageSetup.margins === "narrow" && (
                  <Check className="size-3.5 text-primary" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setMargins("wide")}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex flex-col">
                  <span>Wide</span>
                  <span className="text-[10px] text-muted-foreground">
                    38.1 mm (1.5 in)
                  </span>
                </div>
                {pageSetup.margins === "wide" && (
                  <Check className="size-3.5 text-primary" />
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Layout Mode Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-xs">
              <span className="flex items-center gap-2">
                <FileText className="size-3.5 text-muted-foreground" />
                Document Layout
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-44">
              <DropdownMenuItem
                onClick={() => setLayoutMode("paged")}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-medium">📄 Paged Document</span>
                  <span className="text-[10px] text-muted-foreground">
                    Print sheet visual
                  </span>
                </div>
                {isPaged && <Check className="size-3.5 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLayoutMode("continuous")}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-medium">📜 Continuous Scroll</span>
                  <span className="text-[10px] text-muted-foreground">
                    Notion canvas style
                  </span>
                </div>
                {!isPaged && <Check className="size-3.5 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Zoom Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-xs">
              <span className="flex items-center gap-2">
                <ZoomIn className="size-3.5 text-muted-foreground" />
                Zoom ({Math.round(pageSetup.scale * 100)}%)
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-36">
              {[0.5, 0.75, 0.9, 1.0, 1.25, 1.5].map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => setScale(s)}
                  className="flex items-center justify-between text-xs"
                >
                  <span>{Math.round(s * 100)}%</span>
                  {pageSetup.scale === s && (
                    <Check className="size-3.5 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Page Setup Full Dialog */}
          <DropdownMenuItem
            onClick={() => setDialogOpen(true)}
            className="text-xs"
          >
            <Settings2 className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>More Options & Custom mm...</span>
          </DropdownMenuItem>

          {/* Print / PDF Export */}
          <DropdownMenuItem onClick={handlePrint} className="text-xs">
            <Printer className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Print / PDF Export (Ctrl+P)</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Full Modal Dialog */}
      <PageSetupDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
