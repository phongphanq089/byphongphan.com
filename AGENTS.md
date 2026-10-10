# AGENTS.md

## 1. Purpose

This file defines the engineering, architecture, UI, TypeScript, accessibility, and AI coding rules for this project.

These rules are intentionally framework-agnostic where possible.

The actual project structure and existing implementation always take priority over assumptions or theoretical architecture.

---

# 2. Core Principles

## 2.1 Inspect Before Modifying

Before creating or modifying code:

1. Inspect the relevant directory.
2. Inspect nearby components and modules.
3. Search for existing reusable components, hooks, utilities, types, schemas, and API functions.
4. Identify the project's established patterns.
5. Identify the correct owner/layer for the new code.
6. Follow the existing architecture and naming conventions.

Do not invent APIs, hooks, components, configuration, directories, or technologies that are not present.

If the existing code already solves the problem, reuse it.

---

## 2.2 Reuse Before Rebuilding

Before creating a new abstraction, search the codebase for an existing implementation.

Prefer:

```text
existing component
        ↓
existing variant
        ↓
existing utility
        ↓
existing hook
        ↓
existing abstraction
        ↓
new implementation
```

Do not duplicate functionality that already exists.

If an existing component is close but insufficient, extend it carefully when that is simpler and consistent with the project.

Do not create abstractions merely for theoretical cleanliness.

---

## 2.3 Minimal Change

When implementing a task:

- Change only what is necessary.
- Preserve existing behavior unless the task explicitly requires changing it.
- Do not refactor unrelated code.
- Do not rename unrelated files.
- Do not reorganize directories without a clear reason.
- Do not introduce dependencies unless they provide meaningful value.
- Keep the implementation as small as reasonably possible.

A small, correct change is preferable to a large architectural rewrite.

---

## 2.4 Resolve Uncertainty by Inspecting the Code

Do not guess when the repository can answer the question.

If it is unclear:

- where code belongs,
- which component to use,
- which API exists,
- which state-management pattern is used,
- which styling convention is expected,
- or which command should be run,

inspect the relevant project files first.

---

# 3. Project-Specific Rules

This section should describe facts about the actual project rather than generic architecture.

When maintaining this file, document confirmed project choices here.

Example:

```md
## Stack

- Framework: ...
- Language: TypeScript
- Package manager: ...
- UI library: ...
- Styling: ...
- Client state: ...
- Server state: ...
- Validation: ...
```

Do not add technologies here unless they actually exist in the project.

If the project uses a specific library or pattern, follow that implementation instead of providing multiple hypothetical alternatives.

---

# 4. Architecture

The project may follow a layered architecture inspired by Feature-Sliced Design.

Use only the layers that the project actually needs.

Typical structure:

```text
src/
├── app/
├── routes/
├── pages/
├── widgets/
├── features/
├── entities/
├── shared/
├── content/
└── styles/
```

Do not create empty architectural layers just to satisfy this document.

Architecture should reflect actual ownership and dependencies, not folder names alone.

---

# 5. Layer Responsibilities

## 5.1 `app/`

Application-level initialization and composition.

Typical responsibilities:

- global providers
- root layouts
- application initialization
- global configuration
- global error boundaries
- theme setup

Do not place domain-specific business logic here.

---

## 5.2 `routes/`

Routing infrastructure.

Typical responsibilities:

- route definitions
- route loaders
- route-level metadata
- route guards
- framework-specific route configuration

Routes should primarily compose existing application modules.

Keep route files thin.

Prefer:

```tsx
export const Route = createFileRoute("/products")({
  component: ProductsPage,
})
```

over putting a large page implementation directly inside the route.

---

## 5.3 `pages/`

Page-level composition.

Use this layer when the framework/project benefits from separating page composition from routing.

A page should primarily compose:

```text
widgets
features
entities
shared
```

Do not use pages as dumping grounds for reusable business logic.

If the framework already treats route components as pages, a separate `pages/` layer is optional.

