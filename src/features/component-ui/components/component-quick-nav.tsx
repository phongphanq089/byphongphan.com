import { useMemo } from "react"

import { COMPONENT_CATEGORIES } from "@/shared/config"
import { type LineNavGroup } from "@/shared/ui/core/line-nav"
import { DocQuickNav } from "@/widgets/doc-detail-layout"

import { COMPONENTS_DATA } from "../components-data"

export interface ComponentQuickNavProps {
  currentCategory: string
  currentSlug: string
  currentTitle?: string
  className?: string
}

export function ComponentQuickNav({
  currentCategory,
  currentSlug,
  currentTitle,
  className,
}: ComponentQuickNavProps) {
  const currentComponent = useMemo(
    () => COMPONENTS_DATA.find((c) => c.slug === currentSlug),
    [currentSlug]
  )
  const displayTitle = currentTitle || currentComponent?.name || currentSlug

  const navGroups: LineNavGroup[] = useMemo(() => {
    return COMPONENT_CATEGORIES.map((cat) => {
      const items = COMPONENTS_DATA.filter((comp) => comp.category === cat.id)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((comp) => ({
          title: comp.name,
          href: `/component-ui/${comp.category}/${comp.slug}`,
          badge: comp.isNew ? (
            <span
              aria-label="New component"
              className="size-1.5 shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.85)]"
            />
          ) : comp.isUpdated ? (
            <span
              aria-label="Updated component"
              className="size-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.85)]"
            />
          ) : undefined,
        }))

      return {
        title: cat.label,
        href: `/component-ui/${cat.id}`,
        items,
      }
    }).filter((group) => group.items.length > 0)
  }, [])

  const totalCount = useMemo(
    () => navGroups.reduce((acc, g) => acc + g.items.length, 0),
    [navGroups]
  )

  return (
    <DocQuickNav
      entityTitle="Components"
      currentCategory={currentCategory}
      currentSlug={currentSlug}
      currentTitle={displayTitle}
      activeHref={`/component-ui/${currentCategory}/${currentSlug}`}
      navGroups={navGroups}
      totalCount={totalCount}
      className={className}
    />
  )
}

export default ComponentQuickNav
