import type { JSX } from "react"

interface BlogContentRendererProps {
  content?: unknown
}

export function BlogContentRenderer({
  content,
}: BlogContentRendererProps): JSX.Element {
  if (!content) {
    return (
      <div className="rounded-lg border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
        Nội dung bài viết đang được cập nhật...
      </div>
    )
  }

  if (typeof content === "string" && content.startsWith("<")) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }

  if (typeof content === "string") {
    return <div className="whitespace-pre-wrap">{content}</div>
  }

  if (typeof content === "object" && content !== null && "root" in content) {
    return <div className="text-sm text-muted-foreground italic"></div>
  }

  return <div>{JSON.stringify(content)}</div>
}
