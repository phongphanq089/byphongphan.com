import { useMemo } from "react"

import { HOOK_CATEGORIES } from "@/shared/config"
import { type LineNavGroup } from "@/shared/ui/core/line-nav"
import { DocQuickNav } from "@/widgets/doc-detail-layout"

import { HOOKS_DATA } from "../hooks-data"

export interface HookQuickNavProps {
  currentCategory: string
  currentSlug: string
  currentTitle?: string
  className?: string
}

export function HookQuickNav({
  currentCategory,
  currentSlug,
  currentTitle,
  className,
}: HookQuickNavProps) {
  const currentHook = useMemo(
    () => HOOKS_DATA.find((h) => h.slug === currentSlug),
    [currentSlug]
  )
  const displayTitle = currentTitle || currentHook?.name || currentSlug

  const navGroups: LineNavGroup[] = useMemo(() => {
    return HOOK_CATEGORIES.map((cat) => {
      const items = HOOKS_DATA.filter((hook) => hook.category === cat.id)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((hook) => ({
          title: hook.name,
          href: `/hooks/${hook.category}/${hook.slug}`,
          badge: hook.isNew ? (
            <span
              aria-label="New component"
              className="size-1.5 shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.85)]"
            />
          ) : undefined,
        }))

      return {
        title: cat.label,
        href: `/hooks/${cat.id}`,
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
      entityTitle="Hooks"
      currentCategory={currentCategory}
      currentSlug={currentSlug}
      currentTitle={displayTitle}
      activeHref={`/hooks/${currentCategory}/${currentSlug}`}
      navGroups={navGroups}
      totalCount={totalCount}
      className={className}
    />
  )
}

export default HookQuickNav
