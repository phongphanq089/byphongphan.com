<div align="center">

# Phong Phan — Portfolio & UI Registry

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ik.imagekit.io/htnacim0q/byphongphan.com/og-image.png" />
    <img alt="Phong Phan Portfolio Header Banner" src="https://ik.imagekit.io/htnacim0q/byphongphan.com/og-image.png" width="100%" />
  </picture>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](./LICENSE.md)
[![GitHub Stars](https://img.shields.io/github/stars/phongphanq089/byphongphan.com?style=flat-square&color=white&labelColor=18181b)](https://github.com/phongphanq089/byphongphan.com/stargazers)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-Fullstack_SSR-blue?style=flat-square)](https://tanstack.com/start)
[![React 19](https://img.shields.io/badge/React_19-Modern-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-OKLCH_Tokens-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_5.7-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![CI Status](https://img.shields.io/github/actions/workflow/status/phongphanq089/byphongphan.com/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/phongphanq089/byphongphan.com/actions)

<p align="center">
  A high-craft developer portfolio and production-ready <strong>shadcn-compatible UI registry</strong>.<br />
  Engineered natively with <strong>TanStack Start</strong>, <strong>React 19</strong>, <strong>Tailwind CSS v4</strong>, and micro-interactive audio feedback.
</p>

<p align="center">
  <strong><a href="https://byphongphan.com">Explore Live Demo → byphongphan.com</a></strong>
</p>

</div>

---

## 🌟 Highlights & Craftsmanship

This project is built as a testament to frontend engineering excellence, combining fluid micro-interactions, strict architecture, and modern web capabilities:

- **Acoustic Interaction Engine:** Integrated sensory audio feedback using Web Audio API and `cuelume` acoustic tokens on key interactions (mode toggles, action buttons, command menu).
- **Embedded Lo-Fi Audio Player:** A minimalist ambient music player with interactive playback controls and real-time visualizers.
- **Omnipresent ⌘K Command Palette:** High-speed, keyboard-driven navigation (`cmdk`) providing instant fuzzy search across blocks, components, pages, and external profiles.
- **Dynamic OKLCH Color Engine:** Modern color palettes configured with perceptual OKLCH tokens (`@theme inline`), paired with View Transitions API for seamless, zero-FOUC theme switching.
- **Physics & Interactive WebGL:** Realistic 2D rigid-body physics simulations powered by Matter.js (Unboxing Bucket block, Daikanoid game) alongside vector mapping via MapLibre GL.
- **AI & Agent Ready (`/llms.txt` & `/index.md`):** Standardized plain-text manifest and raw markdown endpoints automatically compiled during registry build for seamless ingestion by LLMs, Cursor, and AI agents.
- **Self-Hosted Shadcn Registry:** Distributes installable components, hooks, and full-page blocks directly into any codebase via the standard `shadcn` CLI.
- **Zero-FOUC Hydration:** Synchronous pre-render script execution preventing theme flashes across both SSR and client hydration lifecycles.
- **SEO & PWA Ready:** Pre-rendered routes, automated sitemaps, JSON-LD Structured Data (Person schema, BlogPosting), and offline-capable Service Worker caching.

---

## ⚡ Tech Stack & Architecture

Inspired by **Feature-Sliced Design (FSD)**, the codebase prioritizes unidirectional dependencies, strict TypeScript typing, and modular boundaries:

```
src/
├── app/               # Root layouts, application providers, and global error boundaries
├── content/           # MDX source content for components, hooks, and guides
├── entities/          # Domain entities & shared business data models
├── features/          # Self-contained feature slices (home, blocks, component-ui, colophon)
├── registry/          # Shadcn registry source code (ui, animated, blocks, hooks, variants)
├── routes/            # File-based routing & server functions (TanStack Router)
├── shared/            # Reusable domain-agnostic UI primitives, sound engine, and configs
├── styles/            # OKLCH tokens, global Tailwind CSS v4 variables, and utility classes
└── widgets/           # Composed sections (profile header, footer, command menu)
```

### Core Technologies

| Category               | Technology                                                                     |
| ---------------------- | ------------------------------------------------------------------------------ |
| **Framework**          | [TanStack Start](https://tanstack.com/start) (React 19 SSR & Server Functions) |
| **Routing**            | [TanStack Router](https://tanstack.com/router) (100% type-safe file routes)    |
| **Styling**            | [Tailwind CSS v4](https://tailwindcss.com) + OKLCH Design Tokens               |
| **Animation & Motion** | Motion, GSAP, Canvas 2D, and View Transitions API                              |
| **Sound & Haptics**    | Web Audio API, `cuelume`, and Web Haptics                                      |
| **Component Registry** | Custom automated shadcn builder (`scripts/build-registry.ts`)                  |
| **Hosting & Edge**     | Netlify Edge SSR                                                               |

---

## 📦 Component Registry (shadcn CLI Compatible)

All custom components, animated hooks, and block templates are packaged into standard shadcn JSON manifests under `public/r/`.

You can install any component from this portfolio directly into your own project:

```bash
# Add using the direct manifest URL
pnpm dlx shadcn@latest add https://byphongphan.com/r/line-nav.json
pnpm dlx shadcn@latest add https://byphongphan.com/r/middle-truncation.json
pnpm dlx shadcn@latest add https://byphongphan.com/r/flip-clock.json
```

Or configure the custom registry in your `components.json`:

```json
{
  "registries": {
    "@byphongphan": "https://byphongphan.com/r/{name}.json"
  }
}
```

Then install simply by name:

```bash
pnpm dlx shadcn@latest add @byphongphan/line-nav
```

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 22.0.0`
- [pnpm](https://pnpm.io/) `>= 10.0.0`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/phongphanq089/byphongphan.com.git
cd byphongphan.com

# 2. Install dependencies
pnpm install

# 3. Setup environment variables (optional for local UI development)
cp .env.example .env

# 4. Start local development server
pnpm dev
```

Visit [http://localhost:5731](http://localhost:5731) to view the live site locally.

---

## 🛠️ Verification & Quality Checks

Ensure all quality gates pass before submitting contributions:

```bash
pnpm type-check      # Strict TypeScript verification (tsc -b --noEmit)
pnpm lint            # ESLint code analysis
pnpm check           # Prettier formatting check
pnpm test            # Vitest unit test suite
pnpm build:registry  # Compile registry JSON payloads to public/r/
pnpm build           # Production SSR build verification
```

---

## 🗺️ Roadmap

- [x] **v0.1: Core Showcase & Public Registry (Current Release)**
  - [x] SSR hydration with TanStack Start & React 19
  - [x] Acoustic UI feedback engine & embedded Lo-Fi audio player
  - [x] Interactive block templates & Matter.js physics demonstrations
  - [x] Automated shadcn registry compilation pipeline
  - [x] Zero-FOUC View Transitions theme engine

- [ ] **v0.2: Full-Stack Starter & Headless Architecture (In Development)**
  - [ ] **Data Persistence:** Serverless PostgreSQL via **Neon**
  - [ ] **Authentication:** Session & OAuth management via **Better Auth**
  - [ ] **Media & Storage:** Asset pipelines powered by ImageKit and Cloudflare R2
  - [ ] **Communications:** Transactional email flows powered by Resend

---

## ⚖️ License & Brand Guidelines

- **Code & Components:** Licensed under the [MIT License](./LICENSE.md). You are free to fork, study, adapt, and use the code in personal and commercial projects.
- **Personal Brand & Likeness:** The name **Phong Phan**, personal avatar, photographs, PP monogram, and the domain **byphongphan.com** are protected assets. Please see our [Trademark & Brand Policy](./TRADEMARK.md) for complete details before publishing a fork.

---

## 👨‍💻 Author

**Phong Phan** — Frontend Engineer · UI Craftsman · Fullstack Capable

- **Website:** [byphongphan.com](https://byphongphan.com)
- **GitHub:** [@phongphanq089](https://github.com/phongphanq089)
- **LinkedIn:** [Phong Phan](https://www.linkedin.com/in/phong-phan-719464201)
- **X (Twitter):** [@PhongPhanq089](https://x.com/PhongPhanq089)
- **Email:** [phongphanq089@gmail.com](mailto:phongphanq089@gmail.com)

---

<p align="center">
  If you find this codebase inspiring or helpful, please consider giving it a <strong>star ⭐️</strong> on <a href="https://github.com/phongphanq089/byphongphan.com">GitHub</a>!
</p>
