import { FileCode2 } from "lucide-react"

import { AdminContentCard } from "@/admin"
import { Badge } from "@/shared/ui"

interface PostEditorContentFrameProps {
  content: Record<string, unknown>
}

export function PostEditorContentFrame({
  content,
}: PostEditorContentFrameProps) {
  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <FileCode2 className="size-4 text-muted-foreground" />
          <span>Content Editor</span>
        </span>
      }
      description="Rich-text / JSON AST workspace (editor package pending selection)"
      actions={
        <Badge variant="subtle" size="xs" shape="rounded" className="font-mono">
          posts.content (jsonb)
        </Badge>
      }
      variant="default"
      minHeight="min-h-[420px]"
      padding="default"
      className="flex-1"
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-background/40">
        {/* Toolbar Frame Slot */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
          <span>
            Editor Toolbar Slot · Headings · Formatting · Code Block · Image ·
            Link
          </span>
          <span className="font-mono text-[11px]">Placeholder</span>
        </div>

        {/* Editor Canvas Frame Slot */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 text-muted-foreground/70">
            <FileCode2 className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Content Editor Frame
            </p>
            <p className="max-w-md text-xs text-muted-foreground">
              Rich-text editor is kept as a structural frame until a final
              editor library is selected.
            </p>
          </div>

          <details className="w-full max-w-xl text-left">
            <summary className="cursor-pointer text-center font-mono text-[11px] text-muted-foreground hover:text-foreground">
              Inspect current JSON AST payload
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg border border-border/70 bg-muted/35 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {JSON.stringify(content, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </AdminContentCard>
  )
}
