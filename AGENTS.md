# Portfolio App - Project Blueprint & Architecture

Welcome to **Portfolio App**, a modern, high-craft personal developer portfolio and interactive UI component/blocks showcase.

---

## 1. Tech Stack Overview

- **Core Framework:** React 19, TypeScript (5.7+ / 6), Vite 8
- **Routing:** TanStack Router (`@tanstack/react-router`, `@tanstack/react-start`) with file-based routing
- **State & Data Fetching:**
  - Zustand (client global state)
  - TanStack Query v5 (`@tanstack/react-query`) (server/cache state)
- **Styling & Design System:**
  - Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`)
  - Animations: Framer Motion (`framer-motion`, `motion`), GSAP (`gsap`, `@gsap/react`), Three.js (`three`), Paper Shaders
  - Utilities: `clsx`, `tailwind-merge`, `cva`, `tw-animate-css`
- **Headless CMS & Content:**
  - Sanity Studio v5 (`sanity`, `@sanity/client`, `@sanity/image-url`, `next-sanity`)
- **UI Primitives:** Radix UI primitives, `@base-ui/react`, `lucide-react` icons, Vaul (drawers), Cmdk
- **Forms & Validation:** Zod schemas (`zod`)

---

## 2. Directory Architecture (FSD / Layered)

The codebase is organized under `src/` following a clean, modular structure:

```text
src/
├── app/                  # Application root providers, config & initialization
├── routes/               # File-based TanStack Router definitions
│   ├── __root.tsx        # Root layout, router context & devtools
│   ├── _profile.*        # Main portfolio views (home, blog, blocks, component-ui, resources)
│   ├── studio.$.tsx      # Embedded Sanity Studio route (/studio/*)
│   └── design-system.tsx # Design system showcase route
├── widgets/              # Composite UI blocks & layout components
│   ├── profile-header/   # Site navigation header
│   ├── profile-sidebar/  # Interactive navigation sidebar
│   ├── profile-footer/   # Footer widget
│   ├── command-menu/     # Command palette (Cmd+K)
│   └── studio-layout-*/  # Studio specific layout blocks
├── features/             # Business/domain features
│   ├── home/             # Hero, introduction, showcase sections
│   ├── blog/             # Articles & blog post rendering
│   ├── blocks/           # Reusable UI blocks library & preview
│   ├── component-ui/     # Granular component catalog & code preview
│   └── resources/        # Developer curated resources & tools
├── shared/               # Reusable primitives & utilities
│   ├── ui/               # Low-level primitive components (buttons, dialogs, cards...)
│   ├── lib/              # Helpers & utilities (e.g. cn for Tailwind merge)
│   ├── hooks/            # Shared custom React hooks
│   ├── providers/        # Global context & theme providers
│   ├── config/           # Shared configurations
│   └── constants/        # Global constants
├── styles/               # Global CSS & Tailwind directives
└── sanity/               # Sanity CMS studio schemas and client configurations
```

---

## 3. Essential Commands

- `pnpm dev` : Start local Vite development server (Port 5731)
- `pnpm build` : Build for production (`vite build && tsc --noEmit`)
- `pnpm preview` : Preview production build
- `pnpm type-check` : Check TypeScript types without emitting files
- `pnpm lint` : Run ESLint checks
- `pnpm format` : Format code using Prettier and ESLint fix
- `pnpm test` : Run Vitest test suite

---

## 4. Development Guidelines & Rules

### Core UI Component Reuse Policy (MANDATORY)

- **Always Reuse Existing UI:** Check and import primitives from `@/shared/ui` (`src/shared/ui/core/`, including `Button`, `Input`, `Badge`, `Card`, `Checkbox`, `Dialog`, `Drawer`, `DropdownMenu`, `Textarea`, `Tooltip`, `Separator`, etc.).
- **Strict Prohibition:** NEVER write raw HTML controls (e.g. `<button className="...">`, `<input className="...">`) or reinvent separate styles when a core component already exists. Leverage existing `variant` and `size` props.

### Modern Component Typing Policy (MANDATORY)

- **Strict Prohibition of `React.FC`:** NEVER use `React.FC` or `React.FunctionComponent`. Always declare components using standard named functions with explicitly typed props: `export function ComponentName({ ... }: ComponentProps)`.

### Design System, Layout & Visual Consistency (MANDATORY)

- **Border Radius Synchronization:** All border radii must strictly follow design tokens (`--radius`, `rounded-lg`, `rounded-md`, `rounded-xl`, `rounded-full`). Arbitrary, one-off values (e.g. `rounded-[13px]`, `rounded-[22px]`) are strictly forbidden.
- **Button Row Height Uniformity:** All buttons situated in the same row, action bar, or button group MUST have identical heights (matching `size` props or explicit equal height classes). Staggered, uneven button heights in the same row are strictly prohibited.
- **Equal Height for Grid Cards & Blocks:** All card blocks in a grid row must maintain uniform height (`h-full`, `flex flex-col flex-1`), regardless of content length. Prevent jagged, staggered, or uneven card heights ("thụt thò"). Use `mt-auto` for card footers/actions to keep alignments flush.
- **Preserve Button & UI Color System:** Always use the existing design system color tokens and button variants (`default`, `secondary`, `outline`, `ghost`, `destructive`). Introducing arbitrary rogue colors (e.g. ad-hoc hex values, random Tailwind colors outside the palette) is strictly forbidden.
- **Reference Image Policy (Layout Only, Keep Brand Colors):** When an image or screenshot is provided as a layout reference, ONLY replicate the layout structure, wireframe hierarchy, and component arrangement. NEVER borrow colors, gradients, or themes from the reference image. Always apply the project's existing theme and color tokens.

### Language & Codebase Standards (MANDATORY)

- **Strict English Only in Code:** NEVER write Vietnamese comments, notes, docstrings, variable names, function names, or commit messages. All code, comments, logs, and UI strings must be written strictly in English.

For specific implementation requirements, refer to the modular rules in `.agents/rules/`:

- [TypeScript Strict Quality](.agents/rules/typescript.md): Zero red lines, upfront typing, no `any`, English-only code.
- [UI & Responsive Rules](.agents/rules/ui-responsive.md): Mandatory core UI reuse, border radius sync, equal button/card heights, color fidelity, reference image rules, mobile 2-column grid.
- [Code Performance & Data](.agents/rules/code-performance.md): Re-render audits, TanStack Query selectors, Zod validation.
- [Frontend Design Craft](.agents/skills/frontend-design/SKILL.md): Distinctive, production-grade UI design principles avoiding generic AI UI.
