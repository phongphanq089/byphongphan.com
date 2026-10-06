# Code Quality, Performance & Data Handling Rules

Follow these rules to maintain high performance, prevent memory leaks, and ensure robust data flow without introducing unnecessary complexity or dependencies.

## 1. React Performance & Re-render Prevention

- **Audit Rendering Lifecycle:** When creating or editing components (especially those handling animations, queries, or interactive lists), proactively audit rendering triggers.
- **Prevent Infinite Loops:** Never write state mutations inside `useEffect` or lifecycle blocks in a way that can create an infinite update loop.
- **Reference Stability:**
  - Use `useCallback` when callback identity stability provides a clear benefit, especially when passing callbacks to memoized children or when required by dependency-sensitive hooks.
  - Use `useMemo` for genuinely expensive computations or when stable references prevent unnecessary work or re-renders. Do not add memoization mechanically.
  - Hoist static configuration arrays, constants, or initial schemas outside component function bodies when they do not depend on component state or props.
  - Keep `useEffect` dependency arrays complete and accurate. Do not omit dependencies merely to reduce effect executions.
- **Derived State:** Never mirror props or duplicate derived values into local React state. Calculate derived values during render, or use `useMemo` when the computation is genuinely expensive.

## 2. Server State and Store Subscriptions

- **Use the Existing Server-State Solution:** Follow the project's established server-state pattern. If TanStack Query is already used, leverage its cache and built-in loading/error states (`isLoading`, `isFetching`, `error`) rather than maintaining duplicate local server-state variables.
- **Query Selectors:** When using TanStack Query, use the `select` option when it provides a meaningful benefit by deriving or transforming a specific slice of server data.
- **Atomic Store Selectors:** When using Zustand or another subscribable store, prefer fine-grained selectors to isolate re-renders:
  ```ts
  const user = useStore((state) => state.user)
  ```
  Do not destructure an entire store when the project/store API supports narrower subscriptions.
- **Do Not Introduce Dependencies Solely Because of These Rules:** Do not add TanStack Query, Zustand, or another state-management library unless it is already part of the project or is explicitly required by the task.

## 3. Forms & Data Validation

- **Use the Project's Validation Approach:** Follow the existing form and validation stack before introducing a new library.
- **Zod When Available:** When Zod is already part of the project, use it for form inputs, route parameters, and important runtime boundaries where schema validation provides meaningful protection.
- **External Data Boundaries:** Validate or safely narrow data received from external APIs, CMS systems, URL parameters, and other untrusted boundaries according to the project's established validation approach.
- **Integration with React Hook Form:** If React Hook Form and Zod are already used together, use `@hookform/resolvers/zod` to connect Zod schemas with form state management.
- **Avoid Duplicate Validation:** Do not create multiple competing schemas or validation layers for the same contract without a clear reason.

## 4. API & Mock Data Schema Consistency

- **Accurate Schema Alignment:** When connecting to external APIs or CMS systems, model data contracts accurately with TypeScript types and, when available and appropriate, runtime schemas such as Zod.
- **Mock Data Audit:** If building UI features with placeholder/mock data first, audit and update the types as soon as real schemas or API/CMS queries are integrated, ensuring there are no discrepancies or unhandled `null`/`undefined` states.
- **Contract Ownership:** Prefer the project's existing API/client/schema definitions rather than recreating the same response contract inside individual components.
- **No Assumed CMS:** Do not assume Sanity, a specific CMS, or a specific API client exists unless the repository or task explicitly establishes it.
