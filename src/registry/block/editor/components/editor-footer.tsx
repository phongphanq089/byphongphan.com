import {
  Download,
  FileCode,
  FileCode2,
  FileText,
  Keyboard,
  Lock,
  Mic,
  Share2,
  Unlock,
} from "lucide-react"
import * as React from "react"

import { PageSetupContext } from "../core/page-setup/page-setup-context"
import { PageSetupDialog } from "../core/page-setup/page-setup-dialog"
import type { EditorChangeData } from "../types"
import { Button } from "./ui/button"

export interface EditorFooterProps {
  documentId?: string | number
  data: EditorChangeData | null
  readOnly?: boolean
  onToggleReadOnly?: () => void
  onOpenInspector?: () => void
  onExportMarkdown?: () => void
  onExportHtml?: () => void
  onOpenShortcuts?: () => void
  className?: string
}

export function EditorFooter({
  documentId = "15714558",
  data,
  readOnly = false,
  onToggleReadOnly,
  onOpenInspector,
  onExportMarkdown,
  onExportHtml,
  onOpenShortcuts,
  className = "",
}: EditorFooterProps) {
  const [pageSetupDialogOpen, setPageSetupDialogOpen] = React.useState(false)
  const pageSetupCtx = React.useContext(PageSetupContext)

  const characters = data?.text?.length ?? 0
  const words = data?.text?.trim()
    ? data.text.trim().split(/\s+/).filter(Boolean).length
    : 0

  return (
    <div
      className={`flex h-7 items-center justify-between border-t border-border/30 bg-muted/10 px-3 select-none ${className}`}
    >
      {/* Left: Doc ID — barely visible fingerprint */}
      <span className="cursor-default font-mono text-[10px] tracking-tight text-muted-foreground/35 tabular-nums transition-colors hover:text-muted-foreground/60">
        {documentId}
      </span>

      {/* Center: Stats & Page Format */}
      <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/40 tabular-nums">
        <span>
          {characters.toLocaleString()}&thinsp;ch&nbsp;·&nbsp;
          {words.toLocaleString()}&thinsp;w
        </span>

        {pageSetupCtx && (
          <>
            <span className="text-border/60">·</span>
            <button
              type="button"
              onClick={() => setPageSetupDialogOpen(true)}
              className="flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
              title="Click to configure page size and document layout"
            >
              <FileText className="size-2.5 text-primary/70" />
              <span>{pageSetupCtx.pageSetup.size.toUpperCase()}</span>
              <span>·</span>
              <span>
                {pageSetupCtx.pageSetup.orientation === "landscape"
                  ? "Landscape"
                  : "Portrait"}
              </span>
              <span>·</span>
              <span>{Math.round(pageSetupCtx.pageSetup.scale * 100)}%</span>
            </button>
            <PageSetupDialog
              open={pageSetupDialogOpen}
              onOpenChange={setPageSetupDialogOpen}
            />
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-xs"
          className="size-5 text-muted-foreground/35 hover:bg-muted/60 hover:text-muted-foreground"
          title="Voice Dictation"
        >
          <Mic className="size-[10px]" />
        </Button>

        <Button
          variant="ghost"
          size="icon-xs"
          className="size-5 text-muted-foreground/35 hover:bg-muted/60 hover:text-muted-foreground"
          title="Share"
        >
          <Share2 className="size-[10px]" />
        </Button>

        {onExportHtml && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onExportHtml}
            className="size-5 text-muted-foreground/35 hover:bg-muted/60 hover:text-muted-foreground"
            title="Export Standalone HTML (Tailwind CSS CDN)"
          >
            <FileCode className="size-[10px]" />
          </Button>
        )}

        {onExportMarkdown && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onExportMarkdown}
            className="size-5 text-muted-foreground/35 hover:bg-muted/60 hover:text-muted-foreground"
            title="Export Markdown"
          >
            <Download className="size-[10px]" />
          </Button>
        )}

        {onOpenShortcuts && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onOpenShortcuts}
            className="size-5 text-muted-foreground/35 hover:bg-muted/60 hover:text-muted-foreground"
            title="Keyboard shortcuts (Ctrl + /)"
          >
            <Keyboard className="size-[10px]" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onOpenInspector}
          className="size-5 text-muted-foreground/35 hover:bg-primary/8 hover:text-primary"
          title="Open Inspector"
        >
          <FileCode2 className="size-[10px]" />
        </Button>

        {/* Lock toggle — status indicator: amber when locked */}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onToggleReadOnly}
          className={`size-5 transition-colors ${
            readOnly
              ? "text-amber-400 hover:bg-amber-500/8"
              : "text-muted-foreground/35 hover:bg-muted/60 hover:text-muted-foreground"
          }`}
          title={
            readOnly ? "Locked — click to unlock" : "Editable — click to lock"
          }
        >
          {readOnly ? (
            <Lock className="size-[10px]" />
          ) : (
            <Unlock className="size-[10px]" />
          )}
        </Button>
      </div>
    </div>
  )
}
