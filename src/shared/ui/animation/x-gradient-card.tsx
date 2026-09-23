import { BadgeCheck } from "lucide-react"

import { cn } from "@/shared/lib"

export interface ReplyProps {
  authorName: string
  authorHandle: string
  authorImage: string
  content: string
  isVerified?: boolean
  timestamp: string
}

export interface XCardProps {
  link?: string
  authorName?: string
  authorHandle?: string
  authorImage?: string
  content?: string[]
  isVerified?: boolean
  timestamp?: string
  reply?: ReplyProps
  className?: string
}

export function XCard({
  link = "https://x.com/dorian_baffier/status/1880291036410572934",
  authorName = "Dorian",
  authorHandle = "dorian_baffier",
  authorImage = "https://pbs.twimg.com/profile_images/1854916060807675904/KtBJsyWr_400x400.jpg",
  content = [
    "All components from KokonutUI can now be open in @v0 🎉",
    "1. Click on 'Open in V0'",
    "2. Customize with prompts",
    "3. Deploy to your app",
  ],
  isVerified = true,
  timestamp = "Jan 18, 2025",
  reply = {
    authorName: "shadcn",
    authorHandle: "shadcn",
    authorImage:
      "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    content: "Awesome.",
    isVerified: true,
    timestamp: "Jan 18",
  },
  className,
}: XCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <div
        className={cn(
          "relative isolate w-full max-w-xl overflow-hidden rounded-2xl p-1.5",
          "bg-white/5 dark:bg-black/90",
          "bg-gradient-to-br from-black/5 to-black/[0.02] dark:from-white/5 dark:to-white/[0.02]",
          "backdrop-blur-xl backdrop-saturate-[180%]",
          "border border-black/10 dark:border-white/10",
          "shadow-[0_8px_16px_rgb(0_0_0_/_0.15)] dark:shadow-[0_8px_16px_rgb(0_0_0_/_0.25)]",
          "translate-z-0 will-change-transform",
          className
        )}
      >
        <div
          className={cn(
            "relative w-full rounded-xl p-5",
            "bg-gradient-to-br from-black/[0.05] to-transparent dark:from-white/[0.08] dark:to-transparent",
            "backdrop-blur-md backdrop-saturate-150",
            "border border-black/[0.05] dark:border-white/[0.08]",
            "text-foreground",
            "shadow-sm",
            "translate-z-0 will-change-transform",
            "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/[0.02] before:to-black/[0.01] before:opacity-0 before:transition-opacity dark:before:from-white/[0.03] dark:before:to-white/[0.01]",
            "hover:before:opacity-100"
          )}
        >
          <div className="flex gap-3">
            <div className="shrink-0">
              <div className="size-10 overflow-hidden rounded-full">
                <img
                  src={authorImage}
                  alt={authorName}
                  className="size-full object-cover"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="cursor-pointer font-semibold text-foreground hover:underline">
                      {authorName}
                    </span>
                    {isVerified && (
                      <BadgeCheck className="size-4 fill-sky-500 text-background" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    @{authorHandle}
                  </span>
                </div>
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-lg p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1200"
                    height="1227"
                    fill="none"
                    viewBox="0 0 1200 1227"
                    className="size-4"
                  >
                    <title>X</title>
                    <path
                      fill="currentColor"
                      d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2">
            {content.map((item, index) => (
              <p key={index} className="text-base text-foreground/90">
                {item}
              </p>
            ))}
            <span className="mt-2 block text-sm text-muted-foreground">
              {timestamp}
            </span>
          </div>

          {reply && (
            <div className="mt-4 border-t border-border/40 pt-4">
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="size-10 overflow-hidden rounded-full">
                    <img
                      src={reply.authorImage}
                      alt={reply.authorName}
                      className="size-full object-cover"
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="cursor-pointer font-semibold text-foreground hover:underline">
                      {reply.authorName}
                    </span>
                    {reply.isVerified && (
                      <BadgeCheck className="size-4 fill-sky-500 text-background" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      @{reply.authorHandle}
                    </span>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">
                      {reply.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/80">
                    {reply.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

export { XCard as XGradientCard }
export default XCard
