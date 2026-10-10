# UI, Responsive & Component Behavior Rules

When building or styling user interfaces, follow these layout, responsive, accessibility, and component behavior rules. Prefer the project's existing design system and component architecture over introducing new conventions.

## 0. Reuse Existing UI Primitives First

- **Inspect Before Creating:** Before implementing a new control, component, or interaction pattern, inspect the repository for an existing shared primitive or reusable component that already solves the problem.

- **Reuse Core UI:** Prefer existing shared UI primitives for common controls such as `Button`, `Input`, `Badge`, `Card`, `Checkbox`, `Dialog`, `Drawer`, `DropdownMenu`, `Textarea`, `Tooltip`, `Separator`, and similar components.

- **Do Not Assume Paths or Libraries:** Do not assume a specific alias, folder structure, UI library, or component implementation. Follow the project's actual import paths and established architecture.

- **Avoid Duplicate Controls:** Do not create a second implementation of an existing shared component merely to make a small visual change. Extend, compose, or add a proper variant when the behavior belongs to the shared component.

- **Native HTML When Appropriate:** Native semantic HTML elements are acceptable when there is no suitable shared primitive, when a native element is the correct semantic choice, or when using a primitive would add unnecessary complexity.

- **Composition & Variants:** When a shared component provides variants, sizes, slots, or composition APIs, use them instead of recreating the same behavior with ad-hoc styling.

## 1. Design System Tokens & Styling Conventions

- **Follow the Existing Styling System:** Use the project's established styling approach and version. If Tailwind CSS is already used, follow the project's Tailwind conventions rather than introducing a separate styling system.

- **Use Existing Design Tokens:** Prefer established theme tokens for colors, spacing, typography, borders, radii, shadows, and other visual properties.

- **Avoid Rogue Values:** Do not introduce arbitrary values or one-off design decisions without a clear reason. If a visual value will be reused, add or extend the appropriate design token instead of repeatedly hard-coding it.

- **Color System Fidelity:** Prefer semantic color tokens such as `primary`, `secondary`, `muted`, `accent`, `destructive`, `background`, `card`, and `border` when they exist in the project.

- **Dynamic or External Colors:** Arbitrary colors may be appropriate for dynamic data, user-generated content, external branding, charts, maps, or other requirements that cannot reasonably use the application's theme tokens. Keep such usage intentional and scoped.

- **Class Composition:** When the project provides a utility such as `cn()` for conditional class composition, use it consistently instead of manual string interpolation or duplicated class-resolution logic.

- **Do Not Create a Second Design System:** Do not introduce new spacing scales, radius systems, color palettes, typography scales, or component conventions when equivalent project conventions already exist.

## 2. Responsive Layout & Mobile Ergonomics

- **Mobile-First Layout Safety:** Build layouts that remain usable across the project's supported viewport range, including small mobile screens, tablets, laptops, and large desktop displays.

- **Prevent Unintended Overflow:** Avoid unintended page-level horizontal overflow. Diagnose the underlying layout problem rather than hiding it with `overflow-x-hidden`.

- **Intentional Horizontal Scrolling:** Horizontal scrolling is acceptable when it is part of the intended interaction, such as tables, carousels, code blocks, tabs, timelines, or horizontally scrollable lists. Make the behavior discoverable and usable on touch devices.

- **Adaptive Layouts:** Use responsive grids, flex layouts, wrapping, stacking, and spacing changes according to content complexity and available space. Do not force a fixed column count when it causes cramped or unreadable content.

- **Mobile Card Layouts:** Prefer single-column layouts for complex or information-dense cards on small screens. Multi-column layouts are appropriate for compact, low-information content when readability and interaction remain clear.

- **Mobile Readability:** Maintain readable typography and sufficient line height on small screens. Do not arbitrarily shrink text simply to fit more content into a viewport.

- **Touch Targets:** Interactive controls should provide a sufficiently large hit area for touch interaction, generally targeting at least 44x44px where practical. The visual icon itself does not need to be 44x44px if its interactive container provides the required hit area.

- **Content Resilience:** Test layouts with long labels, translated text, missing images, large numbers, empty states, and variable content lengths. Responsive behavior should not depend on ideal content.

## 3. Controls & Action Elements

- **Label Wrapping:** Use `whitespace-nowrap` for short button, tab, pill, and trigger labels when wrapping would reduce clarity or damage the layout.

- **Allow Wrapping When Necessary:** Long labels, localized text, narrow mobile layouts, and content-heavy controls may require wrapping or a different responsive composition. Do not force `whitespace-nowrap` when it causes clipping or overflow.

- **Consistent Action Sizing:** Buttons and controls within the same action bar, toolbar, or dialog footer should have visually consistent heights and alignment unless there is a deliberate hierarchy requiring otherwise.

- **Use Existing Variants:** Prefer established component variants such as `default`, `secondary`, `outline`, `ghost`, `destructive`, or `link` when those variants exist.

