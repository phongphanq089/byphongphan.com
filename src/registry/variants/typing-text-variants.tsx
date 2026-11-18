import type { ComponentVariant } from "@/features/component-ui/types"

import TypingTextSelectDelete from "./typing-text/typing-text-select-delete"
import TypingTextTypos from "./typing-text/typing-text-typos"

export const TYPING_TEXT_VARIANTS: ComponentVariant[] = [
  {
    id: "typing-text-select-delete",
    title: "Select & Sweep Deletion",
    description:
      "Erases phrases by highlighting right-to-left before cutting in one swift stroke.",
    component: TypingTextSelectDelete,
  },
  {
    id: "typing-text-typos",
    title: "Realistic QWERTY Typos",
    description:
      "Simulates human typing mistakes on neighboring keyboard keys with pauses and backspace corrections.",
    component: TypingTextTypos,
  },
]

export { TypingTextSelectDelete, TypingTextTypos }
