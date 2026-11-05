import { cn } from "@/shared/lib/utils"
import { Scales } from "@/shared/ui/system/scales"

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className="container-wrapper">
      <div
        className={cn(
          "relative z-10 container flex min-h-screen flex-1 flex-col overflow-hidden",
          className
        )}
      >
        <div className="absolute -inset-y-[30%] left-0 h-[160%] w-3 mask-t-from-90% mask-b-from-90% md:w-8">
          <Scales size={8} className="rounded-lg" />
        </div>
        <div className="absolute -inset-y-[30%] right-0 h-[160%] w-3 mask-t-from-90% mask-b-from-90% md:w-8">
          <Scales size={8} className="rounded-lg" />
        </div>
        {children}
      </div>
    </div>
  )
}
