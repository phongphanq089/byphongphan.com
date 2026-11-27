import { Skeleton } from "@/shared/ui"

export function PostsLoadingSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading blog posts">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-lg border border-border/60 bg-background/40 p-3"
        >
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-11 w-16 shrink-0 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="hidden h-5 w-20 rounded-full md:block" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}
