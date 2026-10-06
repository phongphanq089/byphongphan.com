# TypeScript Quality & Strict Compilation Rules

When writing, refactoring, or generating code for this project, strictly adhere to these TypeScript rules and the project's actual compiler configuration.

## 1. Explicit Types for Meaningful Contracts

- **Define Meaningful Data Structures First:** Define interfaces, types, or generic schemas before implementing logic that depends on a non-trivial data structure or public contract.
- **Use Inference for Trivial Values:** Do not create unnecessary types for simple local values when TypeScript inference is already clear and correct.
- **Avoid Loose Typing:** Do not implement functions, components, hooks, or API handlers with implicit `any` or unnecessarily loose inline typings.

## 2. Zero TypeScript Errors

- **Compiler Compliance:** All written code must comply with the project's actual TypeScript configuration, including `tsconfig.json`, `tsconfig.app.json`, and any other active configuration files.
- **No Unresolved Type Errors:** Never knowingly leave unresolved TypeScript compile-time errors.
- **Null Safety:** Respect strict null checks and handle optional values with appropriate narrowing, guards, defaults, or optional chaining where appropriate.
- **Warnings:** Do not knowingly leave compiler, lint, or type-related warnings when the project's existing tooling reports them. Do not invent verification commands; use the scripts and tooling that actually exist in the repository.

## 3. Strong Types, No Lazy Types

- **Avoid `any`:** Do not use `any` or `as any` unless an unavoidable external boundary requires it and the exception is explicitly justified.
- **Prefer `unknown`:** Use `unknown` for genuinely unknown external data, then narrow it safely.
- **Use Standard Utilities:** For complex types, prefer standard TypeScript utilities such as `Record`, `Omit`, `Pick`, `Partial`, `Required`, `NonNullable`, and conditional/mapped types when appropriate.
- **Return Types:** Explicitly declare return types for critical shared helpers, custom hooks, public utilities, and API handlers when doing so improves contract clarity.
- **Avoid Over-typing:** Do not add redundant annotations where inference is obvious and safe.

## 4. Verify Compiler Configuration, Imports, and Aliases

- **Inspect Before Assuming:** Refer to the project's actual `tsconfig.json`, `tsconfig.app.json`, and related configuration before relying on compiler options or path aliases.
- **Valid Imports:** Systematically ensure imports resolve correctly and match the project's existing module conventions.
- **Generic Constraints:** Ensure generic constraints and library APIs match the versions actually installed in the project.
- **No Invented Configuration:** Do not assume aliases, compiler options, package scripts, or generated types that are not present in the repository.

## 5. Modern Component Typing

- **Strict Prohibition of `React.FC` / `React.FunctionComponent`:** Never declare components using `React.FC` or `React.FunctionComponent`.
- **Preferred Standard:** Define components as named functions with explicit props typing:
  ```tsx
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
- **Typed Arrow Functions:** Use an explicitly typed arrow function when the existing project convention or implementation requires a `const` component:
  ```tsx
  export const UserProfile = ({ name, role = "Member" }: UserProfileProps) => {
    return (
      <div>
        {name} - {role}
      </div>
    )
  }
  ```
- **Generic Components:** Use native TypeScript function generics when a component genuinely needs to support a generic data contract:
  ```tsx
  export function DataList<T>({ items, renderItem }: DataListProps<T>) {
    return <ul>{items.map(renderItem)}</ul>
  }
  ```

## 6. Language & Code Comments Standard

- **English for Developer-Facing Code:** Code comments, JSDoc, type names, function names, variable names, Git commits, internal debugging logs, and other developer-facing identifiers/messages must be written in English.
- **User-Facing Language:** UI text, validation messages, empty states, labels, and other user-facing content should follow the product's language and localization conventions. Do not force English when the product is localized or designed for another language.
- **No Mixed Identifier Language:** Keep identifiers consistent with the project's existing naming conventions and use English for new developer-facing identifiers.
