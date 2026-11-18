import { useState } from "react"

import { TypingText } from "@/registry/animated/typing-text"

export function TypingTextDemo() {
  const [deleteMode, setDeleteMode] = useState<"backspace" | "select">("select")
  const [typos, setTypos] = useState(true)

  const SEQUENCES = [
    { text: "Creative Developer", deleteAfter: true },
    { text: "Design Systems Engineer", deleteAfter: true },
    { text: "Micro-interactions Craft", deleteAfter: true },
    { text: "High Performance Web", deleteAfter: true },
  ]

  return (
    <div className="flex flex-col items-center justify-center gap-10 p-6 text-center sm:p-12">
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Realistic Human Typewriter
        </span>
        <div className="flex min-h-[80px] items-center justify-center">
          <TypingText
            sequences={SEQUENCES}
            typingSpeed={55}
            deleteSpeed={35}
            deleteMode={deleteMode}
            typos={typos}
            className="text-foreground"
            textClassName="text-3xl sm:text-5xl font-black text-primary"
          />
        </div>
        <p className="max-w-md text-xs text-muted-foreground">
          Features organic typing variance, natural QWERTY typo correction, and
          selection sweep erasure.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-xl border border-border/80 bg-background/80 p-3 text-xs shadow-xs backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Erase Mode:</span>
          <button
            type="button"
            onClick={() => setDeleteMode("select")}
            className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
              deleteMode === "select"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Select Sweep
          </button>
          <button
            type="button"
            onClick={() => setDeleteMode("backspace")}
            className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
              deleteMode === "backspace"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Backspace
          </button>
        </div>

        <span className="h-4 w-px bg-border/60" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Human Typos:</span>
          <button
            type="button"
            onClick={() => setTypos((prev) => !prev)}
            className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
              typos
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {typos ? "Enabled (4%)" : "Disabled"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TypingTextDemo
