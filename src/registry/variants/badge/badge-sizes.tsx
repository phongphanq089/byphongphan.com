import { Badge, BadgeDot } from "@/registry/ui/badge"

export function BadgeSizes() {
  return (
    <div className="flex w-full max-w-full flex-col items-center justify-center gap-8 p-6 sm:p-10">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          Micro to Macro Proportions
        </span>
        <p className="text-xs text-muted-foreground">
          Calibrated vertical heights from 18px (xs) to 28px (lg) for dense data
          tables to prominent hero tags.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge size="xs" variant="outline">
          <BadgeDot pulse />
          XS (18px)
        </Badge>
        <Badge size="sm" variant="outline">
          <BadgeDot pulse />
          SM (20px)
        </Badge>
        <Badge size="default" variant="outline">
          <BadgeDot pulse />
          Default (24px)
        </Badge>
        <Badge size="lg" variant="outline">
          <BadgeDot pulse />
          LG (28px)
        </Badge>
      </div>
    </div>
  )
}

export default BadgeSizes
