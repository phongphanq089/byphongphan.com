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
        const content = fs.readFileSync(realPath, "utf-8")
        return `export default ${JSON.stringify(content)};`
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
  optimizeDeps: {
    include: ["sanity", "sanity/structure"],
  },
  ssr: {
    noExternal: ["gsap", "@gsap/react", "use-sound"],
  },
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      srcDirectory: "src",
      prerender: {
        enabled: true,
        crawlLinks: false,
        autoStaticPathsDiscovery: false,
        concurrency: 2,
        filter: ({ path }) =>
          !path.startsWith("/admin") && !path.startsWith("/studio"),
      },
      pages: [
        { path: "/" },
        { path: "/block" },
        { path: "/blog" },
        { path: "/resources" },
        { path: "/component-ui" },
        { path: "/design-system" },
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
