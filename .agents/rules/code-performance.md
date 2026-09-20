# Code Quality, Performance & Data Handling Rules

Follow these rules to maintain high performance, prevent memory leaks, and ensure robust data flow:

## 1. React Performance & Re-render Prevention

- **Audit Rendering Lifecycle:** When creating or editing components (especially those handling animations, queries, or interactive lists), proactively audit rendering triggers.
- **Prevent Infinite Loops:** Never write state mutations inside `useEffect` or lifecycle blocks that trigger infinite loops.
- **Reference Stability:**
  - Wrap callback handlers in `useCallback` when passed as props to memoized child components or listed in dependency arrays.
  - Wrap expensive computations or unstable object/array allocations in `useMemo`.
  - Hoist static configuration arrays, constants, or initial schemas outside component function bodies.
  - Keep `useEffect` dependency arrays strictly minimal and accurate.
- **Derived State:** Never mirror props or duplicate state into local React state. Always calculate derived values on-the-fly during render.

## 2. Server State with TanStack Query

- **Leverage Query Caching:** Utilize TanStack Query's cache and built-in loading/error states (`isLoading`, `isFetching`, `error`) rather than maintaining duplicate local `loading`/`error` useState variables.
- **Query Selectors:** Use the `select` option in `useQuery` to derive or transform specific slices of server data, avoiding unnecessary re-renders when other fields change.

## 3. Forms & Data Validation

- **Zod Schema Validation:** Use `zod` for validating all form inputs, route parameters, and API response structures.
- **Integration with React Hook Form:** Use `@hookform/resolvers/zod` to connect Zod schemas with form state management.

## 4. API & Mock Data Schema Consistency

- **Accurate Schema Alignment:** Whenever connecting to Sanity CMS or external APIs, model data contracts accurately with TypeScript interfaces and Zod schemas.
- **Mock Data Audit:** If building UI features with placeholder/mock data first, audit and refactor the types the moment real schemas or Sanity queries are integrated, ensuring zero discrepancies or unhandled `null`/`undefined` states.
