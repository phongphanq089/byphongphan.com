import { ScrollArea } from "@/registry/ui/scroll-area"

const TAGS = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export function ScrollAreaDemo() {
  return (
    <ScrollArea
      className="h-72 w-52 rounded-md border border-border bg-card p-4 shadow-sm"
      type="hover"
      scrollbarGutter="auto"
    >
      <div className="p-1">
        <h4 className="mb-4 text-sm leading-none font-semibold tracking-tight text-foreground">
          Tags & Releases
        </h4>
        <div className="space-y-1">
          {TAGS.map((tag) => (
            <div
              key={tag}
              className="rounded px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
