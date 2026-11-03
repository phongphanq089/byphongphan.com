import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

export function StateHistorySchematic() {
  const snapshots = [0, 1, 2, 3, 4]

  return (
    <div className="relative flex h-32 w-full max-w-[240px] flex-col justify-center gap-3 overflow-hidden rounded-xl px-3 select-none">
      {/* Current state */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">Current state</span>

        <div className="flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/[0.06] px-2 py-1">
          <RotateCcw className="size-3 text-primary" />

          <span className="font-mono text-[9px] text-primary">3</span>
        </div>
      </div>

      {/* History timeline */}
      <div className="flex items-center justify-between gap-1">
        {snapshots.map((snapshot, index) => (
          <div key={snapshot} className="flex items-center">
            <div
              className={[
                "flex size-7 items-center justify-center rounded-md border font-mono text-[10px]",
                index === 3
                  ? "border-primary bg-primary text-primary-foreground"
                  : index < 3
                    ? "border-primary/20 bg-primary/[0.05] text-primary"
                    : "border-border bg-muted/30 text-muted-foreground",
              ].join(" ")}
            >
              {snapshot}
            </div>

            {index < snapshots.length - 1 && (
              <div className="h-px w-2 bg-border" />
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ArrowLeft className="size-3 text-muted-foreground" />

          <span className="text-[9px] text-muted-foreground">Undo</span>
        </div>

        <span className="font-mono text-[9px] text-primary">pointer: 3</span>

        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-muted-foreground">Redo</span>

          <ArrowRight className="size-3 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

export default StateHistorySchematic
