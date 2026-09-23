import {
  BadgeCheck,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react"

import { cn } from "@/shared/lib"
import { Badge } from "@/shared/ui/core/badge"
import { Button } from "@/shared/ui/core/button"

export interface SocialReply {
  authorName: string
  authorHandle: string
  authorImage: string
  content: string
  isVerified?: boolean
  timestamp: string
}

export interface CardGradientGlassPostProps {
  authorName?: string
  authorHandle?: string
  authorImage?: string
  content?: string[]
  isVerified?: boolean
  timestamp?: string
  reply?: SocialReply
  className?: string
}

export function CardGradientGlassPost({
  authorName = "Phong Phan",
  authorHandle = "byphongphan",
  authorImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
  content = [
    "Just shipped the new Glass Gradient Card variant! 🚀",
    "• Double-shell frosted backdrop blur",
    "• Ambient hover gradient sheen",
    "• Zero layout shift on mobile screens",
  ],
  isVerified = true,
  timestamp = "Just now",
  reply = {
    authorName: "shadcn",
    authorHandle: "shadcn",
    authorImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
    content: "Clean craft. Love the subtle depth transitions.",
    isVerified: true,
    timestamp: "1m ago",
  },
  className,
}: CardGradientGlassPostProps) {
  return (
    <div
      className={cn(
        "relative isolate w-full max-w-lg overflow-hidden rounded-2xl p-1.5 select-none",
        "bg-white/5 dark:bg-black/80",
        "bg-gradient-to-br from-black/5 to-black/[0.02] dark:from-white/10 dark:to-white/[0.02]",
        "backdrop-blur-xl backdrop-saturate-[180%]",
        "border border-black/10 dark:border-white/10",
        "shadow-[0_12px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      <div
        className={cn(
          "relative w-full rounded-xl p-5",
          "bg-gradient-to-br from-black/[0.03] to-transparent dark:from-white/[0.06] dark:to-transparent",
          "backdrop-blur-md",
          "border border-black/[0.05] dark:border-white/[0.08]",
          "text-foreground",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl",
          "before:bg-gradient-to-br before:from-primary/[0.04] before:to-transparent before:opacity-0 before:transition-opacity",
          "hover:before:opacity-100"
        )}
      >
        {/* Author Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative size-10 overflow-hidden rounded-full ring-2 ring-primary/20">
              <img
                src={authorImage}
                alt={authorName}
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  {authorName}
                </span>
                {isVerified && (
                  <BadgeCheck className="size-4 fill-sky-500 text-background" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                @{authorHandle}
              </span>
            </div>
          </div>

          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 font-mono text-[10px] text-primary"
          >
            Update
          </Badge>
        </div>

        {/* Content Body */}
        <div className="mt-3.5 space-y-1.5 text-sm leading-relaxed text-foreground/90">
          {content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <span className="mt-2 block font-mono text-[11px] text-muted-foreground">
            {timestamp}
          </span>
        </div>

        {/* Nested Thread Reply */}
        {reply && (
          <div className="mt-4 rounded-lg border border-border/40 bg-foreground/[0.02] p-3 backdrop-blur-xs">
            <div className="flex items-start gap-2.5">
              <div className="size-7 overflow-hidden rounded-full ring-1 ring-border">
                <img
                  src={reply.authorImage}
                  alt={reply.authorName}
                  className="size-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {reply.authorName}
                  </span>
                  {reply.isVerified && (
                    <BadgeCheck className="size-3.5 shrink-0 fill-sky-500 text-background" />
                  )}
                  <span className="truncate text-[11px] text-muted-foreground">
                    @{reply.authorHandle}
                  </span>
                  <span className="text-[11px] text-muted-foreground">·</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {reply.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-foreground/80">
                  {reply.content}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2 text-xs hover:text-foreground"
          >
            <MessageCircle className="size-3.5" />
            <span>24</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2 text-xs hover:text-emerald-500"
          >
            <Repeat2 className="size-3.5" />
            <span>12</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2 text-xs hover:text-rose-500"
          >
            <Heart className="size-3.5" />
            <span>189</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2 text-xs hover:text-amber-500"
          >
            <Bookmark className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs hover:text-foreground"
          >
            <Share className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CardGradientGlassPost
