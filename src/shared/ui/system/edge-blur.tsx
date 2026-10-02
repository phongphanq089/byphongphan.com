import { cn } from "@/shared/lib"

interface EdgeBlurProps {
  position?: "top" | "bottom"
  height?: number
  className?: string
}

export function EdgeBlur({
  position = "bottom",
  height = 75,
  className,
}: EdgeBlurProps) {
  const isTop = position === "top"

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 isolate z-40 transition-opacity",
        isTop ? "top-0" : "bottom-0",
        className
      )}
      style={{ height }}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-0",
          isTop
            ? "bg-gradient-to-b from-background via-background/70 to-transparent"
            : "bg-gradient-to-t from-background via-background/70 to-transparent"
        )}
      />
    </div>
  )
}

// Convenience exports for specific positions
export function TopBlur({ height = 75 }: { height?: number }) {
  return <EdgeBlur position="top" height={height} />
}

export function BottomBlur({ height = 75 }: { height?: number }) {
  return <EdgeBlur position="bottom" height={height} />
}
