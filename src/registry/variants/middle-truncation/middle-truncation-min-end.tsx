import { MiddleTruncation } from "@/registry/ui/middle-truncation"

export function MiddleTruncationMinEnd() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
      <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Balanced Split (minEnd=12)
      </div>
      <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 font-mono text-sm text-foreground">
        <MiddleTruncation minEnd={12}>
          src/features/authentication/providers/oauth-google-provider-v2.tsx
        </MiddleTruncation>
      </div>
    </div>
  )
}

export default MiddleTruncationMinEnd
