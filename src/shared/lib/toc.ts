import type { ReactNode } from "react"

import type { TOCItemType } from "@/shared/ui/system/toc-minimap"

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function extractTextFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }
  if (!node) return ""
  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join("")
  }
  if (typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props
    return extractTextFromNode(props?.children)
  }
  return ""
}

export function extractTocFromMarkdown(
  content: string,
  options: { includeOverview?: boolean } = { includeOverview: true }
): TOCItemType[] {
  const items: TOCItemType[] = []
  const usedIds = new Map<string, number>()

  if (options.includeOverview) {
    items.push({
      title: "Overview",
      url: "#overview",
      depth: 1,
    })
    usedIds.set("overview", 1)
  }

  if (!content) return items

  const lines = content.split("\n")
  let inCodeBlock = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      const depth = match[1].length
      let rawTitle = match[2].trim()

      // Strip markdown links [text](url) -> text
      rawTitle = rawTitle.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Strip backticks `code` -> code
      rawTitle = rawTitle.replace(/`([^`]+)`/g, "$1")

      if (!rawTitle) continue

      const baseSlug = slugify(rawTitle) || "section"
      const count = usedIds.get(baseSlug) ?? 0
      usedIds.set(baseSlug, count + 1)
      const slug = count === 0 ? baseSlug : `${baseSlug}-${count}`

      items.push({
        title: rawTitle,
        url: `#${slug}`,
        depth,
      })
    }
  }

  return items
}
