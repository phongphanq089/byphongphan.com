import { useEffect, useState } from "react"

export interface TocItem {
  id: string
  text: string
  level: number
}

export function useDomToc(
  containerRef: React.RefObject<HTMLElement | null>,
  deps: unknown
) {
  const [headings, setHeadings] = useState<TocItem[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const elements = Array.from(
      containerRef.current.querySelectorAll("h2, h3")
    ) as HTMLElement[]

    const items: TocItem[] = elements.map((el, index) => {
      if (!el.id) {
        el.id =
          el.textContent
            ?.toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-") || `heading-${index}`
      }

      return {
        id: el.id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      }
    })

    setHeadings(items)
  }, [containerRef, deps])

  return headings
}
