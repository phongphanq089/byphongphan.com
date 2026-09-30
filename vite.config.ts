import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import mdx from "@mdx-js/rollup"
import netlify from "@netlify/vite-plugin-tanstack-start"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import { defineConfig, type Plugin } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isDev = process.env.NODE_ENV !== "production"

function rawMdxPlugin(): Plugin {
  return {
    name: "vite-raw-mdx",
    enforce: "pre",
    async resolveId(source, importer) {
      if (source.includes(".mdx?raw")) {
        const cleanSource = source.replace(/\?raw.*$/, "")
        const resolved = await this.resolve(cleanSource, importer, {
          skipSelf: true,
        })
        if (resolved) {
          return `\0raw-mdx:${resolved.id}`
        }
      }
    },
    load(id) {
      if (id.startsWith("\0raw-mdx:")) {
        const realPath = id.slice("\0raw-mdx:".length)
        this.addWatchFile(realPath)
        const content = fs.readFileSync(realPath, "utf-8")
        return `export default ${JSON.stringify(content)};`
      }
    },
    handleHotUpdate({ file, server, modules }) {
      if (file.endsWith(".mdx")) {
        const normalizedFile = file.replace(/\\/g, "/").toLowerCase()
        const affectedModules = [...modules]

        for (const [modId, mod] of server.moduleGraph.idToModuleMap.entries()) {
          if (
            modId.startsWith("\0raw-mdx:") &&
            modId
              .slice("\0raw-mdx:".length)
              .replace(/\\/g, "/")
              .toLowerCase() === normalizedFile
          ) {
            server.moduleGraph.invalidateModule(mod)
            affectedModules.push(mod)
          }
        }
        return affectedModules
      }
    },
  }
}

const config = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "styled-components"],
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  ssr: {
    noExternal: ["gsap", "@gsap/react", "use-sound"],
  },
  optimizeDeps: {
    include: [
      "@headless-tree/core",
      "@headless-tree/react",
      "react-resizable-panels",
      "lexical",
      "@lexical/code",
      "@lexical/code-prism",
      "@lexical/extension",
      "@lexical/html",
      "@lexical/link",
      "@lexical/list",
      "@lexical/markdown",
      "@lexical/react/LexicalAutoFocusPlugin",
      "@lexical/react/LexicalAutoLinkPlugin",
      "@lexical/react/LexicalCheckListPlugin",
      "@lexical/react/LexicalComposer",
      "@lexical/react/LexicalComposerContext",
      "@lexical/react/LexicalContentEditable",
      "@lexical/react/LexicalDraggableBlockPlugin",
      "@lexical/react/LexicalErrorBoundary",
      "@lexical/react/LexicalHistoryPlugin",
      "@lexical/react/LexicalHorizontalRuleNode",
      "@lexical/react/LexicalHorizontalRulePlugin",
      "@lexical/react/LexicalLinkPlugin",
      "@lexical/react/LexicalListPlugin",
      "@lexical/react/LexicalMarkdownShortcutPlugin",
      "@lexical/react/LexicalNestedComposer",
      "@lexical/react/LexicalOnChangePlugin",
      "@lexical/react/LexicalPlainTextPlugin",
      "@lexical/react/LexicalRichTextPlugin",
      "@lexical/react/LexicalTablePlugin",
      "@lexical/react/LexicalTypeaheadMenuPlugin",
      "@lexical/react/useLexicalEditable",
      "@lexical/react/useLexicalNodeSelection",
      "@lexical/rich-text",
      "@lexical/selection",
      "@lexical/table",
      "@lexical/utils",
      "katex",
    ],
  },
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      srcDirectory: "src",
      prerender: {
        enabled: true,
        crawlLinks: false,
        autoStaticPathsDiscovery: false,
        concurrency: 1,
      },
      pages: [
        { path: "/" },
        { path: "/blocks" },
        { path: "/blog" },
        { path: "/resources" },
        { path: "/component-ui" },
        { path: "/colophon" },
      ],
      sitemap: {
        enabled: true,
        host: "https://phong-phan-dev.netlify.app",
      },
    }),
    netlify(),
    rawMdxPlugin(),
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
    }),
    tailwindcss(),
    viteReact(),
    isDev && devtools(),
  ],
})

export default config
