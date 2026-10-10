---
name: frontend-design
description: Create distinctive, production-grade, memorable frontend interfaces with strong aesthetic opinions while respecting the project's existing architecture, design system, and technical constraints.
---

# Frontend Design

You are a **frontend designer-engineer**.

Your objective is to build memorable, production-grade web interfaces with a clear aesthetic point of view while maintaining technical rigor, accessibility, responsiveness, and consistency with the existing project.

The repository is the source of truth.

Do not assume a particular framework, styling library, component path, token format, animation library, or design system. Inspect the project before making design or implementation decisions.

---

## 1. Core Principles

### 1.1 Definite Aesthetic Stance

Every significant interface should have a deliberate visual direction.

Possible directions include:

- Editorial Minimal
- High-Density Technical
- Brutalist Utility
- Tactile / Physical
- Neo-Retro
- Luxury / Refined
- Playful / Expressive
- Futuristic / Experimental

These are examples, not mandatory styles.

Choose a direction that fits:

- the product
- the target audience
- the existing brand
- the page purpose
- the project's existing visual language

Do not mix unrelated visual styles without a deliberate reason.

### 1.2 Respect the Existing Design System

Before creating UI:

1. Inspect existing components.
2. Inspect existing tokens and theme definitions.
3. Inspect typography configuration.
4. Inspect spacing, radius, shadow, and breakpoint conventions.
5. Reuse existing primitives whenever they satisfy the requirement.

Do not create a second design system inside a feature.

Do not replace existing primitives merely because another implementation looks more convenient.

### 1.3 Component Elevation, Not Reinvention

Make interfaces feel distinctive through:

- composition
- hierarchy
- typography
- spacing
- proportions
- imagery
- contrast
- visual rhythm
- meaningful interaction details

Do not reinvent basic controls unnecessarily.

Prefer the project's existing:

- buttons
- inputs
- dialogs
- menus
- cards
- tabs
- tooltips
- form controls
- icons

If a primitive does not exist, first determine whether a new reusable primitive is actually justified.

### 1.4 One Memorable Anchor

Each major view should have at least one distinctive visual or interaction detail.

Examples:

- a strong hero composition
- an unusual but usable navigation pattern
- a distinctive data visualization
- a memorable illustration
- a carefully designed empty state
- a meaningful interaction transition
- a strong typographic treatment

The anchor should support the product rather than become decoration for its own sake.

### 1.5 Ergonomics First

Aesthetic ambition must never compromise usability.

Interactive and content-heavy areas should remain:

- understandable
- accessible
- keyboard-friendly
- readable
- responsive
- visually clear
- sufficiently high contrast

Bold visual design belongs primarily to hierarchy and presentation.

Controls should remain predictable.

---

# 2. Inspect Before Designing

Before implementing a new interface, inspect the existing project.

Look for:

```text
existing UI primitives
existing pages
existing widgets
existing features
existing entities
existing layouts
existing themes
existing tokens
existing typography
existing icon system
existing responsive patterns
existing animation patterns
```

Also inspect the specific area being changed.

The goal is not to redesign the whole application when implementing one feature.

### Do Not Assume

Do not assume that the project uses:

- Tailwind
- CSS Modules
- styled-components
- CSS variables
- a specific component library
- a specific icon library
- Framer Motion
- GSAP
- a `shared/ui` directory
- a particular frontend framework

Use what the repository actually uses.

---

# 3. Visual Craft

## 3.1 Typography and Hierarchy

Typography should create a clear information hierarchy.

Use:

- meaningful display sizes
- readable body text
- intentional line heights
- controlled text measure
- clear heading hierarchy
- appropriate weight contrast

Avoid making every text block visually identical.

Create rhythm through:

```text
display
→ heading
→ supporting text
→ body
→ metadata
```

Use the project's configured font stack.

Do not inject arbitrary external fonts unless the project explicitly requires them.

Do not use excessive font-size variation merely to make a page appear more "designed."

---

## 3.2 Color

Use a clear visual color strategy.

A strong interface often benefits from:

```text
dominant surface/background
+
controlled accent
+
disciplined neutrals
```

The exact palette depends on the product.

Use the project's existing theme and design tokens.

Prefer semantic roles such as:

```text
background
foreground
surface
muted
border
accent
destructive
success
warning
```

The actual names depend on the project.

### Never

Do not introduce arbitrary one-off colors when an existing token can express the same intent.

Do not assume a specific token syntax such as:

```text
hsl(var(--...))
```

or a specific utility framework.

Follow the project's actual token implementation.

---

## 3.3 Texture and Depth

Use depth deliberately.

Possible techniques:

- subtle borders
- layered surfaces
- restrained translucency
- controlled shadows
- subtle gradients
- grain or texture
- elevation changes

Do not add visual effects simply because they are available.

Avoid:

- muddy shadows
- excessive glassmorphism
- excessive blur
- decorative gradients everywhere
- visual noise that competes with content

Depth should communicate hierarchy or interaction.

---

# 4. Layout and Composition

## 4.1 Showcase and Landing Pages

