import js from "@eslint/js"
import prettier from "eslint-config-prettier"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    // Các thư mục và file sinh tự động cần bỏ qua
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
      ".agents",
      ".agent",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node, // TanStack Start chạy cả SSR nên cần Node globals
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      "react-refresh/only-export-components": "off",
      "react-hooks/incompatible-library": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  // Tắt các rule xung đột với Prettier (phải để cuối cùng)
  prettier
)
