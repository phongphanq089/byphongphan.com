# Development Guide

This guide covers everything needed to set up, build, test, and contribute to **byphongphan.com**.

---

## Prerequisites

Ensure you have the following runtime and package manager installed:

- **Node.js:** `>= 22.0.0`
- **pnpm:** `>= 10.0.0` (v11/v12 recommended)
- **Git**

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/phongphanq089/byphongphan.com.git
cd byphongphan.com
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Variables Setup (Optional)

The application works out-of-the-box with sensible defaults. To customize external endpoints, copy the example environment configuration:

```bash
cp .env.example .env
```

| Variable                                        | Scope        | Description                                | Default / Required               |
| ----------------------------------------------- | ------------ | ------------------------------------------ | -------------------------------- |
| `VITE_SITE_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL` | Client (SSR) | GitHub contributions calendar API endpoint | Optional (has built-in fallback) |

> **Note:** Zero complex setup required for local development. The project runs immediately without external database or third-party service dependencies.

### 4. Run the Development Server

```bash
pnpm dev
```

The application will be accessible at [http://localhost:5731](http://localhost:5731) with Vite Hot Module Replacement (HMR).

---

## Available Scripts

| Script                | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `pnpm dev`            | Launches Vite development server on port 5731                          |
| `pnpm build`          | Full production build: registry build + type-check + Vite SSR build    |
| `pnpm preview`        | Serves production output locally on port 5731                          |
| `pnpm test`           | Executes unit and component tests with Vitest                          |
| `pnpm lint`           | Runs ESLint across TypeScript, TSX, and configuration files            |
| `pnpm format`         | Formats code with Prettier and automatically fixes ESLint warnings     |
| `pnpm check`          | Verifies code formatting without altering files                        |
| `pnpm type-check`     | Executes strict TypeScript checking (`tsc -b --noEmit`)                |
| `pnpm build:registry` | Bundles custom shadcn registry items into `public/r/` and JSON indices |
| `pnpm dev:force`      | Forces Vite dependency re-optimization                                 |
| `pnpm clean:vite`     | Clears Vite cache directory                                            |

---

## Architectural Layout

The project follows a decoupled, domain-oriented architecture inspired by Feature-Sliced Design (FSD):

```text
src/
├── app/               # Application-level layouts, root boundaries, and composition
├── content/           # MDX documentation & editorial source materials
├── entities/          # Domain entities and business logic representations
├── features/          # High-cohesion domain features (home, blocks, component-ui, colophon)
├── registry/          # Custom shadcn component source files, schematics, and variants
│   ├── animated/      # Motion & physics-driven components (line-nav, flip-clock, etc.)
│   ├── block/         # Full-section modular blocks
│   ├── demos/         # Interactive preview sandboxes
│   ├── hooks/         # Custom registry React hooks
│   ├── ui/            # Reusable UI primitives
│   └── variants/      # Visual & functional component variants
├── routes/            # File-based routes managed by TanStack Router
├── shared/            # Pure, domain-agnostic shared modules
│   ├── config/        # Centralized configuration (site, SEO, categories, TOC)
│   ├── hooks/         # Reusable utility hooks
│   ├── lib/           # Deterministic helper functions & utilities (cn, sound-engine)
│   ├── providers/     # Theme and context providers
│   └── ui/            # Primitive UI design system elements
├── styles/            # OKLCH design tokens, Tailwind CSS v4 setup, global animations
└── widgets/           # Multi-feature UI sections (header, footer, command-menu)
```

---

## Working with the Component Registry

This project acts as an official **shadcn registry provider**. Custom components and blocks can be installed into any React application using the standard `shadcn` CLI.

### Building Registry Artifacts

Whenever you modify or add items in `src/registry/`, rebuild the public distribution files:

```bash
pnpm build:registry
```

This compiles:

- `public/r/{component-name}.json` — Individual installable payloads
- `public/r/index.json` — Indexed directory of available components
- `registry.json` (root & public) — Registry master metadata schema
- `src/registry/manifest.json` — Static prerender paths for TanStack Start

### Installing Components in Downstream Projects

Consumers can install your components directly with:

```bash
pnpm dlx shadcn@latest add https://byphongphan.com/r/{component-name}.json
```

Or configure `@byphongphan` in their `components.json`:

```json
{
  "registries": {
    "@byphongphan": "https://byphongphan.com/r/{name}.json"
  }
}
```

Then install by name:

```bash
pnpm dlx shadcn@latest add @byphongphan/line-nav
```

---

## Quality Standards & CI

All pull requests must pass the automated CI pipeline:

1. **TypeScript Type Safety:** Run `pnpm type-check` with zero errors.
2. **Linting & Formatting:** Adhere to ESLint and Prettier rules (`pnpm lint`).
3. **Commit Convention:** Use Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
4. **Pre-commit Hooks:** Managed via Husky and lint-staged on every git commit.

---

## Deployment

Production deployments are automated via **Netlify** on push to the `main` branch.

- **Adapter:** `@netlify/vite-plugin-tanstack-start`
- **Output:** Client assets in `dist/client`, Server functions in `.netlify/functions-internal`
- **Domain:** [https://byphongphan.com](https://byphongphan.com)