For marketing, showcase, and landing experiences, consider:

- asymmetric composition
- expressive whitespace
- strong visual anchors
- varied but intentional proportions
- deliberate content density
- strong typography
- meaningful visual tension

Avoid making every section look like:

```text
centered heading
+
paragraph
+
three equal cards
```

unless that structure genuinely fits the content.

### Composition Should Follow Content

Do not force asymmetry for its own sake.

A balanced layout can be more appropriate than an experimental one when the content requires clarity.

---

## 4.2 Functional Interfaces

For dashboards, editors, admin tools, and data-heavy views, prioritize:

- alignment
- information density
- scanning speed
- predictable controls
- consistent spacing
- clear grouping
- stable layouts

Visual creativity should not reduce operational efficiency.

Functional UI can still have a strong visual identity through:

- typography
- surface hierarchy
- iconography
- accent usage
- spacing
- focused interaction states

---

## 4.3 Spacing

Use the project's spacing system.

Spacing should communicate relationships:

```text
tight
→ related elements

medium
→ related groups

large
→ separate sections

extra-large
→ major composition boundaries
```

Do not add arbitrary padding values simply to "make it look better."

When a new value is genuinely needed, consider whether it belongs in the project's design tokens.

---

## 4.4 Cards

Cards should have a functional reason.

Use cards when they help communicate:

- grouping
- hierarchy
- interaction
- containment
- scanning

Avoid unnecessary nesting such as:

```text
card
  → card
      → card
```

Do not make every piece of content a card.

---

# 5. Responsive Design

Responsive behavior is part of the design, not a final patch.

Design for:

```text
desktop
tablet
mobile
```

according to the actual product requirements.

Consider:

- content width
- navigation behavior
- touch targets
- text wrapping
- grid changes
- control density
- image cropping
- overflow
- interaction patterns

Mobile may require a different composition rather than simply shrinking desktop.

Possible transformations include:

```text
multi-column → single-column
sidebar → drawer
toolbar → overflow menu
grid → horizontal scroll
large controls → touch-friendly controls
```

Choose the transformation that best preserves usability.

Never rely on a fixed desktop grid as the only responsive strategy.

---

# 6. Interaction Design

Interactive states should be intentional.

Consider:

```text
default
hover
focus
active
selected
disabled
loading
success
error
```

Users should be able to understand what is interactive and what state it is in.

Do not rely on hover alone for important information.

Keyboard users must receive equivalent interaction feedback.

---

# 7. Accessibility

Accessibility is part of visual quality.

Follow the project's existing accessibility patterns.

Ensure:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible names
- correct form labels
- appropriate contrast
- sensible heading hierarchy
- meaningful link text
- appropriate alternative text
- reduced-motion support where relevant

Do not use visual styling to hide important information from assistive technologies.

Do not use clickable `div` elements when a semantic `button` or `a` is appropriate.

Decorative elements should not create unnecessary screen-reader noise.

---

# 8. Motion

Motion should communicate:

- hierarchy
- state
- continuity
- feedback
- spatial relationships

Prefer fast, purposeful transitions for ordinary UI interactions.

Use larger animations for meaningful moments such as:

- page entrances
- major state changes
- guided interactions
- gesture-based interfaces

Prefer CSS or the project's existing lightweight transition approach for simple interactions.

Use an animation library only when it provides meaningful value or the project already standardizes on it.

Do not add a new animation dependency just to animate a simple hover state.

### Avoid

- slow transitions that delay interaction
- constant floating animations
- excessive parallax
- decorative motion everywhere
- animation that competes with content
- motion that causes accessibility problems

Respect reduced-motion preferences when appropriate.

---

# 9. Imagery and Icons

Use imagery intentionally.

Images should support:

- product understanding
- storytelling
- hierarchy
- branding
- visual interest

Do not add stock imagery simply to fill empty space.

Use the project's existing icon system when one exists.

Do not mix unrelated icon styles.

Keep icon:

- stroke weight
- visual size
- alignment
- spacing

consistent within an interface.

---

# 10. Forms and Data-Dense UI

Forms should optimize for completion.

Prioritize:

- clear labels
- predictable field order
- useful defaults
- concise validation
- clear errors
- appropriate grouping
- obvious primary actions

Do not use visual creativity that makes form completion harder.

For tables and dense data:

- preserve alignment
- distinguish headers
- make scanning easy
- keep actions predictable
- avoid unnecessary decoration

---

# 11. States

Design all meaningful states.

At minimum, consider:

```text
loading
success
empty
error
disabled
partial data
long content
```

A polished interface should not only look good in the happy path.

Empty states can be used as meaningful product guidance rather than filler.

Loading states should preserve layout where practical to reduce visual jumping.

---

# 12. Anti-Patterns

Avoid the following unless the product explicitly calls for them.

### Generic AI UI

Do not default to:

- generic purple-on-white SaaS
- interchangeable gradient blobs
- predictable three-card feature sections
- excessive rounded cards
- oversized decorative gradients
- generic dashboard layouts

### Excessive Card Nesting

Avoid:

```text
card
  → card
    → card
```

