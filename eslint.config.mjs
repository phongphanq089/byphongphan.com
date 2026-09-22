import js from "@eslint/js"
import prettier from "eslint-config-prettier"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    // Defines patterns to bypass linting across the entire workspace, improving performance and avoiding false positives in non-source files.
    ignores: [
      "dist",
      ".vinxi",
      ".output",
      ".netlify",
      "node_modules",
      "public",
      "src/routeTree.gen.ts",
      "**/*.gen.ts",
      "src/__registry__",
      "src/registry/**",
      ".agents",
      ".agent",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"], // Restricts the execution scope to TypeScript and TSX source files.
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      // languageOptions.ecmaVersion: 2020 ===> Syntax Level (Optional Chaining ?., Nullish Coalescing ??).
      // languageOptions.globals Runtime Environments
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // Core Hooks Enforcement Enforce the Rules of Hooks ( fully declare dependencies in useEffect, useCallback, and useMemo hooks )
      "react-refresh/only-export-components": "off", // Disabled because TanStack Router requires colocation of route definitions (createFileRoute), loaders, and search validation alongside route components.
      "react-hooks/incompatible-library": "off", //  Suppresses false-positive compatibility warnings triggered by third-party hook libraries.
      "@typescript-eslint/consistent-type-imports": "error", //Enforces type-only imports, optimizing tree-shaking and preventing circular dependency issues during bundler transpilation. ( import type { User } from './types')
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      //  Enforces deterministic, alphabetical sorting of imports/exports to reduce Git merge conflicts and maintain code cleanliness.
    },
  },
  prettier
)
