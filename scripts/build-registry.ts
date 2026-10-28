import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

import { REGISTRY_ITEMS } from "../src/registry/registry"
import {
  VALID_BLOCK_CATEGORY_IDS,
  VALID_COMPONENT_CATEGORY_IDS,
} from "../src/shared/config/categories.config"
import { siteConfig } from "../src/shared/config/site.config"

const REGISTRY_DIR = path.join(process.cwd(), "src", "registry")
const OUTPUT_DIR = path.join(process.cwd(), "public", "r")

async function buildRegistry() {
  console.log("🚀 Building Shadcn Registry...")

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const indexItems = []

  for (const item of REGISTRY_ITEMS) {
    const filesWithContent = item.files.map((file) => {
      const filePath = path.join(REGISTRY_DIR, file.path)
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      let content = fs.readFileSync(filePath, "utf-8")

      // Normalize import paths for external consumers using shadcn standard aliases
      content = content.replace(/@\/shared\/lib\/utils/g, "@/lib/utils")
      content = content.replace(/@\/shared\/lib\b/g, "@/lib/utils")
      content = content.replace(/@\/shared\/ui\/core/g, "@/components/ui")
      content = content.replace(/@\/registry\/ui/g, "@/components/ui")
      content = content.replace(/@\/registry\/hooks/g, "@/hooks")
      content = content.replace(/@\/shared\/hooks/g, "@/hooks")
      content = content.replace(/@\/shared\/providers/g, "next-themes")

      return {
        path: file.path,
        content,
        type: file.type,
        target: file.target ?? `components/${file.path}`,
      }
    })

    const resolvedRegistryDependencies = (item.registryDependencies ?? []).map(
      (dep) => {
        // If already an absolute URL or namespaced (@scope/name), keep as-is
        if (
          dep.startsWith("http://") ||
          dep.startsWith("https://") ||
          dep.startsWith("@")
        ) {
          return dep
        }

        // If it matches a local registry item (custom item on our site), qualify with full URL
        const isInternalItem = REGISTRY_ITEMS.some((reg) => reg.name === dep)
        if (isInternalItem) {
          return `${siteConfig.url}/r/${dep}.json`
        }

        // Otherwise it's an official shadcn component (e.g. "button"), keep bare name
        return dep
      }
    )

    const registryItemPayload = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies ?? [],
      devDependencies: item.dependencies ?? [],
      registryDependencies: resolvedRegistryDependencies,
      files: filesWithContent,
      ...(item.tailwind ? { tailwind: item.tailwind } : {}),
      ...(item.cssVars ? { cssVars: item.cssVars } : {}),
    }

    const itemOutputPath = path.join(OUTPUT_DIR, `${item.name}.json`)
    fs.writeFileSync(
      itemOutputPath,
      JSON.stringify(registryItemPayload, null, 2),
      "utf-8"
    )
    console.log(`  ✓ Generated: public/r/${item.name}.json`)

    indexItems.push({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies ?? [],
      registryDependencies: resolvedRegistryDependencies,
    })
  }

  // Write index.json (list of all available registry components)
  const indexPath = path.join(OUTPUT_DIR, "index.json")
  fs.writeFileSync(
    indexPath,
    JSON.stringify(indexItems, null, 2) + "\n",
    "utf-8"
  )
  console.log(
    `\n📦 Successfully bundled ${indexItems.length} registry items to public/r/`
  )

  // Write src/registry/manifest.json for static prerendering
  const manifestPath = path.join(REGISTRY_DIR, "manifest.json")
  const manifestData = {
    blockCategories: [...VALID_BLOCK_CATEGORY_IDS],
    blocks: REGISTRY_ITEMS.filter((i) => i.type === "registry:block").map(
      (i) => ({
        category: i.category,
        slug: i.name,
      })
    ),
    componentCategories: [...VALID_COMPONENT_CATEGORY_IDS],
    components: REGISTRY_ITEMS.filter(
      (i) => i.type !== "registry:block" && i.type !== "registry:hook"
    ).map((i) => ({
      category: i.category,
      slug: i.name,
    })),
  }
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(manifestData, null, 2) + "\n",
    "utf-8"
  )
  console.log(`  ✓ Generated: src/registry/manifest.json`)

  // Compute stats
  const countByType: Record<string, number> = {}
  for (const item of REGISTRY_ITEMS) {
    countByType[item.type] = (countByType[item.type] || 0) + 1
  }

  const registryStats = {
    total: REGISTRY_ITEMS.length,
    countByType,
    updatedAt: new Date().toISOString(),
  }

  // Generate official shadcn registry master index (registry.json)
  const registryPayload = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "phongphan",
    homepage: `${siteConfig.url}/component-ui`,
    items: REGISTRY_ITEMS.map((item) => ({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      category: item.category,
      author: `${siteConfig.author.name} <${siteConfig.author.email}>`,
      dependencies: item.dependencies ?? [],
      devDependencies: item.devDependencies ?? [],
      registryDependencies: (item.registryDependencies ?? []).map((dep) => {
        if (
          dep.startsWith("http://") ||
          dep.startsWith("https://") ||
          dep.startsWith("@")
        ) {
          return dep
        }
        const isInternalItem = REGISTRY_ITEMS.some((reg) => reg.name === dep)
        return isInternalItem ? `${siteConfig.url}/r/${dep}.json` : dep
      }),
      files: item.files.map((f) => ({
        path: `src/registry/${f.path}`,
        type: f.type,
        target: f.target ?? `components/${f.path}`,
      })),
    })),
  }

  // Write to root and public directories for GitHub browsing & direct URL access
  const rootDir = process.cwd()
  const publicDir = path.join(rootDir, "public")

  fs.writeFileSync(
    path.join(rootDir, "registry.json"),
    JSON.stringify(registryPayload, null, 2) + "\n",
    "utf-8"
  )
  fs.writeFileSync(
    path.join(publicDir, "registry.json"),
    JSON.stringify(registryPayload, null, 2) + "\n",
    "utf-8"
  )
  console.log(`  ✓ Generated: registry.json (root & public)`)

  fs.writeFileSync(
    path.join(rootDir, "registry-stats.json"),
    JSON.stringify(registryStats, null, 2) + "\n",
    "utf-8"
  )
  fs.writeFileSync(
    path.join(publicDir, "registry-stats.json"),
    JSON.stringify(registryStats, null, 2) + "\n",
    "utf-8"
  )
  console.log(`  ✓ Generated: registry-stats.json (root & public)`)

  // Generate index.md and llms.txt for AI agents and raw markdown readers
  const DOCS_DOMAIN = "https://byphongphan.com"
  const indexMdContent = generateIndexMdContent(
    REGISTRY_ITEMS,
    siteConfig,
    DOCS_DOMAIN
  )
  const llmsTxtContent = generateLlmsTxtContent(
    REGISTRY_ITEMS,
    siteConfig,
    DOCS_DOMAIN
  )

  fs.writeFileSync(path.join(rootDir, "index.md"), indexMdContent, "utf-8")
  fs.writeFileSync(path.join(publicDir, "index.md"), indexMdContent, "utf-8")
  console.log(`  ✓ Generated: index.md (root & public)`)

  fs.writeFileSync(path.join(rootDir, "llms.txt"), llmsTxtContent, "utf-8")
  fs.writeFileSync(path.join(publicDir, "llms.txt"), llmsTxtContent, "utf-8")
  console.log(`  ✓ Generated: llms.txt (root & public)`)

  // Generate dynamic 301 redirects for Netlify / Cloudflare from component and block aliases
  const redirectLines: string[] = [
    "# Auto-generated 301 redirects by scripts/build-registry.ts - DO NOT EDIT MANUALLY",
    "# Maps legacy/renamed component and block slugs to their canonical URLs",
  ]

  for (const item of REGISTRY_ITEMS) {
    if (item.aliases && item.aliases.length > 0) {
      const isBlock = item.type === "registry:block"
      const basePath = isBlock
        ? `/blocks/${item.category}`
        : `/component-ui/${item.category}`

      for (const alias of item.aliases) {
        redirectLines.push(
          `${basePath}/${alias}  ${basePath}/${item.name}  301!`
        )
        redirectLines.push(`/r/${alias}.json  /r/${item.name}.json  301!`)
      }
    }
  }

  const redirectsPath = path.join(publicDir, "_redirects")
  fs.writeFileSync(redirectsPath, redirectLines.join("\n") + "\n", "utf-8")
  console.log(
    `  ✓ Generated: public/_redirects (${Math.max(0, redirectLines.length - 2)} active redirect rules)`
  )

  // Generate dynamic telemetry configuration for the Blueprint Footer
  // Auto-detect commit hash across Netlify (COMMIT_REF), GitHub Actions (GITHUB_SHA), or local Git
  let commitHash =
    process.env.COMMIT_REF?.slice(0, 7) ||
    process.env.GITHUB_SHA?.slice(0, 7) ||
    process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
    ""

  if (!commitHash) {
    try {
      commitHash = execSync("git rev-parse --short HEAD", {
        stdio: ["ignore", "pipe", "ignore"],
      })
        .toString()
        .trim()
    } catch {
      commitHash = "99d8212"
    }
  }

  const buildDate = new Date().toISOString().split("T")[0]
  const telemetryContent = `// Auto-generated by scripts/build-registry.ts - DO NOT EDIT MANUALLY
export const TELEMETRY_CONFIG = {
  commitHash: "${commitHash}",
  buildDate: "${buildDate}",
  totalRegistryItems: ${REGISTRY_ITEMS.length},
  componentCount: ${REGISTRY_ITEMS.filter((i) => i.type === "registry:component" || i.type === "registry:ui").length},
  blockCount: ${REGISTRY_ITEMS.filter((i) => i.type === "registry:block").length},
  hookCount: ${REGISTRY_ITEMS.filter((i) => i.type === "registry:hook").length},
} as const
`

  const telemetryPath = path.join(
    rootDir,
    "src",
    "shared",
    "config",
    "telemetry.config.ts"
  )
  fs.writeFileSync(telemetryPath, telemetryContent, "utf-8")
  console.log(`  ✓ Generated: src/shared/config/telemetry.config.ts`)
}

