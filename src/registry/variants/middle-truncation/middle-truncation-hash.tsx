import { MiddleTruncation } from "@/registry/ui/middle-truncation"

export function MiddleTruncationHash() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
      <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Ethereum Wallet
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2 font-mono text-sm text-foreground">
        <MiddleTruncation minEnd={6} ellipsis="···">
          0x71C6633279268a2F7c09361730a8435d8eFEb947
        </MiddleTruncation>
      </div>
    </div>
  )
}

export default MiddleTruncationHash
