# Phong Phan — Dev Portfolio & UI Registry

> A pixel-perfect dev portfolio and modern component registry built natively on TanStack Start, Tailwind CSS v4, and Base UI.

## About the Author

- **Name:** Phong Phan
- **Role:** Frontend Engineer · Fullstack Capable
- **Expertise:** TanStack ecosystem, React 19, TypeScript, Design Systems, Serverless Architecture (Neon + Drizzle).
- **Website:** https://byphongphan.com
- **GitHub:** https://github.com/phongphanq089
- **LinkedIn:** www.linkedin.com/in/phong-phan-719464201
- **X (Twitter):** https://x.com/PhongPhanq089
- **Email:** phongphanq089@gmail.com

## Core Tech Stack

- **Framework:** TanStack Start (SSR / SSG, type-safe routing)
- **Styling & UI:** Tailwind CSS v4, Base UI, Motion
- **Backend (Roadmap v0.2):** Neon Postgres, Drizzle ORM, Better Auth
- **Hosting:** Netlify

## Quick Navigation

- [Home & Full Bio](https://byphongphan.com/index.md): Full raw markdown profile of Phong Phan.
- [Component Registry](https://byphongphan.com/component-ui): UI primitives, interactive cards, and responsive blocks.
- [Blocks Directory](https://byphongphan.com/blocks): Production-grade page sections and application blocks.
- [Registry Manifest](https://byphongphan.com/r/index.json): Machine-readable JSON for shadcn CLI installation.
- [Colophon](https://byphongphan.com/colophon): Architecture, design tokens, and technical stack details.
- [Technical Blog (In Development)](https://byphongphan.com/blog): Deep dives into Browser Rendering, Hydration, and Database Internals.
- [Developer Resources (In Development)](https://byphongphan.com/resources): Curated developer bookmarks, tools, and libraries.

## CLI Usage

Install components directly via shadcn CLI:

```bash
# Add using the direct manifest URL
pnpm dlx shadcn add https://byphongphan.com/r/<component-name>.json
```

Or configure custom registry in `components.json`:

```json
{
  "registries": {
    "@byphongphan": "https://byphongphan.com/r/{name}.json"
  }
}
```

Then install by name:

```bash
pnpm dlx shadcn add @byphongphan/<component-name>
```

---

## UI Components & Primitives (15)

| Component | Category | Description | Direct Install |
| :--- | :--- | :--- | :--- |
| [Line Nav](https://byphongphan.com/component-ui/navigation/line-nav) | `navigation` | Minimalist animated line navigation with spring-physics indicators, scroll-spy integration, and orientation variants. | `pnpm dlx shadcn add https://byphongphan.com/r/line-nav.json` |
| [Middle Truncation](https://byphongphan.com/component-ui/text/middle-truncation) | `text` | Canvas-measured binary search text truncation preserving the start and end of strings with responsive resize sync. | `pnpm dlx shadcn add https://byphongphan.com/r/middle-truncation.json` |
| [Card](https://byphongphan.com/component-ui/card/card) | `card` | Displays a card with header, content, and footer. | `pnpm dlx shadcn add https://byphongphan.com/r/card.json` |
| [Scroll Area](https://byphongphan.com/component-ui/data-display/scroll-area) | `data-display` | Augments native scroll functionality with auto, hover, and always visibility modes, custom variants, scrollbar gutter reserve, keyboard navigation, and high-contrast styling. | `pnpm dlx shadcn add https://byphongphan.com/r/scroll-area.json` |
| [Drawer](https://byphongphan.com/component-ui/interactive/drawer) | `interactive` | An interactive overlay and bottom sheet component powered by Base UI with swipe-to-dismiss, snap points, nested stacks, customizable positions, and inset or straight variants. | `pnpm dlx shadcn add https://byphongphan.com/r/drawer.json` |
| [Unboxing Bucket](https://byphongphan.com/component-ui/interactive/unboxing-bucket) | `interactive` | Interactive 3D unboxing container animation with emerging spring-physics feature chips. | `pnpm dlx shadcn add https://byphongphan.com/r/unboxing-bucket.json` |
| [Flip Clock](https://byphongphan.com/component-ui/interactive/flip-clock) | `interactive` | Mechanical 2D split-flap counter and clock with real-time, timer, stopwatch, and date-time display modes. | `pnpm dlx shadcn add https://byphongphan.com/r/flip-clock.json` |
| [Code Block](https://byphongphan.com/component-ui/data-display/code-block) | `data-display` | Syntax-highlighted code surface powered by Shiki with line numbers, line highlighting, collapsible blocks, diff mode, and copy actions. | `pnpm dlx shadcn add https://byphongphan.com/r/code-block.json` |
| [Map](https://byphongphan.com/component-ui/data-display/map) | `data-display` | High-performance interactive vector map powered by MapLibre GL with dark/light themes, custom markers, popups, controls, routes, arcs, GeoJSON, and clustering. | `pnpm dlx shadcn add https://byphongphan.com/r/map.json` |
| [Text Hover Effect](https://byphongphan.com/component-ui/text/text-hover-effect) | `text` | Interactive typographic SVG reveal effect that traces strokes on mount and reveals a vibrant radial gradient mask following cursor movement. | `pnpm dlx shadcn add https://byphongphan.com/r/text-hover-effect.json` |
| [Background Gradient Cursor](https://byphongphan.com/component-ui/background/background-gradient-cursor) | `background` | Interactive ambient canvas surface featuring cursor-tracking radial mask, procedural dots, dynamic grid lines, and directional linear gradients. | `pnpm dlx shadcn add https://byphongphan.com/r/background-gradient-cursor.json` |
| [Isometric Monogram Mark](https://byphongphan.com/component-ui/interactive/pp-mark-isometric) | `interactive` | Interactive 3D voxel isometric monogram mark featuring procedural diagonal hatching, wireframe edges, cursor-tracking radial flashlight, and spring press physics with audio feedback. | `pnpm dlx shadcn add https://byphongphan.com/r/pp-mark-isometric.json` |
| [Isometric Block Typography](https://byphongphan.com/component-ui/text/phong-phan-isometric) | `text` | Horizontal 3D block typography extruded along an isometric blueprint grid, equipped with interactive dynamic lighting, sound feedback, and edge-to-edge/padded layout variants. | `pnpm dlx shadcn add https://byphongphan.com/r/phong-phan-isometric.json` |
| [Spotlight Card](https://byphongphan.com/component-ui/card/spotlight-card) | `card` | Interactive surface with radial cursor spotlight illumination, dynamic 1px masked border glow, and smooth 3D tilt perspective. | `pnpm dlx shadcn add https://byphongphan.com/r/spotlight-card.json` |
| [Border Glow](https://byphongphan.com/component-ui/card/border-glow) | `card` | Interactive surface with cursor-tracking mesh gradient edge illumination, outer atmospheric aura, and entry sweep animation. | `pnpm dlx shadcn add https://byphongphan.com/r/border-glow.json` |

---

## Interactive Blocks (6)

| Block | Category | Description | Live Preview | Direct Install |
| :--- | :--- | :--- | :--- | :--- |
| [Not Found 01](https://byphongphan.com/blocks/404-page/not-found-01) | `404-page` | A 404 page with a playable brick breaker game. | [Preview](https://byphongphan.com/blocks-preview/not-found-01) | `pnpm dlx shadcn add https://byphongphan.com/r/not-found-01.json` |
| [Not Found Gravity](https://byphongphan.com/blocks/404-page/not-found-02) | `404-page` | Interactive 404 error page with 2D physics gravity, falling blocks, and draggable elements. | [Preview](https://byphongphan.com/blocks-preview/not-found-02) | `pnpm dlx shadcn add https://byphongphan.com/r/not-found-02.json` |
| [Not Found Pixel Trail](https://byphongphan.com/blocks/404-page/not-found-03) | `404-page` | Interactive 404 digital void experience featuring dynamic cursor pixel trails and terminal status diagnostics. | [Preview](https://byphongphan.com/blocks-preview/not-found-03) | `pnpm dlx shadcn add https://byphongphan.com/r/not-found-03.json` |
| [Login 01](https://byphongphan.com/blocks/auth/login-01) | `auth` | Split-screen modern authentication screen with photography hero, tracked typography, and full dark mode support. | [Preview](https://byphongphan.com/blocks-preview/login-01) | `pnpm dlx shadcn add https://byphongphan.com/r/login-01.json` |
| [Stats Cards 01](https://byphongphan.com/blocks/marketing/stats-cards-01) | `marketing` | Overlapping interactive marketing stats cards with spring physics hover, metrics showcase, and dark mode support. | [Preview](https://byphongphan.com/blocks-preview/stats-cards-01) | `pnpm dlx shadcn add https://byphongphan.com/r/stats-cards-01.json` |
| [Koi Background](https://byphongphan.com/blocks/marketing/koi-background) | `marketing` | Interactive ambient koi pond background surface featuring fluid dynamics, water caustics, multi-joint fish flocking, and mouse-feeding mechanics. | [Preview](https://byphongphan.com/blocks-preview/koi-background) | `pnpm dlx shadcn add https://byphongphan.com/r/koi-background.json` |


---

## Custom Hooks (1)

| Hook | Description | Direct Install |
| :--- | :--- | :--- |
| [useMediaQuery](https://byphongphan.com/r/use-media-query.json) | React hook for responsive design and media query listening with SSR support. | `pnpm dlx shadcn add https://byphongphan.com/r/use-media-query.json` |

---

## Technical Blog (Roadmap v0.2)

- Upcoming deep dives covering React 19 concurrent rendering, TanStack Start internals, fluid animation physics, and fullstack serverless architecture.

---

## Admin CMS & Content Platform (Roadmap v0.2)

- Serverless PostgreSQL with **Neon** + **Drizzle ORM**
- Social authentication & session management with **Better Auth**
- Cloudflare R2 / ImageKit media CDN pipeline
- Transactional notification delivery with **Resend**