- **Avoid Ad-Hoc Overrides:** Do not manually recreate a component variant with arbitrary background, border, typography, or spacing classes when the behavior belongs in the shared component.

- **Hierarchy Matters:** Primary, secondary, destructive, and tertiary actions should remain visually distinguishable and consistent with the project's design system.

- **Accessible States:** Interactive controls must provide clear hover, focus-visible, active, disabled, loading, and error states where applicable. Never rely on color alone to communicate state.

## 4. Overlay, Dialog & Scroll Lock Handling

- **Reuse Existing Overlay Primitives:** Prefer the project's established dialog, drawer, popover, sheet, dropdown, tooltip, and modal primitives.

- **Use Built-In Behavior:** When the chosen primitive already handles focus management, keyboard interaction, portal behavior, scroll locking, or layout-shift compensation, rely on that implementation instead of recreating it.

- **Do Not Fight Scroll Lock:** Do not manually manipulate `document.body.style.overflow` or equivalent global scroll behavior when an existing overlay primitive already manages it.

- **Custom Overlays:** If a custom overlay is genuinely required, implement scroll locking, focus behavior, Escape handling, outside-click behavior, and cleanup safely. Restore global state on unmount and avoid affecting unrelated overlays.

- **Overlay Accessibility:** Dialogs and drawers must provide appropriate labels, focus management, keyboard dismissal, and accessible interaction states according to the project's primitives and accessibility conventions.

## 5. Grid & Card Layout Behavior

- **Equal Height When Useful:** Cards in the same grid row may use equal-height layouts when consistent alignment improves scanning, comparison, or action placement.

- **Do Not Force Equal Height Everywhere:** Do not impose equal heights on editorial cards, search results, masonry-like layouts, variable-content lists, or other interfaces where natural content height is more appropriate.

- **Avoid Artificial Whitespace:** Do not stretch cards merely to make a grid look uniform if the result creates excessive empty space or harms content hierarchy.

- **Recommended Flex Pattern:** When equal-height cards are appropriate, a common implementation is:
  - Card container: `h-full flex flex-col`
  - Main content/body: `flex-1`
  - Footer/actions: `mt-auto`
  - Example: `<Card className="flex h-full flex-col">...</Card>`

- **Content Alignment:** Align equivalent content and actions consistently across sibling cards when the interface is intended for comparison.

- **Responsive Exceptions:** Card height and internal alignment may change across breakpoints when the mobile composition is substantially different from desktop.

## 6. Reference Image & Screenshot Policy

- **Structure First:** When a screenshot, mockup, or visual reference is provided, extract useful information about layout structure, information hierarchy, spacing relationships, component positioning, and interaction patterns.

- **Do Not Blindly Copy Branding:** Do not blindly copy colors, gradients, typography, logos, proprietary assets, or other brand-specific visual details from a reference when they conflict with the project's design system or requirements.

- **Apply the Project's Design System:** Translate the useful structural ideas from the reference into the project's existing tokens, components, typography, and interaction patterns.

- **Reference Is Not the Source of Truth for Implementation:** A screenshot shows an intended visual result, not necessarily the correct technical implementation. Prefer the repository's existing architecture and accessible component behavior.

- **Preserve Intent, Not Pixel Errors:** Match the visual hierarchy and overall composition while adapting dimensions, spacing, and responsive behavior to the actual application.

- **Do Not Introduce Unnecessary Complexity:** If a reference uses decorative effects, animations, or layout techniques that do not serve the product's purpose or cannot be implemented consistently with the existing system, simplify them rather than reproducing them blindly.

## 7. Accessibility & Interaction Quality

- **Semantic Structure:** Use appropriate semantic HTML and existing accessible primitives. Do not replace meaningful elements with generic containers solely for styling.

- **Keyboard Access:** Interactive functionality must remain usable with keyboard navigation where applicable.

- **Focus Visibility:** Preserve or provide a clear `:focus-visible` state for keyboard users. Never remove focus indicators without providing an accessible replacement.

- **State Communication:** Disabled, selected, expanded, checked, invalid, loading, and other interaction states should be communicated through appropriate semantics and visual feedback.

- **Motion Restraint:** Animations and transitions should support interaction and hierarchy rather than distract from the task. Respect reduced-motion preferences when the project supports motion.

- **Error Prevention:** Responsive and interactive behavior should not cause accidental clicks, clipped controls, inaccessible content, or unexpected layout shifts.

## 8. Verification Before Completion

Before considering a UI change complete:

- Check the smallest supported mobile viewport and at least one larger desktop viewport.
- Check for unintended horizontal overflow.
- Check long and short content states where relevant.
- Check keyboard focus and interactive states.
- Check loading, disabled, empty, error, and selected states when applicable.
- Verify that existing shared primitives and design tokens are being reused.
- Confirm that responsive changes did not introduce regressions in adjacent components.
- Prefer fixing the underlying layout or component behavior over adding one-off CSS workarounds.
