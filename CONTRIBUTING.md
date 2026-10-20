# Contributing to byphongphan.com

Thank you for your interest in contributing to **byphongphan.com**! We welcome contributions from developers worldwide—from fixing typographical errors and improving documentation to submitting innovative UI components and optimizing rendering performance.

To maintain high code quality and architectural integrity, please read this guide before submitting your contribution.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [phongphanq089@gmail.com](mailto:phongphanq089@gmail.com).

---

## How Can I Contribute?

- **Report Bugs:** Identify visual glitches, broken links, accessibility oversights, or build failures via [GitHub Issues](https://github.com/phongphanq089/byphongphan.com/issues).
- **Propose New Components / Blocks:** Share ideas for creative, micro-interactive UI components or full-page block layouts.
- **Improve Documentation:** Enhance code explanations, props tables, or setup instructions.
- **Refactor & Optimize:** Suggest performance optimizations, bundle size reductions, or accessibility improvements.

---

## Development Workflow

### 1. Fork & Branch

1. Fork the repository on GitHub: `https://github.com/phongphanq089/byphongphan.com`
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/byphongphan.com.git
   cd byphongphan.com
   ```
3. Create a descriptive branch from `main`:
   ```bash
   git checkout -b feat/interactive-card-hover
   ```

### 2. Follow Engineering Principles

Before introducing code, please review [AGENTS.md](./AGENTS.md) which outlines our core architectural rules:

- **Strict TypeScript:** No `any`. Utilize discriminated unions and clear interfaces.
- **Design Tokens:** Use semantic OKLCH tokens (`bg-background`, `text-foreground`, `border-border`) rather than arbitrary hardcoded hex codes.
- **Accessibility First:** Ensure keyboard navigability, semantic HTML, visible focus states, and appropriate ARIA attributes.
- **Motion & Performance:** Respect `prefers-reduced-motion` and keep animations GPU-accelerated (`transform`, `opacity`).
- **Domain Independence:** Code placed in `src/shared/` must remain strictly domain-agnostic.

### 3. Adding a New Registry Component

If contributing a reusable component to the shadcn-compatible registry:

1. Add the component source in `src/registry/ui/` or `src/registry/animated/`.
2. Add interactive variants or demos in `src/registry/variants/` or `src/registry/demos/`.
3. Register the item in `src/registry/registry.ts` with accurate metadata, dependencies, and file mappings.
4. Run the registry compilation script:
   ```bash
   pnpm build:registry
   ```
5. Verify the generated output under `public/r/<component-name>.json`.

---

## Verification & Testing

Before committing or opening a Pull Request, ensure all local checks pass:

```bash
# 1. Strict TypeScript check
pnpm type-check

# 2. ESLint linting
pnpm lint

# 3. Formatting verification
pnpm check

# 4. Vitest execution
pnpm test

# 5. Full production build verification
pnpm build
```

---

## Commit Guidelines

We enforce the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature or component (e.g., `feat(registry): add spotlight-card primitive`)
- `fix:` A bug fix (e.g., `fix(theme): eliminate light mode reload flash`)
- `docs:` Documentation improvements (e.g., `docs: update deployment guidelines`)
- `refactor:` Code improvements without behavioral changes (e.g., `refactor(lib): simplify sound engine hooks`)
- `perf:` Performance enhancements (e.g., `perf(icons): optimize inline SVG paths`)
- `test:` Adding or updating tests (e.g., `test(components): add button interaction tests`)

---

## Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feat/interactive-card-hover
   ```
2. Open a Pull Request against the `main` branch of `phongphanq089/byphongphan.com`.
3. Fill out the [Pull Request Template](.github/pull_request_template.md) detailing the changes and linking relevant issues.
4. A maintainer will review your submission and provide feedback.

---

## License Notice

By contributing to this repository, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE.md).
