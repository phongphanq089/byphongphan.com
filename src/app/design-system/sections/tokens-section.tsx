export function TokensSection() {
  const colors = [
    {
      name: "PP Primary (Brand)",
      class: "bg-pp-primary",
      text: "var(--pp-primary) / #dc2626",
      desc: "Main brand signature accent",
    },
    {
      name: "Background",
      class: "bg-background border border-border",
      text: "oklch(0.12 0 0)",
      desc: "App backdrop",
    },
    {
      name: "Card",
      class: "bg-card border border-border",
      text: "oklch(0.15 0 0)",
      desc: "Surface container",
    },
    {
      name: "Muted",
      class: "bg-muted text-muted-foreground",
      text: "oklch(0.2 0 0)",
      desc: "Subtle background",
    },
    {
      name: "Accent",
      class: "bg-accent text-accent-foreground",
      text: "oklch(0.25 0 0)",
      desc: "Interactive hover",
    },
    {
      name: "Border",
      class: "bg-border",
      text: "oklch(1 0 0 / 12%)",
      desc: "Separators & borders",
    },
    {
      name: "Destructive",
      class: "bg-destructive text-white",
      text: "oklch(0.6 0.2 25)",
      desc: "Alert / danger",
    },
  ]

  const typoScales = [
    {
      token: "--text-section-label",
      size: "10px / 0.625rem",
      usage: "Section Monospace Eyebrow",
      sample: "// 01. ARCHITECTURE DESIGN",
    },
    {
      token: "--text-section-heading",
      size: "36px / 2.25rem",
      usage: "Main Section Header",
      sample: "Engineering & Craft",
    },
    {
      token: "--text-section-count",
      size: "20px / 1.25rem",
      usage: "Section Count Badge",
      sample: "(08)",
    },
    {
      token: "--text-section-subtitle",
      size: "15px / 0.9375rem",
      usage: "Section Subtitle Paragraph",
      sample: "Interactive components built with React 19 and Tailwind v4.",
    },
  ]

  return (
    <div className="space-y-10">
      {/* Color Palette */}
      <div>
        <h3 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          01. Color Tokens & Theme Palettes
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {colors.map((c) => (
            <div
              key={c.name}
              className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-xs"
            >
              <div
                className={`h-16 w-full rounded-md shadow-inner ${c.class}`}
              />
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {c.name}
                </div>
                <div className="text-xs text-muted-foreground">{c.text}</div>
                <div className="mt-1 text-[11px] text-muted-foreground/80">
                  {c.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Scale */}
      <div>
        <h3 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          02. Typography Hierarchy & Tokens
        </h3>
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {typoScales.map((t) => (
            <div key={t.token} className="space-y-2 p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-primary">{t.token}</span>
                <span>
                  {t.size} • {t.usage}
                </span>
              </div>
              <div className="text-foreground">{t.sample}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
