import { useState } from "react"

import { iconComponents, type IconName } from "@/shared/ui/icons"

import { ShowcaseCard } from "../components/showcase-card"

export function IconsSection() {
  const [copied, setCopied] = useState<string | null>(null)
  const iconList = Object.keys(iconComponents) as IconName[]

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(`<RenderIcon name="${name}" size={24} />`)
    setCopied(name)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <ShowcaseCard
      title="Tech Stack & Brand Icons"
      description="Custom SVGs with hover effects. Click to copy snippet."
      tag="Icons"
    >
      <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {iconList.map((name) => {
          const IconComp = iconComponents[name]
          const isCopied = copied === name
          return (
            <button
              key={name}
              onClick={() => copyToClipboard(name)}
              className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border border-border/50 bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-accent"
            >
              <div className="flex h-8 w-8 items-center justify-center text-foreground transition-colors group-hover:text-primary">
                <IconComp className="h-6 w-6" />
              </div>
              <span className="mt-2 w-full truncate text-center text-[10px] text-muted-foreground group-hover:text-foreground">
                {isCopied ? "Copied!" : name}
              </span>
            </button>
          )
        })}
      </div>
    </ShowcaseCard>
  )
}