---

## 5.4 `widgets/`

Large reusable UI compositions.

A widget combines multiple pieces into a meaningful UI section.

Examples:

```text
site-header/
site-footer/
command-menu/
dashboard-sidebar/
product-overview/
```

Widgets may depend on:

```text
features
entities
shared
```

Do not put unrelated application-wide logic in widgets.

---

## 5.5 `features/`

User-facing capabilities or domain actions.

A feature represents something the user can do or interact with.

Examples:

```text
authentication/
product-search/
product-filter/
product-editor/
media-upload/
theme-switcher/
```

A feature may contain:

```text
components/
hooks/
actions/
schemas/
types/
utils/
api/
```

depending on the project's needs.

Do not turn `features/` into a generic "everything else" directory.

---

## 5.6 `entities/`

Domain objects or business concepts.

Examples:

```text
user/
product/
category/
order/
article/
```

An entity may contain:

```text
model/
ui/
api/
lib/
types/
```

Only use this layer when the application has meaningful domain entities.

For small applications, portfolios, or landing pages, `entities/` may not be necessary.

---

## 5.7 `shared/`

Reusable, domain-agnostic building blocks.

Typical structure:

```text
shared/
├── ui/
├── hooks/
├── lib/
├── config/
├── constants/
├── providers/
└── icons/
```

Shared code must not depend on application-specific features or business domains.

Good:

```text
shared/ui/button
shared/lib/cn
shared/hooks/use-media-query
```

Bad:

```text
shared/ui/product-card
shared/lib/product-pricing
shared/hooks/use-product-editor
```

If code knows about a business domain, it probably does not belong in `shared`.

---

## 5.8 `content/`

Static or editorial content.

Use for things such as:

- MDX
- documentation
- articles
- static examples
- page content
- structured editorial data

Do not put application logic inside content files.

---

## 5.9 `styles/`

Global application styling.

Typical responsibilities:

- global CSS
- Tailwind entry files
- CSS variables
- global animations
- framework-specific global styles

Keep component-specific styles close to the component when the project's styling strategy allows it.

---

# 6. Dependency Direction

Prefer the following dependency direction:

```text
routes
  ↓
pages
  ↓
widgets
  ↓
features
  ↓
entities
  ↓
shared
```

Lower layers must remain independent from higher layers.

Forbidden examples:

```text
shared   → features
shared   → widgets
shared   → pages
shared   → routes

entities → features
entities → widgets
entities → pages
entities → routes

features → widgets
features → pages
features → routes
```

Higher layers may compose lower layers.

Avoid circular dependencies.

If two modules need each other, reconsider ownership instead of creating a circular dependency.

---

# 7. Components

Use three broad categories.

## 7.1 Primitive Components

Small, reusable, domain-agnostic components.

Examples:

```text
Button
Input
Dialog
Card
Badge
Tabs
Tooltip
Separator
```

These normally belong in:

```text
shared/ui/
```

when such a layer exists.

---

## 7.2 Composite Components

Components that combine primitives for a specific interface purpose.

Examples:

```text
SearchBar
UserMenu
DataTable
FilterBar
ProfileHeader
```

Place them in `features/` or `widgets/` according to ownership and scope.

---

## 7.3 Domain Components

Components that understand a specific business/domain concept.

Examples:

```text
ProductCard
OrderSummary
ProductVariantSelector
ArticleCard
```

Do not place domain-specific components in generic shared UI.

---

# 8. UI and Design System

## 8.1 Reuse Existing UI

Before creating a UI primitive:

1. Check `shared/ui/` or the project's existing design-system location.
2. Check whether an existing component has the required variant.
3. Extend the existing component when appropriate.

Prefer:

```tsx
<Button variant="outline" size="sm">
  Edit
</Button>
```

over creating another button implementation.

---

## 8.2 Native HTML Is Allowed

Do not create abstractions for their own sake.

Native HTML is appropriate when:

