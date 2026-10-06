```markdown
# UI, Responsive & Component Behavior Rules

When building or styling user interfaces, strictly adhere to these layout and design system rules:

## 0. Mandatory Reuse of Core UI Primitives (Strict Anti-Reinvention)

- **Always Reuse Core UI:** Import and reuse primitives exclusively from `@/shared/ui` (`src/shared/ui/core/`, e.g., `Button`, `Input`, `Badge`, `Card`, `Checkbox`, `Dialog`, `Drawer`, `DropdownMenu`, `Textarea`, `Tooltip`, `Separator`).
- **Strictly Forbidden:** NEVER write raw HTML controls with ad-hoc styling (e.g., `<button className="...">` or `<input className="...">`) when a core component exists.
- **Composition & Variants:** Use established component props and `cva` variants (`variant`, `size`). For custom overrides, pass `className` to the core primitive to merge via `cn()`.

## 1. Design System Tokens & Styling Conventions

- **Tailwind Utility-First:** Use Tailwind CSS v4 utilities.
- **Conditional Classes:** Always use `cn(...)` from `@/shared/lib/utils` for dynamic class resolution. Avoid string template interpolation.
- **Border Radius Standardization:**
  - Border radii must strictly follow design tokens (`--radius`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`).
  - **Strictly Forbidden:** Never use arbitrary, one-off values (e.g., `rounded-[11px]`, `rounded-[14px]`, `rounded-[22px]`).
- **Color System Fidelity:**
  - Strictly adhere to defined theme color tokens (`--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--background`, `--card`, `--border`).
  - **Strictly Forbidden:** Never inject rogue hex colors, inline RGB styles, or arbitrary palette shades outside established theme tokens.

## 2. Responsive Layout & Mobile Ergonomics

- **Mobile-First Layout Safety:** Ensure layout integrity across all viewports from 320px up to 4K displays. Absolutely prevent horizontal page overflow (`overflow-x`).
- **Adaptive Card Grids:**
  - Default to a single-column grid (`grid-cols-1`) on mobile viewports (< 380px) and for complex, interactive cards.
  - A 2-column grid (`grid-cols-2`) is permitted for compact, low-information cards (e.g., tags, simple thumbnail showcases) on supported viewports (`>= 380px`), provided readability is maintained.
- **Mobile Readability & Touch Targets:**
  - Never reduce mobile font sizes below `text-xs` (12px) to prevent illegibility.
  - Maintain interactive tap targets of at least 44x44px according to accessibility standards.

## 3. Controls & Action Elements

- **No Text Wrapping on Controls:**
  - Buttons, tabs, pills, and dropdown triggers must include `whitespace-nowrap` to prevent awkward label breaks.
- **Row Button Height Uniformity:**
  - All buttons within the same action bar, toolbar, or dialog footer MUST have identical heights. Harmonize the `size` prop across adjacent buttons or use flex alignment (`items-stretch`).
- **Variant Consistency:**
  - Use standard component variants (`default`, `secondary`, `outline`, `ghost`, `destructive`, `link`). Do not manually override button backgrounds with arbitrary color classes.

## 4. Overlay & Scroll Lock Handling

- **Rely on Primitive Built-ins:**
  - Radix UI (`Dialog`) and Vaul (`Drawer`) handle scroll locking and layout shift compensation automatically.
  - **Do NOT manually manipulate `document.body.style.overflow = "hidden"`** when using these components, as manual overrides conflict with their internal cleanup mechanisms and cause layout jitter.
- **Custom Overlays:** If implementing a custom overlay without a primitive, ensure body scroll locking is safely enabled on mount and strictly restored on unmount.

## 5. Equal Height for Grid Cards (Flush Alignment)

- **Uniform Row Height:**
  - All cards and blocks in a grid row (`grid-cols-*`) must maintain identical heights, regardless of content disparity. Uneven, jagged, or staggered card baselines in the same row are strictly prohibited.
- **Flex-Stretch Implementation Pattern:**
  - Apply `h-full flex flex-col` to card containers.
  - Add `flex-1` to the card body to expand and absorb remaining vertical space.
  - Apply `mt-auto` to the card footer/actions to align buttons flush across sibling cards:
    ```tsx
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card className="flex flex-col h-full" key="{item.id}">
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p>{item.description}</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
    ```

## 6. Layout Reference Image Policy (Structure Only, Brand Colors Always)

- **Structure & Wireframe Only:**
  - When provided with an image or screenshot as a reference, extract ONLY layout structure, information hierarchy, and component positioning.
- **Strict Prohibition on Reference Colors:**
  - NEVER copy colors, gradients, background shades, or typography from the reference image.
  - ALWAYS apply the project's existing design tokens and core UI primitives.
