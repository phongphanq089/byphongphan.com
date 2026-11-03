import { Copy } from "lucide-react"

export function CopyToClipboardSchematic() {
  return (
    <div className="flex h-32 w-full max-w-[260px] flex-col items-center justify-center gap-2.5 select-none">
      <div className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-500/30 px-3 py-1 font-mono text-[10px] font-semibold text-emerald-600 dark:border-emerald-400/30 dark:text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
        Copied
      </div>
      <div className="flex w-full items-center justify-between rounded-sm border border-black/10 bg-card/80 px-3 py-2 font-mono text-xs text-muted-foreground shadow-xs dark:border-white/10 dark:bg-neutral-900/60">
        <span className="truncate text-[11px] text-foreground/90">
          npm install @pp/hooks
        </span>
        <Copy className="size-3.5 shrink-0 text-muted-foreground" />
      </div>
    </div>
  )
}

export default CopyToClipboardSchematic