- no suitable abstraction exists,
- semantic HTML is preferable,
- browser-native behavior is required,
- accessibility benefits from the native element,
- the element is highly specialized,
- an abstraction would add unnecessary complexity.

Examples:

```tsx
<button />
<input />
<select />
<a />
```

When the project already provides a suitable primitive, prefer that primitive.

---

## 8.3 Design Tokens

Use existing project design tokens for:

- colors
- spacing
- typography
- radii
- shadows
- breakpoints
- animation values

Prefer semantic tokens such as:

```text
bg-background
bg-card
text-foreground
text-muted-foreground
border-border
```

Avoid arbitrary values when an existing token already provides the intended result.

Do not copy colors, typography, gradients, or branding from reference screenshots unless explicitly requested.

If a genuinely new design value is required, introduce it consistently as a design token when appropriate.

---

## 8.4 Layout

For related cards or repeated UI:

- use consistent spacing,
- consider equal heights when it improves alignment,
- do not force equal heights when it makes the design unnatural.

For button groups, maintain consistent:

- height
- alignment
- spacing

Use existing size variants whenever available.

---

## 8.5 Responsive Design

Responsive behavior must be intentional.

Choose layouts based on:

- content density
- interaction requirements
- readability
- available width
- touch targets
- visual hierarchy

Possible mobile patterns include:

```text
1 column
2 columns
horizontal scroll
stacked sections
adaptive grid
```

Do not assume every grid needs the same column count.

---

# 9. Accessibility

Accessibility is part of implementation quality.

Consider:

- semantic HTML
- keyboard navigation
- focus states
- accessible labels
- button semantics
- form labels
- sufficient contrast
- reduced motion
- screen-reader behavior

Do not use clickable `<div>` elements when `<button>` or `<a>` is appropriate.

Interactive elements must have meaningful accessible names.

Images should have appropriate `alt` text unless they are purely decorative.

---

# 10. TypeScript

## 10.1 Strict Typing

Prefer explicit and meaningful types.

Avoid:

```ts
any
```

Do not use `any` merely to silence TypeScript errors.

Use:

```ts
unknown
```

when the type is genuinely unknown, then narrow it appropriately.

---

## 10.2 Component Props

Do not use `React.FC` by default.

Prefer:

```tsx
type ComponentProps = {
  title: string
}

export function Component({ title }: ComponentProps) {
  return <div>{title}</div>
}
```

---

## 10.3 Avoid Over-Typing

Do not create complex generic types for simple problems.

Optimize for:

```text
type safety
+
readability
+
maintainability
```

not maximum type complexity.

---

# 11. Naming

Use descriptive names.

Prefer:

```text
ProductCard
ProductFilters
useProductFilters
product-filter.schema.ts
product.types.ts
```

Avoid vague names such as:

```text
Thing
Helper
Stuff
Common
Misc
Utils2
NewComponent
```

Follow the existing project's file naming convention.

Do not rename existing files simply to enforce a personal preference.

---

# 12. Hooks and Utilities

## Hooks

Hooks should have one clear responsibility.

Good:

```text
useMediaQuery
useCopyToClipboard
useProductFilters
useCommandMenu
```

Avoid hooks that become containers for unrelated logic.

Shared hooks must remain domain-agnostic.

Domain-specific hooks should live with their feature/entity.

## Utilities

Utilities should be:

- focused
- reusable
- deterministic where possible
- domain-agnostic when placed in `shared`

Avoid dumping unrelated functions into:

```text
utils.ts
helpers.ts
common.ts
```

Prefer focused modules:

```text
format-date.ts
parse-url.ts
cn.ts
calculate-total.ts
```

---

# 13. State Management

Use the smallest appropriate state scope.

Prefer:

```text
local component state
        ↓
feature state
        ↓
shared/global state
```

Do not put local UI state into global state unnecessarily.

Examples of local state:

```text
modal open/closed
selected tab
input value
hover state
temporary UI state
```

