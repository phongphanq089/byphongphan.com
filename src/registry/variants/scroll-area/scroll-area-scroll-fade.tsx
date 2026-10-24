import { ScrollArea } from "@/registry/ui/scroll-area"

const WORDS = [
  "Creativity",
  "Craftsmanship",
  "Engineering",
  "Design Systems",
  "Performance",
  "Accessibility",
  "Typography",
  "Motion & Fluidity",
  "Architecture",
  "Reliability",
  "Clean Code",
  "User Experience",
  "Pixel Perfection",
  "Innovation",
]

export function ScrollAreaScrollFade() {
  return (
    <ScrollArea
      className="h-56 w-full max-w-xs rounded-lg border border-border bg-card p-4"
      scrollFade
      type="hover"
    >
      <div className="space-y-3 py-1">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Core Principles
        </span>
        <div className="space-y-2">
          {WORDS.map((word, idx) => (
            <div
              key={word}
              className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-xs font-medium"
            >
              <span>{word}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                #{String(idx + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

export default ScrollAreaScrollFade
