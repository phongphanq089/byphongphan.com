import { FileText } from "lucide-react"

export function EditorSchematic() {
  return (
    <div className="flex w-full max-w-[290px] flex-col items-center gap-1.5">
      {/* Header */}
      <div className="flex items-center gap-1.5 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <FileText className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>LEXICAL • RICH TEXT EDITOR</span>
      </div>

      <div className="flex w-full flex-col overflow-hidden rounded-md border border-zinc-900/10 bg-zinc-900/[0.03] shadow-inner dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-zinc-900/10 bg-zinc-900/[0.04] px-2 py-1 dark:border-white/5 dark:bg-white/[0.04]">
          <div className="flex items-center gap-1.5 text-[8px]">
            <span className="font-serif font-bold text-zinc-900/80 dark:text-white/80">
              B
            </span>
            <span className="font-serif text-zinc-900/60 italic dark:text-white/60">
              I
            </span>
            <span className="text-zinc-900/50 line-through dark:text-white/50">
              S
            </span>
            <span className="font-mono text-[7px] text-zinc-900/40 dark:text-white/40">
              &lt;/&gt;
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-1 rounded-full bg-zinc-900/40 dark:bg-white/40" />
            <div className="h-1.5 w-4 rounded-xs bg-zinc-900/20 dark:bg-white/20" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 p-4">
          {/* Title Bar */}
          <div className="h-2 w-3/4 rounded-xs bg-zinc-900/85 shadow-[0_0_6px_rgba(0,0,0,0.15)] dark:bg-white/85 dark:shadow-[0_0_6px_rgba(255,255,255,0.2)]" />
          {/* Text lines */}
          <div className="h-1 w-full rounded-xs bg-zinc-900/40 dark:bg-white/40" />
          <div className="h-1 w-5/6 rounded-xs bg-zinc-900/30 dark:bg-white/30" />
          {/* Quote / callout line */}
          <div className="flex items-center gap-1.5 border-l-2 border-zinc-900/50 py-0.5 pl-1.5 dark:border-white/50">
            <div className="h-1 w-2/3 rounded-xs bg-zinc-900/50 dark:bg-white/50" />
          </div>
        </div>
      </div>
    </div>
  )
}