Global state should contain only genuinely shared client state.

---

# 14. Server State and Async Data

If the project uses a server-state library such as TanStack Query, treat server data as server state.

Prefer:

```text
TanStack Query
→ fetching
→ caching
→ invalidation
→ synchronization
```

and:

```text
Zustand / local state
→ client-only state
```

Do not duplicate server state into a global client store without a specific reason.

Keep data access close to the feature/entity that owns it.

Avoid a single global `api.ts` file when the application becomes large.

---

# 15. Forms and Validation

Use the project's established form and validation approach.

Prefer:

```text
schema
  ↓
validation
  ↓
typed data
  ↓
mutation
```

Reusable validation schemas should represent actual domain rules.

Client-side validation improves UX.

Server-side validation remains authoritative for backend-enforced rules.

---

# 16. Loading, Error, and Empty States

Every asynchronous UI should consider:

```text
loading
success
empty
error
```

Do not treat an empty result as an error.

Do not show a blank screen while an operation is loading or has failed.

Reuse existing project components such as:

```text
Skeleton
Spinner
EmptyState
ErrorState
```

when available.

---

# 17. Error Handling

Handle errors at appropriate boundaries:

```text
application
route
feature
component
```

depending on the framework and use case.

Do not silently swallow errors.

Avoid:

```ts
try {
  ...
} catch {
  return null;
}
```

unless silently ignoring the error is explicitly intended.

---

# 18. Performance

Optimize based on evidence, not assumptions.

Avoid premature optimization.

Consider:

- unnecessary re-renders
- expensive calculations
- large lists
- image loading
- bundle size
- unnecessary network requests
- repeated data transformations

Use lazy loading for genuinely heavy or rarely used modules when appropriate.

Do not add memoization or complex caching without a real performance reason.

---

# 19. Animation

Animation should support hierarchy and interaction.

Good uses include:

```text
subtle entrance
feedback
transition
progressive disclosure
spatial continuity
```

Avoid animation that:

- delays interaction
- creates visual noise
- runs continuously without purpose
- harms accessibility

Respect reduced-motion preferences where appropriate.

Do not add animation merely because an animation library is installed.

---

# 20. Content, Config, and Constants

Keep these concepts separate.

Use:

```text
config/
```

for application configuration.

Use:

```text
constants/
```

for stable application constants.

Use:

```text
content/
```

for user-facing or editorial content.

Do not mix application logic into content files.

---

# 21. Optional Capabilities

Do not assume the project contains optional systems such as:

```text
registry/
CMS/
Sanity/
MDX
authentication/
admin/
API/
database/
analytics/
```

Only use or create rules for these systems when they actually exist.

If a component registry exists, it is a project-specific capability, not the source of truth for the application's architecture.

The registry should consume reusable components when appropriate.

Unrelated application code must not depend on the registry merely because it exists.

---

# 22. Generated Code

Do not manually edit generated files unless the project explicitly requires it.

Examples:

```text
routeTree.gen.ts
generated API clients
generated schemas
codegen output
```

Modify the source/configuration that generates the file instead.

---

# 23. Testing

Tests should focus on behavior and meaningful regressions.

Prioritize:

- critical business logic
- complex utilities
- data transformations
- important user interactions
- high-risk features

Prefer testing:

```text
what the user experiences
```

over:

```text
how the component happens to be implemented
```

Do not create tests that merely duplicate implementation details.

---

# 24. Security

Never expose secrets in client-side code.

Never commit:

```text
API keys
private tokens
database credentials
service credentials
private secrets
```

Use environment variables and appropriate server-side boundaries.

Never trust client-side validation for authorization or security decisions.

---

# 25. Dependencies

Before adding a dependency:

1. Check whether the functionality already exists.
2. Check whether the project already has an equivalent library.
3. Consider bundle size.
4. Consider maintenance.
5. Confirm that the dependency solves a meaningful problem.

Do not add a dependency for trivial functionality.

---