function generateIndexMdContent(
  items: typeof REGISTRY_ITEMS,
  config: typeof siteConfig,
  docsUrl: string = "https://byphongphan.com"
): string {
  const components = items.filter(
    (i) => i.type === "registry:component" || i.type === "registry:ui"
  )
  const blocks = items.filter((i) => i.type === "registry:block")
  const hooks = items.filter((i) => i.type === "registry:hook")

  return `# Phong Phan — Dev Portfolio & UI Registry

> A pixel-perfect dev portfolio and modern component registry built natively on TanStack Start, Tailwind CSS v4, and Base UI.

## About the Author

- **Name:** ${config.author.name}
- **Role:** ${config.author.role} · Fullstack Capable
- **Expertise:** TanStack ecosystem, React 19, TypeScript, Design Systems, Serverless Architecture (Neon + Drizzle).
- **Website:** ${docsUrl}
- **GitHub:** ${config.social.github.href}
- **LinkedIn:** ${config.social.linkedin.href}
- **X (Twitter):** ${config.social.twitter.href}
- **Email:** ${config.author.email}

## Core Tech Stack

- **Framework:** TanStack Start (SSR / SSG, type-safe routing)
- **Styling & UI:** Tailwind CSS v4, Base UI, Motion
- **Backend (Roadmap v0.2):** Neon Postgres, Drizzle ORM, Better Auth
- **Hosting:** Netlify

## Quick Navigation

- [Home & Full Bio](${docsUrl}/index.md): Full raw markdown profile of Phong Phan.
- [Component Registry](${docsUrl}/component-ui): UI primitives, interactive cards, and responsive blocks.
- [Blocks Directory](${docsUrl}/blocks): Production-grade page sections and application blocks.
- [Registry Manifest](${docsUrl}/r/index.json): Machine-readable JSON for shadcn CLI installation.
- [Colophon](${docsUrl}/colophon): Architecture, design tokens, and technical stack details.
- [Technical Blog (In Development)](${docsUrl}/blog): Deep dives into Browser Rendering, Hydration, and Database Internals.
- [Developer Resources (In Development)](${docsUrl}/resources): Curated developer bookmarks, tools, and libraries.

## CLI Usage

Install components directly via shadcn CLI:

\`\`\`bash
# Add using the direct manifest URL
pnpm dlx shadcn add ${docsUrl}/r/<component-name>.json
\`\`\`

Or configure custom registry in \`components.json\`:

\`\`\`json
{
  "registries": {
    "${config.registry.namespace}": "${docsUrl}/r/{name}.json"
  }
}
\`\`\`

Then install by name:

\`\`\`bash
pnpm dlx shadcn add ${config.registry.namespace}/<component-name>
\`\`\`

---

## UI Components & Primitives (${components.length})

| Component | Category | Description | Direct Install |
| :--- | :--- | :--- | :--- |
${components
  .map(
    (c) =>
      `| [${c.title}](${docsUrl}/component-ui/${c.category}/${c.name}) | \`${c.category}\` | ${c.description} | \`pnpm dlx shadcn add ${docsUrl}/r/${c.name}.json\` |`
  )
  .join("\n")}

