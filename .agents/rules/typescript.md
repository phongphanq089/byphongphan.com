# TypeScript Quality & Strict Compilation Rules

When writing, refactoring, or generating code for this project, you MUST strictly adhere to these TypeScript rules:

## 1. Upfront Type Definition (Define Before Code)

- Always define types, interfaces, or generic schemas _before_ writing active logic, components, hooks, or API handlers.
- Avoid implementing functions with implicit `any` or loose inline typings. Document data structures and contracts first.

## 2. Zero TypeScript Errors (Zero Red Lines)

- All written code must be 100% compliant with the project's TypeScript configuration (`tsconfig.json` and `tsconfig.app.json`).
- You must never leave code with unresolved TypeScript compile-time errors or warnings (absolutely no "red squiggly lines" or compiler warnings).
- Perform strict null checks and handle optional chaining (`?.`) or type narrowing (guards) appropriately to prevent runtime errors.

## 3. No Lazy Types

- Avoid using `any` or `as any`.
- If a type is complex, define it explicitly or use standard TypeScript utilities (`Record`, `Omit`, `Pick`, `Partial`, `NonNullable`, etc.).
- Explicitly declare return types for critical helper functions, custom hooks, and API handlers.

## 4. Verify Sourcing and Aliases

- Refer to `tsconfig.json` and `tsconfig.app.json` settings to make sure path aliases (e.g., `@/*` pointing to `src/*`) and compiler options are properly used and supported.
- Systematically ensure all imports are valid and that generic constraints match library documentation.

## 5. Modern Component Typing (Strict Prohibition of `React.FC`)

- **Strict Prohibition of `React.FC` / `React.FunctionComponent`**: NEVER declare components using `React.FC` or `React.FunctionComponent` (e.g., `const MyComponent: React.FC<Props> = ...`). This pattern is outdated and discouraged by both React Core and TypeScript teams due to legacy implicit children behavior, lack of natural generic component support, anonymous function assignment in DevTools, and redundant verbosity.
- **Mandatory Modern Standard**: Always define components as standard named functions with explicit props typing:
  ```tsx
  // ✅ CORRECT: Standard Named Function with typed props
  interface UserProfileProps {
    name: string
    role?: string
  }

  export function UserProfile({ name, role = "Member" }: UserProfileProps) {
    return (
      <div>
        {name} - {role}
      </div>
    )
  }
  ```
  Or explicitly typed arrow function parameters if a const arrow is specifically required:
  ```tsx
  export const UserProfile = ({ name, role = "Member" }: UserProfileProps) => {
    return (
      <div>
        {name} - {role}
      </div>
    )
  }
  ```
- **Generic Components**: Always leverage native TypeScript function generics:
  ```tsx
  export function DataList<T>({ items, renderItem }: DataListProps<T>) {
    return <ul>{items.map(renderItem)}</ul>
  }
  ```

## 6. Language & Code Comments Standard (Strict English-Only)

- **Strict Prohibition of Vietnamese in Code:** NEVER use Vietnamese for code comments, inline notes, JSDoc, function or variable identifiers, Git commits, or internal debugging logs.
- **English Everywhere in Codebase:** All code, type annotations, inline comments, docstrings, and UI default texts must be written strictly in English.

