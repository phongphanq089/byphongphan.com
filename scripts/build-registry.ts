import fs from "node:fs"
import path from "node:path"

import { REGISTRY_ITEMS } from "../src/registry/registry"

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
      content = content.replace(/@\/registry\/ui/g, "@/components/ui")

      return {
        path: file.path,
        content,
        type: file.type,
        target: file.target ?? `components/${file.path}`,
      }
    })

    const registryItemPayload = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies ?? [],
      devDependencies: item.dependencies ?? [],
      registryDependencies: item.registryDependencies ?? [],
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
      registryDependencies: item.registryDependencies ?? [],
    })
  }

  // Write index.json (list of all available registry components)
  const indexPath = path.join(OUTPUT_DIR, "index.json")
  fs.writeFileSync(indexPath, JSON.stringify(indexItems, null, 2), "utf-8")
  console.log(
    `\n📦 Successfully bundled ${indexItems.length} registry items to public/r/`
  )
}

buildRegistry().catch((err) => {
  console.error("Registry build failed:", err)
  process.exit(1)
})
