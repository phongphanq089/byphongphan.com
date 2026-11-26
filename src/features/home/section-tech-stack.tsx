import { ArrowUpRightIcon } from "@phosphor-icons/react"

import { DraftingSectionRow } from "@/app/layouts/drafting-section-row"
import { TECH_STACK, type TechStackItem } from "@/content"
import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"
import { iconComponents } from "@/shared/ui/icons"
import { ExternalLink } from "@/shared/ui/system"

export interface SectionTechStackProps {
  className?: string
}

interface CategoryGroup {
  category: NonNullable<TechStackItem["category"]>
  label: string
  index: string
}

const CATEGORIES: CategoryGroup[] = [
  { category: "frontend", label: "Frontend & Frameworks", index: "01" },
  { category: "styling", label: "Styling & Motion", index: "02" },
  { category: "backend", label: "Backend & Services", index: "03" },
  { category: "database", label: "Databases & Storage", index: "04" },
  { category: "tools", label: "Build & Tooling", index: "05" },
]

/**
 * Section II: Tech Stack
 *
 * Integrated into the 1024px Swiss Drafting Architecture:
 * - Section ID: #tech-stack (matches TOC Minimap & Floating TOC Rail)
 * - Roman Numeral: II
 * - 528px center content column with categorized interactive tactile badges
 */
export function SectionTechStack({ className }: SectionTechStackProps) {
  return (
    <DraftingSectionRow
      id="tech-stack"
      romanIndex="II"
      title="TECH STACK"
      className={className}
    >
      {/* ─── Description ─── */}
      <p className="text-sm leading-relaxed text-muted-foreground">
        Curated collection of languages, frameworks, styling engines, and
        backend runtimes I leverage to design, architect, and ship
        high-performance digital products.
      </p>

      {/* ─── Categorized Tech Badges ─── */}
      <div className="space-y-6 pt-2">
        {CATEGORIES.map(({ category, label, index }) => {
          const items = TECH_STACK.filter((item) => item.category === category)
          return (
            <div key={category} className="space-y-2.5">
              {/* Category Hairline Subhead */}
              <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground select-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-xs text-pp-secondary italic">
                    {index}
                  </span>
                  <span className="font-semibold tracking-wider text-foreground/85 uppercase">
                    {label}
                  </span>
                </div>
                <div className="flex-1 border-b border-dashed border-border/70" />
                <span className="text-[10px] text-muted-foreground/60">
                  [{items.length}]
                </span>
              </div>

              {/* Badges Container */}
              <div className="flex flex-wrap items-center gap-2">
                {items.map((item) => (
                  <TechBadge key={item.label} item={item} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </DraftingSectionRow>
  )
}

function TechBadge({ item }: { item: TechStackItem }) {
  const IconComp = iconComponents[item.icon]

  return (
    <ExternalLink
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      utm={{ campaign: "tech_stack" }}
      title={`Visit ${item.label} official website`}
      onMouseEnter={() => playHoverSound()}
      onClick={() => playClickSound()}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-xs border border-border/80 bg-card/40 px-2.5 py-1.5 transition-all duration-200 select-none",
        "hover:-translate-y-0.5 hover:border-foreground/50 hover:bg-card/90 hover:shadow-xs active:scale-95"
      )}
    >
      {/* Icon Area */}
      <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
        {IconComp ? (
          <IconComp
            size={16}
            className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
          />
        ) : null}
      </span>

      {/* Tech Label */}
      <span className="font-mono text-xs font-medium tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">
        {item.label}
      </span>

      {/* Micro External Indicator Arrow */}
      <ArrowUpRightIcon className="size-3 text-muted-foreground/40 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground group-hover:opacity-100" />
    </ExternalLink>
  )
}

export default SectionTechStack