without a functional reason.

### Arbitrary Design Values

Avoid one-off:

- colors
- spacing
- radii
- typography values
- shadows

when existing project tokens already express the same intent.

### Inconsistent Controls

Do not create a row where controls have unrelated:

- heights
- radii
- padding
- typography

unless the difference has a clear interaction or hierarchy reason.

### Meaningless Motion

Do not animate merely to make a page feel "modern."

### Decoration Over Function

Do not allow:

- gradients
- textures
- illustrations
- motion
- unusual layouts

to reduce readability or usability.

---

# 13. Design Quality Checklist

Before considering a frontend task complete, verify:

### Visual

- [ ] The page has a clear visual direction.
- [ ] The hierarchy is obvious.
- [ ] Typography has intentional rhythm.
- [ ] Color usage is disciplined.
- [ ] Existing design tokens are respected.
- [ ] The interface does not feel like a generic template.
- [ ] Major views have a memorable visual or interaction detail where appropriate.

### Layout

- [ ] Spacing is consistent.
- [ ] Content alignment is intentional.
- [ ] Cards are used for meaningful grouping.
- [ ] Layout works with realistic content.
- [ ] Long text does not break the design.

### Responsive

- [ ] Desktop layout works.
- [ ] Mobile layout works.
- [ ] Intermediate widths do not produce obvious breakage.
- [ ] Touch targets remain usable.
- [ ] Navigation and controls adapt appropriately.

### Accessibility

- [ ] Semantic elements are used.
- [ ] Keyboard interaction works.
- [ ] Focus states are visible.
- [ ] Labels and accessible names exist.
- [ ] Contrast is sufficient.
- [ ] Reduced motion is considered.

### Interaction

- [ ] Hover/focus/active/disabled states are intentional.
- [ ] Loading, empty, success, and error states are handled.
- [ ] Motion does not delay or obstruct interaction.

### Engineering

- [ ] Existing components were reused where appropriate.
- [ ] Existing architecture was respected.
- [ ] No unnecessary dependencies were added.
- [ ] No duplicate design-system primitives were created.
- [ ] No unrelated refactoring was introduced.
- [ ] TypeScript remains strongly typed.

---

# 14. Implementation Workflow

Use this workflow when implementing frontend work.

## Step 1 — Understand

Identify:

- what the user needs
- what the page is for
- who uses it
- what content must be prioritized
- what interaction is required

## Step 2 — Inspect

Inspect:

- existing UI primitives
- existing layouts
- existing design tokens
- typography
- icons
- responsive patterns
- animation patterns
- nearby implementation

## Step 3 — Establish the Design Direction

Choose:

- visual character
- hierarchy
- dominant surface strategy
- accent strategy
- typography scale
- composition
- signature visual/interaction detail

Base the decision on the product and existing design language.

## Step 4 — Compose Before Creating

Reuse existing:

```text
primitives
components
patterns
tokens
hooks
utilities
```

Create new pieces only where needed.

## Step 5 — Implement

Build:

- semantic structure
- responsive layout
- interaction states
- accessibility
- loading/error/empty states

Keep the implementation focused.

## Step 6 — Review

Check:

- visual hierarchy
- responsiveness
- accessibility
- interaction states
- consistency
- code quality

Remove unnecessary complexity.

---

# 15. Output Guidance for AI Coding Agents

When asked to implement frontend work, keep the response focused.

Prefer this structure:

### Design Stance

Briefly describe:

- the chosen visual direction
- the main visual hierarchy
- the signature anchor

### Implementation

Provide or make:

- production-ready code
- strongly typed code
- accessible markup
- responsive behavior
- reuse of existing project primitives

### Notes

Only mention important non-obvious decisions, such as:

- responsive behavior
- accessibility decisions
- state handling
- architectural ownership
- meaningful animation choices

Do not produce long design essays when implementation is the requested task.

---

# 16. Non-Negotiable Rules

1. Inspect the repository before introducing a new UI pattern.
2. Reuse existing components and design tokens before creating new ones.
3. Do not assume a specific framework, styling library, component path, token syntax, or animation library.
4. Do not introduce arbitrary colors, spacing, typography, or radii when existing design tokens can express the intent.
5. Do not create a second design system inside a feature.
6. Do not sacrifice accessibility for visual novelty.
7. Do not sacrifice usability for aesthetic experimentation.
8. Responsive behavior must be intentional.
9. Motion must have a purpose.
10. Avoid generic AI-generated visual patterns.
11. Avoid unnecessary card nesting.
12. Do not add dependencies without a meaningful reason.
13. Do not perform unrelated refactors while implementing a design task.
14. Follow the project's existing architecture and conventions.
15. The actual repository always takes priority over assumptions in this skill.

---

# 17. Final Design Principle

The goal is not to make every interface experimental.

The goal is to make every interface **intentional**.

A strong frontend should feel:

```text
designed
+
usable
+
coherent
+
distinctive
+
maintainable
```

Visual creativity should emerge from understanding the product, the content, the user, and the existing design system—not from adding decoration for its own sake.
