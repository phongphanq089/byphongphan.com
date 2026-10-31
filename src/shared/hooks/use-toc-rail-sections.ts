/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react"

import type { RailSection } from "@/registry/animated/rail-scroll-scrubber"
import type { TOCItemType } from "@/shared/ui/system/toc-minimap"

export interface UseTocRailSectionsOptions {
  /** Optional custom short titles for desktop 3D rail characters (e.g. { "#components-ui": "COMPONENTS" }) */
  shortTitles?: Record<string, string>
}

const DEFAULT_SHORT_TITLES: Record<string, string> = {
  "#banner": "BANNER",
  "#about": "ABOUT ME",
  "#tech-stack": "TECH STACK",
  "#blocks": "BLOCKS",
  "#components-ui": "COMPONENTS",
  "#blog": "WRITING",
  "#resources": "RESOURCES",
  "#vietnam-map": "VIET NAM",
  "#overview": "OVERVIEW",
  "#live-interactive-stage": "INTERACTIVE",
  "#installation": "INSTALL",
  "#usage": "USAGE",
  "#props": "PROPS",
  "#props--api-reference": "PROPS",
  "#anatomy": "ANATOMY",
  "#examples": "EXAMPLES",
}

function shorten(title: string): string {
  if (!title) return "SECTION"
  const clean = title.replace(/\s+Section$/i, "").trim()
  if (clean.length <= 12) return clean.toUpperCase()
  const words = clean.split(" ")
  if (words.length > 1 && words[0].length + words[1].length < 12) {
    return `${words[0]} ${words[1]}`.toUpperCase()
  }
  return words[0].toUpperCase()
}

function computeSections(
  items: TOCItemType[],
  shortTitles: Record<string, string>,
  measuredOffsets?: Record<string, number>
): RailSection[] {
  if (!items.length) return []
  const N = items.length
  const maxScroll =
    typeof document !== "undefined"
      ? document.documentElement.scrollHeight - window.innerHeight
      : 1000

  return items.map((item, i) => {
    const id = item.url.replace("#", "")
    const label = typeof item.title === "string" ? item.title : id
    const title =
      shortTitles[item.url] ?? DEFAULT_SHORT_TITLES[item.url] ?? shorten(label)

    let start = i / N
    if (i === 0) {
      start = 0.0
    } else if (measuredOffsets && id in measuredOffsets && maxScroll > 0) {
      start = Math.min(1, Math.max(0, measuredOffsets[id] / maxScroll))
    }

    return {
      id,
      title,
      label,
      start,
      anchor: (i + 0.5) / N,
      flightRange: (i === 0
        ? [-0.15, -0.02]
        : [start - 0.08, start + 0.06]) as [number, number],
    }
  })
}

function normalizeSections(raw: RailSection[]): RailSection[] {
  if (!raw.length) return []
  const result = [...raw]

  // Enforce monotonicity
  result[0].start = 0.0
  for (let i = 1; i < result.length; i++) {
    if (result[i].start <= result[i - 1].start) {
      result[i].start = Math.min(0.98, result[i - 1].start + 0.04)
    }
  }

  // Calculate end, anchor and flight ranges
  for (let i = 0; i < result.length; i++) {
    const nextStart = i < result.length - 1 ? result[i + 1].start : 1.0
    result[i].end = nextStart
    result[i].anchor = (result[i].start + nextStart) / 2
    if (i === 0) {
      result[i].flightRange = [-0.15, -0.02]
    } else {
      const prevStart = result[i - 1].start
      const mid = (prevStart + result[i].start) / 2
      result[i].flightRange = [
        mid,
        Math.min(1.0, result[i].start + (nextStart - result[i].start) * 0.25),
      ]
    }
  }

  return result
}

export function useTocRailSections(
  items: TOCItemType[],
  options?: UseTocRailSectionsOptions
): RailSection[] {
  const shortTitles = options?.shortTitles ?? DEFAULT_SHORT_TITLES

  const [sections, setSections] = useState<RailSection[]>(() =>
    normalizeSections(computeSections(items, shortTitles))
  )

  const measure = useCallback(() => {
    if (typeof window === "undefined" || !items.length) return
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    if (maxScroll <= 0) return

    const offsets: Record<string, number> = {}
    for (const item of items) {
      const id = item.url.replace("#", "")
      const el = document.getElementById(id)
      if (el) {
        const rect = el.getBoundingClientRect()
        offsets[id] = window.scrollY + rect.top
      }
    }

    const computed = computeSections(items, shortTitles, offsets)
    setSections(normalizeSections(computed))
  }, [items, shortTitles])

  useEffect(() => {
    measure()
    const timer1 = setTimeout(measure, 150)
    const timer2 = setTimeout(measure, 600)

    window.addEventListener("resize", measure, { passive: true })
    window.addEventListener("scroll", measure, { once: true, passive: true })

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener("resize", measure)
    }
  }, [measure])

  return sections
}