# 26. Comments and Language

All source-code comments, documentation comments, identifiers, and developer-facing messages should use English.

Avoid:

```ts
const danhSachSanPham = []
```

Prefer:

```ts
const products = []
```

User-facing content may use any language required by the product.

The English-only rule applies to the codebase, not end-user content.

Comments should explain **why**, not merely restate **what** the code does.

---

# 27. Code Style

Use clear, readable, modern TypeScript.

Prefer named functions for React components:

```tsx
type Props = {
  title: string
}

export function Example({ title }: Props) {
  return <div>{title}</div>
}
```

Prefer early returns when they improve readability.

Avoid deeply nested conditional rendering.

Prefer descriptive variable names.

Do not add comments that merely repeat obvious code.

---

# 28. AI Coding Agent Workflow

For every task, follow this workflow.

## Step 1 — Understand

Read the task carefully.

Identify:

- requested behavior
- affected area
- constraints
- existing related code

Do not start coding immediately when the repository can answer important questions first.

## Step 2 — Inspect

Inspect:

- relevant routes
- nearby components
- existing UI primitives
- hooks
- utilities
- types
- schemas
- API/data layer
- design tokens
- state-management patterns
- related features

## Step 3 — Identify Ownership

Determine whether the code belongs in:

```text
app
route
page
widget
feature
entity
shared
content
```

Use the smallest appropriate scope.

## Step 4 — Reuse

Search for existing:

```text
components
variants
hooks
utilities
schemas
types
API functions
styles
```

Reuse them when practical.

## Step 5 — Implement

Make the smallest coherent change.

Do not perform unrelated refactoring.

Do not introduce new architecture unless the existing architecture cannot reasonably support the requirement.

## Step 6 — Verify

Run only checks that actually exist in the project.

Typical checks may include:

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

Do not assume these scripts exist.

Also verify, when relevant:

- responsive behavior
- accessibility
- loading state
- error state
- empty state
- affected user interactions

## Step 7 — Review

Before finishing, verify:

- Did I reuse existing functionality?
- Is the code in the correct layer?
- Did I introduce unnecessary dependencies?
- Did I create unnecessary abstractions?
- Did I introduce arbitrary design values?
- Did I create unnecessary global state?
- Did I break responsive behavior?
- Did I leave unrelated code changed?
- Did I preserve existing behavior?

---

# 29. AI Agent Non-Negotiable Rules

When modifying this codebase, the agent MUST:

1. Inspect existing patterns before creating new ones.
2. Reuse existing components whenever practical.
3. Follow the actual project structure.
4. Never assume optional technologies or directories exist.
5. Never invent APIs, hooks, components, or configuration.
6. Avoid unrelated refactoring.
7. Preserve existing behavior unless explicitly asked to change it.
8. Prefer the smallest maintainable implementation.
9. Keep TypeScript strongly typed.
10. Follow existing naming conventions.
11. Respect accessibility.
12. Respect responsive behavior.
13. Use existing design tokens.
14. Avoid arbitrary styling values when tokens exist.
15. Keep route files focused on routing/composition.
16. Keep shared code domain-agnostic.
17. Keep business logic out of generic UI primitives.
18. Keep global state limited to genuinely global client state.
19. Treat server state according to the project's established server-state pattern.
20. Do not create abstractions merely because they appear architecturally elegant.
21. Verify the result using available project checks.

---

# 30. Final Architectural Principle

Architecture exists to make the codebase easier to understand, maintain, and change.

Do not follow folder names mechanically.

Always ask:

> Who owns this code, and who should be allowed to depend on it?

If ownership is unclear, inspect related code before introducing another abstraction.

Prefer:

```text
clear ownership
+
simple dependencies
+
reusable primitives
+
small features
+
thin routes
```

over:

```text
maximum folder structure
+
maximum abstraction
+
maximum configuration
```

A simple architecture that remains consistent is better than a theoretically perfect architecture that becomes difficult to maintain.
