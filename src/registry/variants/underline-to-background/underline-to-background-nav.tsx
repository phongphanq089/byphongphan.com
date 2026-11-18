import { UnderlineToBackground } from "@/registry/animated/underline-to-background"

export default function UnderlineToBackgroundNav() {
  const NAV_ITEMS = [
    { label: "Overview", active: false },
    { label: "Documentation", active: true },
    { label: "Components", active: false },
    { label: "Changelog", active: false },
  ]

  return (
    <nav className="flex items-center gap-6 rounded-2xl border border-border/80 bg-background/80 px-6 py-3 shadow-xs backdrop-blur-sm">
      {NAV_ITEMS.map((item) => (
        <UnderlineToBackground
          key={item.label}
          as="span"
          className={`text-sm font-medium transition-colors ${
            item.active
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          targetTextColor={
            item.active
              ? "var(--primary-foreground, #fff)"
              : "var(--background, #000)"
          }
        >
          {item.label}
        </UnderlineToBackground>
      ))}
    </nav>
  )
}
