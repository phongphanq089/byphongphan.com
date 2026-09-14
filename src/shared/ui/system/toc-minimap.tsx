import { useEffect, useMemo, useState } from "react"

import { useSound } from "@/shared/hooks/use-sound"
import { uMiniMapOpenSound } from "@/shared/lib/u-mini-map-open"
import { cn } from "@/shared/lib/utils"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/ui/core/hover-card"

export type TOCItemType = {
  title: React.ReactNode | string
  url: string
  depth: number
}

export type TOCMinimapProps = {
  /** @fumadocsHref #tocitemtype */
  items: TOCItemType[]
  className?: string
}

export function TOCMinimap({ items, className }: TOCMinimapProps) {
  const [open, setOpen] = useState(false)
  const itemIds = useMemo(
    () => items.map((item) => item.url.replace("#", "")),
    [items]
  )

  const activeHeading = useActiveHeading(itemIds)

  const [play] = useSound(uMiniMapOpenSound, { volume: 0.3 })

  if (!items.length) {
    return null
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) play()
  }

  const handleTriggerClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen((prev) => {
      const next = !prev
      if (next) play()
      return next
    })
  }

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setOpen(false)
    const url = e.currentTarget.getAttribute("href") ?? ""
    scrollToHeading(url)
  }

  return (
    <div className={cn("ml-auto w-18", className)}>
      <HoverCard
        open={open}
        onOpenChange={handleOpenChange}
        openDelay={0}
        closeDelay={150}
      >
        <HoverCardTrigger asChild onClick={handleTriggerClick}>
          <button
            type="button"
            aria-label="Table of contents minimap"
            aria-expanded={open}
            className="flex max-h-[50dvh] w-full cursor-pointer touch-manipulation flex-col items-end gap-3 overflow-hidden py-3 pr-2 pl-6 opacity-100 transition-opacity duration-200 select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-primary data-popup-open:opacity-0"
          >
            {items.map((item) => (
              <div
                key={item.url}
                data-depth={item.depth}
                data-active={item.url === `#${activeHeading}`}
                className={cn(
                  "h-0.5 w-6 shrink-0 rounded-xs bg-primary transition-[background-color] duration-200",
                  "data-[depth=3]:w-4",
                  "data-[depth=4]:w-2",
                  "data-active:bg-foreground"
                )}
              />
            ))}
          </button>
        </HoverCardTrigger>

        <HoverCardContent
          className="w-56 overflow-hidden p-0 duration-200 data-[side=left]:slide-in-from-right-3 data-[side=left]:slide-out-to-right-3 data-open:zoom-in-100 data-closed:zoom-out-100"
          align="start"
          alignOffset={0}
          side="left"
          sideOffset={-60}
          onPointerDownOutside={() => setOpen(false)}
          onInteractOutside={() => setOpen(false)}
        >
          <div className="flex max-h-[50dvh] overflow-y-auto overscroll-contain">
            <ul className="flex size-full flex-col px-6 py-4 text-sm">
              {items.map((item) => (
                <li key={item.url} className="flex py-1">
                  <a
                    href={item.url}
                    data-depth={item.depth}
                    data-active={item.url === `#${activeHeading}`}
                    className={cn(
                      "line-clamp-2 w-full cursor-pointer transition-[color] duration-200",
                      "text-muted-foreground hover:text-foreground data-active:text-foreground",
                      "data-[depth=3]:pl-4 data-[depth=4]:pl-8"
                    )}
                    onClick={handleItemClick}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export function useActiveHeading(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%", threshold: 0.98 }
    )

    for (const id of itemIds ?? []) {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    }

    return () => {
      for (const id of itemIds ?? []) {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      }
    }
  }, [itemIds])

  return activeId
}

function scrollToHeading(url: string) {
  history.pushState(null, "", url)
  document.getElementById(url.replace("#", ""))?.scrollIntoView({
    behavior: "smooth",
  })
}
