import { FileCode2 } from "lucide-react"
import { useMemo } from "react"

import { AdminContentCard } from "@/admin"
import { Editor } from "@/admin/editor"
import { Badge } from "@/shared/ui"

interface PostEditorContentFrameProps {
  content: Record<string, unknown>
  onContentChange?: (content: Record<string, unknown>) => void
}

export function PostEditorContentFrame({
  content,
  onContentChange,
}: PostEditorContentFrameProps) {
  const initialJson = useMemo(() => JSON.stringify(content), [content])

  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <FileCode2 className="size-4 text-muted-foreground" />
          <span>Content Editor</span>
        </span>
      }
      description="Lexical rich-text editor outputting serialized JSON AST & Markdown"
      actions={
        <Badge variant="subtle" size="xs" shape="rounded" className="font-mono">
          posts.content (jsonb)
        </Badge>
      }
      variant="default"
      minHeight="min-h-[480px]"
      padding="default"
      className="flex-1"
    >
      <div className="flex flex-1 flex-col gap-3">
        <Editor
          variant="default"
          defaultValue={initialJson}
          minHeight={320}
          onChange={(data) => onContentChange?.(data.state)}
        />

        <details className="w-full text-left">
          <summary className="cursor-pointer font-mono text-[11px] text-muted-foreground hover:text-foreground">
            Inspect current JSON AST payload
          </summary>
          <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-border/70 bg-muted/35 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {JSON.stringify(content, null, 2)}
          </pre>
        </details>
      </div>
    </AdminContentCard>
  )
}