---

## Interactive Blocks (${blocks.length})

| Block | Category | Description | Live Preview | Direct Install |
| :--- | :--- | :--- | :--- | :--- |
${blocks
  .map(
    (b) =>
      `| [${b.title}](${docsUrl}/blocks/${b.category}/${b.name}) | \`${b.category}\` | ${b.description} | [Preview](${docsUrl}/blocks-preview/${b.name}) | \`pnpm dlx shadcn add ${docsUrl}/r/${b.name}.json\` |`
  )
  .join("\n")}

${
  hooks.length > 0
    ? `
---

## Custom Hooks (${hooks.length})

| Hook | Description | Direct Install |
| :--- | :--- | :--- |
${hooks
  .map(
    (h) =>
      `| [${h.title}](${docsUrl}/r/${h.name}.json) | ${h.description} | \`pnpm dlx shadcn add ${docsUrl}/r/${h.name}.json\` |`
  )
  .join("\n")}
`
    : ""
}
---

## Technical Blog (Roadmap v0.2)

- Upcoming deep dives covering React 19 concurrent rendering, TanStack Start internals, fluid animation physics, and fullstack serverless architecture.

---

## Admin CMS & Content Platform (Roadmap v0.2)

- Serverless PostgreSQL with **Neon** + **Drizzle ORM**
- Social authentication & session management with **Better Auth**
- Cloudflare R2 / ImageKit media CDN pipeline
- Transactional notification delivery with **Resend**
`
}

