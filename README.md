# [phongphandev.netlify.app](https://phongphandev.netlify.app)

<p>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://ik.imagekit.io/htnacim0q/byphongphan.com/README-1.jpg" /><img alt="header" src="https://ik.imagekit.io/htnacim0q/byphongphan.com/README-1.jpg" /></picture>
</p>

<p>
  <a href="https://github.com/phongphanq089/phong-dev-portfiolio"><img alt="license" src="https://img.shields.io/github/license/phongphanq089/phong-dev-portfiolio?style=flat-square" /></a>
  <img alt="GitHub Stars" src="https://img.shields.io/github/stars/phongphanq089/phong-dev-portfiolio?style=flat-square" />
</p>

A pixel-perfect dev portfolio and shadcn registry showcasing my work as a Frontend Engineer — featuring interactive 3D isometric typography, 2D physics, WebGL shaders, vector maps, a custom sound engine, and a full-featured Lexical rich text editor.

→ Live site: [phongphandev.netlify.app](https://phongphandev.netlify.app)

![screenshot](https://ik.imagekit.io/htnacim0q/byphongphan.com/README-2.png)

## Overview

### Stack

- React 19
- TanStack Start + TanStack Router
- TanStack Query v5
- Vite 8
- Tailwind CSS v4 (OKLCH tokens)
- shadcn/ui + Radix UI
- Netlify (deploy & SSR adapter)
- TypeScript

### Interactive & Animation Engines

- [Motion](https://motion.dev) (Framer Motion) — spring physics, layout animations
- [GSAP](https://gsap.com) — timeline-based animations
- [Matter.js](https://brm.io/matter-js) — 2D physics (gravity, draggable blocks)
- [Three.js](https://threejs.org) + WebGL shaders — canvas effects
- Custom Web Audio sound engine — audio feedback & lofi music toggle

### Featured

- Clean & modern blueprint-themed design
- Light/Dark themes
- 3D isometric block typography with dynamic lighting & sound
- Interactive Vietnam vector map ([MapLibre GL](https://maplibre.org))
- 2D physics sandbox (Matter.js gravity simulation)
- Command menu (⌘K)
- Web Audio sound engine with haptic feedback
- Floating dynamic dock with scroll progress & TOC minimap
- Code gutter numbers simulation
- vCard integration
- SEO optimized ([JSON-LD schema](https://json-ld.org), sitemap, robots)
- Dynamic OG image generation
- Installable as PWA (custom service worker)
- Colophon page (architecture, design tokens, typography specimens)

### Content

Centralized document system powered by MDX:

- Unified content layer for component & hook docs
- Category-based content organization
- Syntax highlighting with [Shiki](https://shiki.style) + rehype-pretty-code
- Dynamic OG images for rich link previews

### Registry

Custom registry powered by the [shadcn CLI](https://ui.shadcn.com/docs/cli) with a build system (`scripts/build-registry.ts`) that outputs installable JSON to `public/r/`.

Each entry is well-documented and includes:

- Live preview & code snippets
- Beautiful, readable code blocks
- One-click command blocks (pnpm, npm, yarn, bun)

#### UI Primitives

| Component         | Description                                                                   |
| ----------------- | ----------------------------------------------------------------------------- |
| Card              | Card with header, content, and footer                                         |
| Select            | Radix-powered select with search                                              |
| Code Block        | Shiki syntax highlighting with line numbers, diff mode, copy actions          |
| Map               | Interactive vector map with MapLibre GL (themes, markers, routes, clustering) |
| Middle Truncation | Canvas-measured binary search text truncation                                 |

#### Animated Components

| Component                  | Description                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| Flip Clock                 | Mechanical split-flap counter with real-time, timer, stopwatch modes |
| Unboxing Bucket            | 3D unboxing animation with spring-physics feature chips              |
| Text Hover Effect          | SVG stroke reveal with radial gradient cursor tracking               |
| Background Gradient Cursor | Cursor-tracking canvas with procedural dots & grid                   |
| Isometric Block Typography | 3D extruded text on blueprint grid with dynamic lighting             |
| Isometric Monogram Mark    | 3D voxel monogram with hatching, wireframe & flashlight              |

#### Blocks

| Block             | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| Not Found 01      | 404 page with a playable brick breaker game                          |
| Not Found Gravity | 404 page with Matter.js 2D physics & draggable blocks                |
| Rich Text Editor  | Full Lexical editor with toolbar, slash commands, Excalidraw, embeds |

#### Hooks

| Hook          | Description                                      |
| ------------- | ------------------------------------------------ |
| useMediaQuery | Responsive media query listener with SSR support |

## Development

Please refer to the [Development Guide](./DEVELOPMENT.md) for more details.

### Quick Start

```bash
pnpm install
pnpm dev
```

### Available Scripts

| Script                | Description                            |
| --------------------- | -------------------------------------- |
| `pnpm dev`            | Start dev server with Vite (port 5731) |
| `pnpm build`          | Type-check & production build          |
| `pnpm preview`        | Preview production build               |
| `pnpm test`           | Run tests with Vitest                  |
| `pnpm lint`           | Run ESLint                             |
| `pnpm type-check`     | Run TypeScript type checking           |
| `pnpm format`         | Format with Prettier + ESLint fix      |
| `pnpm build:registry` | Build registry JSON to `public/r/`     |

## Project Structure

```
src/
├── app/           # Layout compositions (grid-layout, profile-layout)
├── content/       # MDX content (component & hook documentation)
├── entities/      # Domain objects
├── features/      # Feature modules (home, blocks, component-ui, colophon)
├── registry/      # Custom shadcn registry (components, hooks, blocks, demos)
├── routes/        # TanStack Router file-based routes
├── shared/        # Shared UI, hooks, lib, config, constants, icons, providers
├── styles/        # Global styles (Tailwind v4, OKLCH tokens)
├── types/         # Global TypeScript definitions
└── widgets/       # UI compositions (command-menu, profile-header, profile-footer)
```

## License

Everything in this repository is licensed under the [MIT license](./LICENSE.md), with one exception: my name and my logo, which are covered by the [trademark and brand policy](./TRADEMARK.md).

The code and the writing are yours. Fork it, copy it, quote it, translate it. Just make sure to <ins>remove all my personal information</ins> and swap the branding before publishing your website.

## Author

**Phong Phan** — Frontend Engineer · Fullstack Capable

- Website: [phongphandev.netlify.app](https://phongphandev.netlify.app)
- GitHub: [@phongphanq089](https://github.com/phongphanq089)
- LinkedIn: [Phong Phan](https://www.linkedin.com/in/phong-phan-719464201)
- X: [@PhongPhanq089](https://x.com/PhongPhanq089)
