import fs from "node:fs"
import path from "node:path"

import { REGISTRY_ITEMS } from "../src/registry/registry"
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
      content = content.replace(/@\/registry\/ui/g, "@/components/ui")
      content = content.replace(/@\/registry\/hooks/g, "@/hooks")
      content = content.replace(/@\/shared\/hooks/g, "@/hooks")

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
    blockCategories: ["application", "marketing", "ecommerce"],
    blocks: REGISTRY_ITEMS.filter((i) => i.type === "registry:block").map(
      (i) => ({
        category: i.category,
        slug: i.name,
      })
    ),
    componentCategories: ["primitives", "animations"],
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
}

buildRegistry().catch((err) => {
  console.error("Registry build failed:", err)
  process.exit(1)
})