function generateLlmsTxtContent(
  items: typeof REGISTRY_ITEMS,
  config: typeof siteConfig,
  docsUrl: string = "https://byphongphan.com"
): string {
  const components = items.filter(
    (i) => i.type === "registry:component" || i.type === "registry:ui"
  )
  const blocks = items.filter((i) => i.type === "registry:block")
  const hooks = items.filter((i) => i.type === "registry:hook")

  return `# Phong Phan — Dev Portfolio & UI Registry

> A pixel-perfect dev portfolio and modern component registry built natively on TanStack Start, Tailwind CSS v4, and Base UI.

Personal portfolio and engineering showcase of Phong Phan. Frontend Engineer specializing in the TanStack ecosystem, React 19, TypeScript, fluid micro-interactions, acoustic UI design, and production-grade component architectures.

## Core Information

- Name: ${config.author.name}
- Role: ${config.author.role} · Fullstack Capable
- Location: ${config.author.location}
- Website: ${docsUrl}
- GitHub: ${config.social.github.href}
- LinkedIn: ${config.social.linkedin.href}
- X (Twitter): ${config.social.twitter.href}
- Email: ${config.author.email}
- Raw Profile: ${docsUrl}/index.md
- LLM Index: ${docsUrl}/llms.txt
- Registry Manifest: ${docsUrl}/r/index.json

## Primary Documentation & Navigation

- [Home](${docsUrl}): Interactive portfolio, featured case studies, and engineering background.
- [Component Registry](${docsUrl}/component-ui): Directory of customizable, accessible UI primitives and interactive micro-interactions.
- [Blocks](${docsUrl}/blocks): Ready-to-use, production-grade page sections and complex interface layouts.
- [Colophon](${docsUrl}/colophon): System specifications, design tokens, typography, and architecture.
- [Raw Profile (Markdown)](${docsUrl}/index.md): Full raw markdown portfolio document for text consumption.

## UI Components & Primitives

${components
  .map(
    (c) =>
      `- [${c.title}](${docsUrl}/component-ui/${c.category}/${c.name}): ${c.description} (CLI: \`pnpm dlx shadcn add ${docsUrl}/r/${c.name}.json\`)`
  )
  .join("\n")}

## Interactive Blocks

${blocks
  .map(
    (b) =>
      `- [${b.title}](${docsUrl}/blocks/${b.category}/${b.name}): ${b.description} (CLI: \`pnpm dlx shadcn add ${docsUrl}/r/${b.name}.json\`)`
  )
  .join("\n")}

${
  hooks.length > 0
    ? `## Custom Hooks

${hooks
  .map(
    (h) =>
      `- [${h.title}](${docsUrl}/r/${h.name}.json): ${h.description} (CLI: \`pnpm dlx shadcn add ${docsUrl}/r/${h.name}.json\`)`
  )
  .join("\n")}
`
    : ""
}
## Optional & Upcoming Features (Roadmap v0.2)

- [Technical Blog](${docsUrl}/blog): Articles on browser rendering, hydration, and database internals.
- [Developer Resources](${docsUrl}/resources): Curated bookmarks and developer tools.
- [Admin CMS]: Planned headless management interface powered by Neon Postgres, Drizzle ORM, and Better Auth.
`
}

buildRegistry().catch((err) => {
  console.error("Registry build failed:", err)
  process.exit(1)
})
