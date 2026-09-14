import { createFileRoute } from "@tanstack/react-router"
import { Check, Code2, Copy, Eye, Search } from "lucide-react"
import { useState } from "react"

import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/ui"

export const Route = createFileRoute("/admin/registry")({
  component: AdminRegistryPage,
})

interface RegistryItem {
  name: string
  title: string
  description: string
  type: "primitive" | "animated" | "block"
  status: "stable" | "beta" | "new"
  dependencies: string[]
  command: string
}

const REGISTRY_ITEMS: RegistryItem[] = [
  {
    name: "file-upload",
    title: "Custom FilePond Uploader",
    description:
      "Accessible drag-and-drop file uploader with image preview, brand red progress bar, and presets.",
    type: "primitive",
    status: "new",
    dependencies: [
      "filepond",
      "react-filepond",
      "filepond-plugin-image-preview",
    ],
    command: "npx shadcn@latest add https://phongdev.me/r/file-upload.json",
  },
  {
    name: "animated-glow-card",
    title: "Animated Glow Card",
    description:
      "Cursor-following radial specular highlight border card powered by CSS variables.",
    type: "animated",
    status: "stable",
    dependencies: ["framer-motion"],
    command:
      "npx shadcn@latest add https://phongdev.me/r/animated-glow-card.json",
  },
  {
    name: "sidebar",
    title: "Collapsible Admin Sidebar",
    description:
      "Multi-level responsive sidebar with collapse to icon rail, sheet drawer for mobile, and active glow.",
    type: "primitive",
    status: "stable",
    dependencies: ["radix-ui", "use-mobile"],
    command: "npx shadcn@latest add sidebar",
  },
  {
    name: "sheet",
    title: "Slide-over Sheet Drawer",
    description:
      "Accessible slide-over side drawer powered by Radix UI dialog for editing forms and inspect panes.",
    type: "primitive",
    status: "stable",
    dependencies: ["radix-ui"],
    command: "npx shadcn@latest add sheet",
  },
  {
    name: "tabs",
    title: "Interactive Tabs",
    description:
      "Underline & pill-style tabs with keyboard navigation and accessible aria-selected indicators.",
    type: "primitive",
    status: "stable",
    dependencies: ["radix-ui"],
    command: "npx shadcn@latest add tabs",
  },
  {
    name: "paper-shader-hero",
    title: "Mathematical Shader Hero",
    description:
      "Interactive WebGL canvas hero banner with zero performance penalties and pointer inertia.",
    type: "block",
    status: "beta",
    dependencies: ["@paper-design/shaders-react", "three"],
    command:
      "npx shadcn@latest add https://phongdev.me/r/paper-shader-hero.json",
  },
  {
    name: "command-menu",
    title: "CmdK Command Palette",
    description:
      "Instant spotlight fuzzy search with group headers, shortcuts, and keyboard listeners.",
    type: "block",
    status: "stable",
    dependencies: ["cmdk"],
    command: "npx shadcn@latest add https://phongdev.me/r/command-menu.json",
  },
]

function AdminRegistryPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedName, setCopiedName] = useState<string | null>(null)
  const [previewItem, setPreviewItem] = useState<RegistryItem | null>(null)

  const copyCommand = (item: RegistryItem) => {
    navigator.clipboard.writeText(item.command)
    setCopiedName(item.name)
    setTimeout(() => setCopiedName(null), 2000)
  }

  const filteredItems = REGISTRY_ITEMS.filter((item) => {
    const matchesTab = activeTab === "all" ? true : item.type === activeTab
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Registry Hub
            </h1>
            <Badge
              variant="outline"
              className="rounded-md border-primary/40 bg-primary/10 font-mono text-xs text-primary"
            >
              CLI Distribution
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Browse and distribute your custom UI primitives, animated
            components, and composite blocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-md border-border/80 bg-muted/40 px-2.5 py-1 font-mono text-xs"
          >
            Origin UI & SoundCN Compatible
          </Badge>
        </div>
      </div>

      {/* ─── Top Stats ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-xl border-border/70 bg-card/60 shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">
              Core Primitives
            </CardDescription>
            <CardTitle className="font-mono text-2xl font-bold text-foreground">
              21
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-xl border-border/70 bg-card/60 shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">
              Animated Components
            </CardDescription>
            <CardTitle className="font-mono text-2xl font-bold text-primary">
              14
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-xl border-border/70 bg-card/60 shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">
              Composite Blocks
            </CardDescription>
            <CardTitle className="font-mono text-2xl font-bold text-foreground">
              8
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* ─── Tabs & Search ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="h-9 rounded-lg bg-muted/60 p-1">
            <TabsTrigger
              value="all"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              All Items ({REGISTRY_ITEMS.length})
            </TabsTrigger>
            <TabsTrigger
              value="primitive"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Primitives
            </TabsTrigger>
            <TabsTrigger
              value="animated"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Animated UI
            </TabsTrigger>
            <TabsTrigger
              value="block"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Blocks
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search registry components..."
            className="h-9 rounded-lg border-border/80 bg-card/50 pl-8 text-xs"
          />
        </div>
      </div>

      {/* ─── Registry Grid ─── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredItems.map((item) => (
          <Card
            key={item.name}
            className="flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-5 shadow-xs transition-all hover:border-border"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      {item.title}
                    </h3>
                    {item.status === "new" && (
                      <Badge
                        variant="outline"
                        className="rounded-md border-primary/40 bg-primary/10 font-mono text-[10px] text-primary"
                      >
                        NEW
                      </Badge>
                    )}
                    {item.status === "beta" && (
                      <Badge
                        variant="outline"
                        className="rounded-md border-amber-500/40 bg-amber-500/10 font-mono text-[10px] text-amber-500"
                      >
                        BETA
                      </Badge>
                    )}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    @{item.name}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="rounded-md border-border/80 bg-muted/40 font-mono text-[10px] text-muted-foreground capitalize"
                >
                  {item.type}
                </Badge>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>

              {/* Dependencies tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase">
                  Deps:
                </span>
                {item.dependencies.map((dep) => (
                  <Badge
                    key={dep}
                    variant="outline"
                    className="rounded-md border-border/60 bg-muted/30 px-1.5 py-0 font-mono text-[10px] text-muted-foreground"
                  >
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CLI Command Bar & Action */}
            <div className="mt-4 space-y-2 border-t border-border/60 pt-3">
              <div className="flex items-center justify-between gap-2 rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground">
                <span className="truncate">{item.command}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCommand(item)}
                  className="size-6 shrink-0 rounded-md p-0 text-muted-foreground hover:text-foreground"
                >
                  {copiedName === item.name ? (
                    <Check className="size-3 text-emerald-400" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewItem(item)}
                  className="h-8 gap-1.5 rounded-lg border-border/80 text-xs"
                >
                  <Eye className="size-3" />
                  <span>Preview Code</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ─── Dialog: Preview Code ─── */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="rounded-xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Code2 className="size-4 text-primary" />
              <span>{previewItem?.title}</span>
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              @{previewItem?.name} &bull; Type: {previewItem?.type}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-xs text-muted-foreground">
              <p className="mb-1 font-semibold text-foreground">
                CLI Installation:
              </p>
              <code className="block rounded-md bg-card p-2 font-mono text-xs text-foreground">
                {previewItem?.command}
              </code>
            </div>

            <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-xs text-muted-foreground">
              <p className="mb-1 font-semibold text-foreground">
                Project Import:
              </p>
              <code className="block rounded-md bg-card p-2 font-mono text-xs text-primary">
                {`import { ${previewItem?.title.replace(/\s+/g, "")} } from "@/shared/ui"`}
              </code>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
