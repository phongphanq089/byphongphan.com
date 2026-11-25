import { Badge } from "@/registry/ui/badge"

export function BadgeShapes() {
  return (
    <div className="flex w-full max-w-full flex-col items-center justify-center gap-8 p-6 sm:p-10">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          Geometry & Contour Profiles
        </span>
        <p className="text-xs text-muted-foreground">
          Pill for friendly tags, Rounded for Linear-style developer UI, Square
          for technical specs.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="w-16 text-right font-mono text-xs text-muted-foreground">
            Pill:
          </span>
          <Badge shape="pill" variant="secondary">
            TypeScript
          </Badge>
          <Badge shape="pill" variant="outline">
            React 19
          </Badge>
          <Badge shape="pill" variant="default">
            v3.2
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-16 text-right font-mono text-xs text-muted-foreground">
            Rounded:
          </span>
          <Badge shape="rounded" variant="secondary">
            TypeScript
          </Badge>
          <Badge shape="rounded" variant="outline">
            React 19
          </Badge>
          <Badge shape="rounded" variant="default">
            v3.2
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-16 text-right font-mono text-xs text-muted-foreground">
            Square:
          </span>
          <Badge shape="square" variant="secondary">
            TypeScript
          </Badge>
          <Badge shape="square" variant="outline">
            React 19
          </Badge>
          <Badge shape="square" variant="default">
            v3.2
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default BadgeShapes
