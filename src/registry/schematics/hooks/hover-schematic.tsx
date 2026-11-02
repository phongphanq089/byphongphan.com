import { MousePointer } from "lucide-react"

export function HoverSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center overflow-hidden rounded-xl select-none">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--pp-primary) 1px, transparent 1px), linear-gradient(90deg, var(--pp-primary) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Hover target */}
      <div className="relative">
        <div className="absolute -inset-2 rounded-xl border border-dashed border-primary/20" />

        <div className="relative flex items-center gap-3 rounded-lg border border-primary/40 bg-primary/[0.06] px-4 py-3.5">
          {/* Interactive element */}
          <div className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
            <div className="size-2.5 rounded-full bg-primary" />
          </div>

          {/* Content placeholder */}
          <div className="flex flex-col gap-1.5">
            <div className="h-2 w-16 rounded-full bg-primary/50" />
            <div className="h-1.5 w-10 rounded-full bg-muted-foreground/20" />
          </div>

          {/* Hover state */}
          <div className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border border-primary/30 bg-background">
            <div className="size-1.5 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      {/* Cursor */}
      <div className="absolute right-[22%] bottom-[18%]">
        <MousePointer
          className="size-5 rotate-[-15deg] fill-primary/20 text-primary"
          strokeWidth={1.8}
        />
      </div>

      {/* Interaction point */}
      <div className="absolute right-[25%] bottom-[24%] size-7 rounded-full border border-primary/20" />
    </div>
  )
}

export default HoverSchematic
