# Development Guide

## Requirements

- [Node.js](https://nodejs.org) 22+
- [pnpm](https://pnpm.io) 10+

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/phongphanq089/phong-dev-portfiolio.git
cd phong-dev-portfiolio
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in the required values:

| Variable                                        | Description                        | Required |
| ----------------------------------------------- | ---------------------------------- | -------- |
| `VITE_SITE_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL` | GitHub contributions API endpoint  | ✅       |
| `DATABASE_URL`                                  | Neon Postgres connection string    | ✅       |
| `VITE_IMAGEKIT_URL_ENDPOINT`                    | ImageKit CDN URL                   | ✅       |
| `VITE_IMAGEKIT_PUBLIC_KEY`                      | ImageKit public key                | ✅       |
| `IMAGEKIT_PRIVATE_KEY`                          | ImageKit private key (server-side) | ✅       |
| `RESEND_API_KEY`                                | Resend API key for emails          | ✅       |

> **Note:** Variables prefixed with `VITE_` are exposed to the client bundle. Never put secrets in `VITE_` variables.

### 4. Start the dev server

```bash
pnpm dev
```

The app will be available at [http://localhost:5731](http://localhost:5731).

## Scripts

| Script                | Description                                  |
| --------------------- | -------------------------------------------- |
| `pnpm dev`            | Start Vite dev server (port 5731)            |
| `pnpm build`          | Type-check + production build                |
| `pnpm preview`        | Preview production build locally             |
| `pnpm test`           | Run tests with Vitest                        |
| `pnpm lint`           | Run ESLint                                   |
| `pnpm type-check`     | TypeScript type checking (`tsc -b --noEmit`) |
| `pnpm format`         | Format with Prettier + ESLint auto-fix       |
| `pnpm check`          | Check formatting without writing             |
| `pnpm build:registry` | Build registry JSON files to `public/r/`     |

## Project Structure

```
src/
├── app/               # Layout compositions (grid-layout, profile-layout)
├── content/           # MDX documentation (component & hook docs)
│   └── components/    # Per-component .mdx files
├── entities/          # Domain objects
├── features/          # Feature modules
│   ├── home/          # Home page sections
│   ├── blocks/        # Blocks showcase
│   ├── component-ui/  # Component UI showcase
│   └── colophon/      # Colophon page
├── registry/          # Custom shadcn registry
│   ├── ui/            # UI primitives (card, select, code-block, map, etc.)
│   ├── animated/      # Animated components (flip-clock, text-hover-effect, etc.)
│   ├── block/         # Full-page blocks (editor, not-found, etc.)
│   ├── hooks/         # Registry hooks
│   ├── demos/         # Component demos
│   ├── schematics/    # Component schematics
│   └── variants/      # Component variants
├── routes/            # TanStack Router file-based routes
├── shared/            # Domain-agnostic shared code
│   ├── ui/            # UI primitives (core, animation, block, icons, system)
│   ├── hooks/         # Shared hooks (use-sound, use-media-query, etc.)
│   ├── lib/           # Utilities (sound engine, TOC parser, lazy loading)
│   ├── config/        # Site config, SEO config, constants
│   ├── providers/     # ThemeProvider
│   └── icons/         # Icon components
├── styles/            # Global CSS (Tailwind v4, OKLCH tokens, glow-card, etc.)
├── types/             # Global TypeScript definitions
└── widgets/           # Large UI compositions
    ├── command-menu/   # ⌘K command palette
    ├── profile-header/ # Site header
    └── profile-footer/ # Site footer
```

## Routes

TanStack Router file-based routing under `src/routes/`:

| Route                           | Page                                                    |
| ------------------------------- | ------------------------------------------------------- |
| `/`                             | Home (hero, about, tech stack, blocks, components, map) |
| `/blocks`                       | Blocks showcase                                         |
| `/blocks/:category/:slug`       | Individual block page                                   |
| `/component-ui`                 | UI components showcase                                  |
| `/component-ui/:category/:slug` | Individual component page                               |
| `/blog`                         | Blog (under construction)                               |
| `/resources`                    | Resources (under construction)                          |
| `/colophon`                     | Colophon (architecture, design tokens, typography)      |
| `/blocks-preview/:slug`         | Isolated full-screen block preview                      |
| `/robots.txt`                   | Dynamic robots.txt                                      |
| `/sitemap.xml`                  | Dynamic sitemap                                         |

## UI Rules

- All shared UI components must be imported from `@/shared/ui`
- Do not create duplicate components — search for existing ones first
- Use `@/shared/lib/utils` for the `cn()` utility
- Hooks go in `@/shared/hooks` (domain-agnostic) or within their feature module

## Adding shadcn Components

The project uses the [shadcn CLI](https://ui.shadcn.com/docs/cli) with custom registries configured in `components.json`:

```bash
# Add from default shadcn registry
pnpm dlx shadcn@latest add button

# Add from custom registries
pnpm dlx shadcn@latest add @soundcn/component-name
pnpm dlx shadcn@latest add @animate-ui/component-name
pnpm dlx shadcn@latest add @mapcn/component-name
```

## Building the Registry

To build the custom component registry (outputs JSON to `public/r/`):

```bash
pnpm build:registry
```

This generates installable JSON files that consumers can add via:

```bash
pnpm dlx shadcn@latest add https://phongphandev.netlify.app/r/component-name.json
```

## Deployment

The project deploys to **Netlify** via `netlify.toml`:

```toml
[build]
  command = "pnpm run build"
  publish = "dist/client"
```

Push to `main` to trigger automatic deployment.

## Code Quality

The project uses [Husky](https://typicode.github.io/husky) + lint-staged for pre-commit hooks.

Before committing, the following checks run automatically:

- **Prettier** — code formatting
- **ESLint** — linting

To run checks manually:

```bash
pnpm type-check    # TypeScript
pnpm lint          # ESLint
pnpm check         # Prettier (check only)
pnpm test          # Vitest
```
