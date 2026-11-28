import { Save } from "lucide-react"

import { Button } from "@/shared/ui"

import type { EditorChangeData } from "../type"

interface EditorStatusBarProps {
  stats: EditorChangeData | null
  documentId?: string | number
  onSave?: (data: EditorChangeData | null) => void
}

export function EditorStatusBar({
  stats,
  documentId,
  onSave,
}: EditorStatusBarProps) {
  const text = stats?.text.trim() ?? ""
  const wordCount = text ? text.split(/\s+/).length : 0
  const charCount = stats?.text.length ?? 0

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 bg-muted/20 px-4 py-2 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-3 font-mono tabular-nums">
        <span>{wordCount} words</span>
        <span>·</span>
        <span>{charCount} chars</span>
        {documentId !== undefined && (
          <>
            <span>·</span>
            <span>Doc #{documentId}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden font-mono text-[10px] sm:inline">
          Markdown shortcuts enabled (#, **, -, ```)
        </span>
        {onSave && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 gap-1 px-2 text-[11px]"
            onClick={() => onSave(stats)}
          >
            <Save className="size-3" />
            <span>Save</span>
          </Button>
        )}
      </div>
    </div>
  )
}
