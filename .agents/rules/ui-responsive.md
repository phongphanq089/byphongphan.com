# UI, Responsive & Component Behavior Rules

When building or updating user interfaces, follow these layout and styling standards:

## 0. Mandatory Reuse of Core UI Primitives (Strict Anti-Reinvention)

- **Always Reuse Core UI:** Always import and reuse existing primitives from `@/shared/ui` (located in `src/shared/ui/core/`, e.g., `Button`, `Input`, `Badge`, `Card`, `Checkbox`, `Dialog`, `Drawer`, `DropdownMenu`, `Textarea`, `Tooltip`, `Separator`, etc.).
- **Strictly Forbidden:** NEVER write raw HTML elements with ad-hoc styling (e.g., `<button className="px-4 py-2 bg-blue-500 rounded...">` or `<input className="...">`) when a core component already exists.
- **Variants & Customization:** Use the established component props and variants (`variant`, `size`, etc. powered by `cva`). If custom styling is needed, pass `className` to the core component for merging via `cn()`; do not reimplement the component from scratch.

## 1. Styling, Radius & Design System Conventions

- **Utility-First:** Use Tailwind CSS v4 utility classes.
- **Dynamic Classes:** Always use `cn(...)` from `@/shared/lib/utils` (or the project's standard `cn` helper) for conditional class joining. Avoid string interpolation like `${active ? '...' : '...'}`.
- **Typography Consistency:** Keep heading sizes (H1–H6) consistent across all pages. Do not introduce arbitrary, one-off font sizes without clear purpose.
- **Border Radius Standardization:**
  - Border radius must strictly follow predefined design system tokens (`--radius`, `rounded-lg`, `rounded-md`, `rounded-sm`, `rounded-full`).
  - **Strictly Forbidden:** Never use arbitrary, one-off radius values (e.g. `rounded-[11px]`, `rounded-[14px]`, `rounded-[22px]`).
  - Maintain consistent corner rounding across cards, inputs, dialogs, and controls according to the theme token hierarchy.
- **Color System & Tone Fidelity:**
  - All UI elements must strictly adhere to the established design system tokens (`--primary`, `--pp-primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--background`, `--card`, `--border`).
  - **Strictly Forbidden:** Never introduce arbitrary or rogue colors (e.g., random `bg-purple-600`, `bg-emerald-500`, ad-hoc hex `#...`, or inline RGB styles) outside the defined design palette.

## 2. Responsive Layout & Mobile Densification

- **Mobile-First Safety:** Ensure layout safety from 320px screens up to 4K displays. Prevent horizontal overflowing and content spilling.
- **Mobile 2-Column Grid Exception:**
  - For simple, low-information cards (e.g., simple project cards, blog listing cards, resource thumbnails, tags), **always render them in 2 columns on mobile (`grid-cols-2`)**.
  - Reserve single-column (`grid-cols-1`) exclusively for complex, multi-action cards with extensive interactive controls.
- **Aggressive Mobile Densification:**
  - When rendering 2-column cards on mobile viewports, optimize screen real estate like a native mobile app:
    - Hide secondary/unimportant text (e.g., long descriptions, excessive tag badges).
    - Reduce font sizes (`text-xs` or `text-[10px]`) and padding (`p-2` or `p-2.5`) to readable minimum limits to prevent awkward text wrapping.

## 3. Controls & Action Elements

- **No Line Wrap on Controls:**
  - Action buttons, tabs, menu items, pills, and primary links must strictly include `whitespace-nowrap` to prevent awkward button wrapping on smaller screens.
- **Row Button Height Uniformity:**
  - When buttons are placed in the same row, action bar, dialog footer, or toolbar, **ALL buttons must have identical heights**.
  - Always harmonize the `size` prop across adjacent buttons (e.g., all `size="default"` or all `size="sm"`), or use flex stretch (`items-stretch`, `h-full`) to guarantee flush alignment.
  - Never mix buttons of different heights in the same row, which results in jagged, uneven baselines.
- **Button Color Tone Consistency:**
  - Always use established button variants (`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`).
  - Never override button backgrounds with arbitrary rogue colors.

## 4. Overlay & Modal Body Scroll Lock

- **Background Scroll Locking:**
  - When any modal, popup, dialog, drawer, or sidebar is active/opened, the main page body scroll **MUST be disabled** (`document.body.style.overflow = "hidden"`).
  - The scroll lock must be safely restored to its original value when the overlay closes or unmounts to prevent scroll lock leaks.
  - If using Radix UI / Vaul primitives, ensure their built-in scroll lock mechanisms are properly configured and not bypassed.

## 5. Grid Cards & Blocks Equal Height (Anti-Staggering / Flush Alignment)

- **Uniform Row Height:**
  - All cards, blocks, and containers within a grid layout (`grid-cols-*`) or flex row **MUST have equal heights**, even if some cards contain significantly less text or fewer elements than others.
  - **Strictly Forbidden:** Never allow cards in the same row to appear uneven, staggered, or indented ("thụt thò").
- **Flex-Stretch Implementation Pattern:**
  - Give cards `h-full flex flex-col`.
  - Use `flex-1` on the body/content section so it expands to fill remaining vertical space.
  - Use `mt-auto` on card footers or action rows to pin buttons neatly to the bottom, ensuring sibling card buttons align on the same horizontal plane:
    ```tsx
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="flex flex-col h-full">
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

- **Layout & Structure Only:**
  - When the user provides an image, mockup, or screenshot as a reference for layout or UI:
    - **Extract:** Layout architecture, wireframe structure, information hierarchy, spacing, alignment, and functional component placement.
- **Strict Prohibition on Reference Image Colors & Styling:**
  - **NEVER** copy or mimic colors, gradients, background tones, borders, or typography from the reference image.
  - **ALWAYS** strictly apply the project's existing design system tokens (`--background`, `--card`, `--pp-primary`, `--border`, dark/light themes) and core UI component variants.
