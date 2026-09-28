export const CODE_LANGUAGE_MAP: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  jsx: "JSX",
  tsx: "TSX",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  markdown: "Markdown",
  python: "Python",
  rust: "Rust",
  go: "Go",
  java: "Java",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  php: "PHP",
  ruby: "Ruby",
  sql: "SQL",
  yaml: "YAML",
  bash: "Bash",
}

export function getCodeLanguageOptions(): [string, string][] {
  return Object.entries(CODE_LANGUAGE_MAP)
}

export function getLanguageFriendlyName(lang: string): string {
  return CODE_LANGUAGE_MAP[lang] ?? lang
}
