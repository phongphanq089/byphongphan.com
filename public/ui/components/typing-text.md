# Typing Text

> Realistic human typewriter effect with organic timing variance, simulated QWERTY typos with self-correction, and select-sweep erasure.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/typing-text.json
```

  
    
      - Install the required motion dependency:
      ```bash
npm install motion
```

      - Copy and paste the component into your project:
      ```tsx
// animated/typing-text.tsx
import { motion, useInView, useReducedMotion } from "motion/react"
import { type Ref, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

export interface TypewriterSequence {
  text: string
  deleteAfter?: boolean
  pauseAfter?: number
}

export type TypewriterElement = "div" | "p" | "span" | "h1" | "h2" | "h3"

export interface TypingTextProps {
  /** Sequence phrases to type and cycle through */
  sequences?: TypewriterSequence[]
  /** Typing speed in ms per character @default 50 */
  typingSpeed?: number
  /** Delay before typing begins in ms @default 200 */
  startDelay?: number
  /** Whether to continuously loop after the last sequence @default true */
  autoLoop?: boolean
  /** Delay before looping back to the first sequence @default 1000 */
  loopDelay?: number
  /** Backspace deletion speed in ms per character @default 30 */
  deleteSpeed?: number
  /** Pause duration before deleting a completed sequence in ms @default 1000 */
  pauseBeforeDelete?: number
  /** Whether typing speed has organic human variance @default true */
  naturalVariance?: boolean
  /**
   * How a phrase is erased. `"backspace"` removes it one character at a time;
   * `"select"` highlights it right to left, as with Shift+Home, then cuts it in one go.
   * @default "backspace"
   */
  deleteMode?: "backspace" | "select"
  /**
   * Hit a neighbouring key now and then, pause, backspace and correct it.
   * `true` is about a 4% chance per letter; a number sets the chance.
   * @default false
   */
  typos?: boolean | number
  /** Seed for the variance and typos, so every visit types the same way @default 7 */
  seed?: number
  /** Stops the typing where it is (WCAG 2.2.2). It also pauses while off screen. */
  paused?: boolean
  /** Element to render @default "div" */
  as?: TypewriterElement
  /** Classes for the wrapper */
  className?: string
  /** Classes for the text container */
  textClassName?: string
}

const DEFAULT_SEQUENCES: TypewriterSequence[] = [
  { text: "Typewriter", deleteAfter: true },
  { text: "Multiple Words", deleteAfter: true },
  { text: "Auto Loop", deleteAfter: false },
]

const NEXT_SEQUENCE_DELAY = 100
const CARET_IDLE_MS = 500
const TYPO_NOTICE_MS = 250
const DEFAULT_TYPO_RATE = 0.04
const SELECT_SWEEP_MS = 120
const SELECT_HOLD_MS = 220

const CARET_KEYFRAMES =
  "@keyframes typing-text-caret { 0%, 33.333% { opacity: 1; } 66.667%, 100% { opacity: 0; } }"

const KEY_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"]

/** The keys around a letter on a QWERTY keyboard, in the same case. */
function neighbours(char: string) {
  const lower = char.toLowerCase()
  const row = KEY_ROWS.findIndex((keys) => keys.includes(lower))
  if (row === -1) {
    return ""
  }
  const col = KEY_ROWS[row].indexOf(lower)
  const around = [
    KEY_ROWS[row][col - 1],
    KEY_ROWS[row][col + 1],
    KEY_ROWS[row - 1]?.[col],
    KEY_ROWS[row + 1]?.[col],
  ]
    .filter(Boolean)
    .join("")
  return char === lower ? around : around.toUpperCase()
}

/** Small seeded generator (Park-Miller), 0 to 1. */
function createRandom(seed: number) {
  let state = (Math.abs(Math.floor(seed)) % 2_147_483_646) + 1
  return () => {
    state = (state * 16_807) % 2_147_483_647
    return (state - 1) / 2_147_483_646
  }
}

function getTypingDelay(
  typingSpeed: number,
  naturalVariance: boolean,
  random: () => number
) {
  if (!naturalVariance) {
    return typingSpeed
  }
  const roll = random()
  // 10% chance of a hesitation, 10% chance of a burst.
  if (roll < 0.1) {
    return typingSpeed * 2
  }
  if (roll > 0.9) {
    return typingSpeed * 0.5
  }
  // Otherwise +/- 40%.
  return typingSpeed * (0.6 + random() * 0.8)
}

class Stopped extends Error {}

interface Position {
  sequence: number
  char: number
  deleting: boolean
}

interface Screen {
  text: string
  /** Characters at the end of `text` shown as selected. */
  selected: number
}

export function TypingText({
  sequences = DEFAULT_SEQUENCES,
  typingSpeed = 50,
  startDelay = 200,
  autoLoop = true,
  loopDelay = 1000,
  deleteSpeed = 30,
  pauseBeforeDelete = 1000,
  naturalVariance = true,
  deleteMode = "backspace",
  typos = false,
  seed = 7,
  paused = false,
  as: Component = "div",
  className,
  textClassName,
}: TypingTextProps) {
  const [screen, setScreen] = useState<Screen>({ text: "", selected: 0 })
  const ref = useRef<HTMLSpanElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref)
  const isRunning = !paused && isInView
  const shouldReduceMotion = useReducedMotion()
  const position = useRef<Position>({ sequence: 0, char: 0, deleting: false })
  const random = useRef<() => number>(createRandom(seed))

  const sequencesRef = useRef(sequences)
  useEffect(() => {
    sequencesRef.current = sequences
  }, [sequences])

  useEffect(() => {
    random.current = createRandom(seed)
  }, [seed])

  // Reduced motion: show the final phrase, no typing loop.
  const finalText = sequences.at(-1)?.text ?? ""
  useEffect(() => {
    if (shouldReduceMotion) {
      setScreen({ text: finalText, selected: 0 })
    }
  }, [shouldReduceMotion, finalText])

  useEffect(() => {
    if (shouldReduceMotion) {
      return
    }
    // Paused or off screen: keep the current text.
    if (!isRunning) {
      return
    }

    let typoRate = 0
    if (typeof typos === "number") {
      typoRate = typos
    } else if (typos) {
      typoRate = DEFAULT_TYPO_RATE
    }
    const pos = position.current
    const timers = new Set<ReturnType<typeof setTimeout>>()
    let idleTimer: ReturnType<typeof setTimeout> | undefined
    let stopped = false

    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        if (stopped) {
          reject(new Stopped())
          return
        }
        const timer = setTimeout(() => {
          timers.delete(timer)
          if (stopped) {
            reject(new Stopped())
          } else {
            resolve()
          }
        }, ms)
        timers.add(timer)
      })

    // Every keystroke holds the caret solid; it blinks again once idle.
    const keystroke = () => {
      const caret = caretRef.current
      if (!caret) {
        return
      }
      caret.dataset.idle = "false"
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        caret.dataset.idle = "true"
      }, CARET_IDLE_MS)
    }

    const show = (text: string, selected = 0) => {
      setScreen({ text, selected })
    }

    const typeChar = async (text: string) => {
      const wrongKeys = neighbours(text[pos.char])
      if (wrongKeys && random.current() < typoRate) {
        const wrong =
          wrongKeys[Math.floor(random.current() * wrongKeys.length)]
        show(text.slice(0, pos.char) + wrong)
        keystroke()
        await wait(TYPO_NOTICE_MS + typingSpeed)
        show(text.slice(0, pos.char))
        keystroke()
        await wait(typingSpeed * 1.5)
      }
      pos.char += 1
      show(text.slice(0, pos.char))
      keystroke()
      await wait(getTypingDelay(typingSpeed, naturalVariance, random.current))
    }

    const erase = async (text: string) => {
      if (deleteMode === "select") {
        const length = pos.char
        const step = SELECT_SWEEP_MS / Math.max(length, 1)
        for (let selected = 1; selected <= length; selected++) {
          show(text.slice(0, length), selected)
          keystroke()
          await wait(step)
        }
        await wait(SELECT_HOLD_MS)
        pos.char = 0
        show("")
        keystroke()
        return
      }
      while (pos.char > 0) {
        pos.char -= 1
        show(text.slice(0, pos.char))
        keystroke()
        await wait(deleteSpeed)
      }
    }

    /** Move on to the next phrase. False when the run is over. */
    const advance = async (delay: number) => {
      const isLast = pos.sequence >= sequencesRef.current.length - 1
      if (isLast && !autoLoop) {
        return false
      }
      pos.sequence = isLast ? 0 : pos.sequence + 1
      pos.char = 0
      pos.deleting = false
      await wait(isLast ? loopDelay : delay)
      show("")
      return true
    }

    const phrase = async () => {
      const list = sequencesRef.current
      if (pos.sequence >= list.length) {
        pos.sequence = 0
        pos.char = 0
        pos.deleting = false
      }
      const sequence = list[pos.sequence]
      if (!sequence) {
        return false
      }
      const { text } = sequence
      pos.char = Math.min(pos.char, text.length)
      show(text.slice(0, pos.char))

      if (!pos.deleting) {
        while (pos.char < text.length) {
          await typeChar(text)
        }
        const pause = sequence.pauseAfter ?? pauseBeforeDelete
        const isLast = pos.sequence === list.length - 1
        if (!(sequence.deleteAfter || (isLast && autoLoop))) {
          return advance(pause)
        }
        await wait(pause)
        pos.deleting = true
      }
      await erase(text)
      return advance(NEXT_SEQUENCE_DELAY)
    }

    const run = async () => {
      try {
        await wait(startDelay)
        while (await phrase()) {
          // Loop continues
        }
      } catch (error) {
        if (!(error instanceof Stopped)) {
          throw error
        }
      }
    }
    run()

    const caret = caretRef.current
    return () => {
      stopped = true
      for (const timer of timers) {
        clearTimeout(timer)
      }
      clearTimeout(idleTimer)
      if (caret) {
        caret.dataset.idle = "true"
      }
    }
  }, [
    typingSpeed,
    deleteSpeed,
    pauseBeforeDelete,
    autoLoop,
    loopDelay,
    startDelay,
    naturalVariance,
    deleteMode,
    typos,
    shouldReduceMotion,
    isRunning,
  ])

  const kept = screen.text.slice(0, screen.text.length - screen.selected)
  const selected = screen.text.slice(kept.length)

  return (
    <Component
      className={cn(
        "flex w-full items-center justify-center font-mono text-foreground tracking-tight",
        className
      )}
    >
      <style>{CARET_KEYFRAMES}</style>
      <span className="sr-only">
        {sequences.map((sequence) => sequence.text).join(", ")}
      </span>
      <motion.span
        animate={{ opacity: 1 }}
        aria-hidden="true"
        className={cn(
          "inline-grid justify-items-start whitespace-pre pr-[0.25em] text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.2]",
          textClassName
        )}
        initial={{ opacity: 0 }}
        ref={ref}
        transition={{ duration: 0.5 }}
      >
        {sequences.map((sequence, index) => (
          <span
            className="invisible col-start-1 row-start-1"
            key={index}
          >
            {sequence.text}
          </span>
        ))}
        <span className="col-start-1 row-start-1 min-h-[1.2em]">
          {kept}
          <Caret caretRef={caretRef} />
          {selected && (
            <span className="rounded-[0.08em] bg-primary/25 text-primary">
              {selected}
            </span>
          )}
        </span>
      </motion.span>
    </Component>
  )
}

function Caret({ caretRef }: { caretRef: Ref<HTMLSpanElement> }) {
  return (
    <span className="relative inline-block w-0">
      <span
        className="absolute bottom-[-0.1em] left-[0.04em] h-[1.05em] w-[0.08em] min-w-[2px] bg-primary motion-safe:data-[idle=true]:animate-[typing-text-caret_1s_linear_infinite]"
        data-idle="true"
        ref={caretRef}
      />
    </span>
  )
}

export { TypingText as TypewriterTitle }
export default TypingText

```

      - Update the import paths to match your project directory structure.
    

  

---

## Anatomy

```text
TypingText (Full-width accessible typography wrapper)
├── <span className="sr-only"> (Full sequence strings for screen reader accessibility)
└── <motion.span> (CSS Grid overlay ensuring container width never jitters)
    ├── <span (invisible)> (Static ghost copy of longest phrase to pin layout dimensions)
    └── <span> (Live typed characters)
        ├── <Caret> (Solid while active, blinking keyframe animation when idle)
        └── <span (selected)> (High-contrast selection sweep highlight when deleteMode="select")
```

---

## Usage

```tsx
import { TypingText } from "@/components/typing-text"
```

```tsx
export function HeroTyping() {
  const phrases = [
    { text: "Creative Developer", deleteAfter: true },
    { text: "Design Systems Engineer", deleteAfter: true },
    { text: "Building Modern Web Apps", deleteAfter: false },
  ]

  return (
    <TypingText
      sequences={phrases}
      typingSpeed={50}
      deleteSpeed={30}
      deleteMode="select"
      typos={true}
      className="text-primary font-bold text-4xl"
    />
  )
}
```

---

## Features

- **Zero-Jitter CSS Grid Layout**: Renders every sequence invisibly in the same grid cell so the container locks to the rendered width of the longest phrase, completely eliminating layout shifts.
- **Organic Human Timing**: Uses seeded pseudo-random distribution (Park-Miller generator) with 10% hesitation delays and burst strokes mimicking realistic human cadence.
- **Accidental Typos & Self-Correction**: When `typos` is enabled, occasionally strikes neighbouring QWERTY keys, pauses in realization, backspaces, and corrects itself.
- **Selection-Sweep Erasure**: Supports `deleteMode="select"` which highlights the phrase in reverse (like Shift+Home) before cutting it in one swift motion.
- **Accessible & Battery Friendly**: Fully pauses while off-screen (`useInView`), respects `useReducedMotion()`, and exposes natural text to screen readers.

---

## API Reference

### TypingText

Realistic human typewriter effect component.

| Prop                 | Type                                    | Default                                          | Description                                                                     |
| :------------------- | :-------------------------------------- | :----------------------------------------------- | :------------------------------------------------------------------------------ |
| `sequences`          | `TypewriterSequence[]`                  | `[{ text: "Typewriter", deleteAfter: true }, ...]`| Array of phrases and per-phrase pause configurations.                           |
| `typingSpeed`        | `number`                                | `50`                                             | Base typing speed in milliseconds per character.                                |
| `deleteSpeed`        | `number`                                | `30`                                             | Character deletion speed in milliseconds.                                       |
| `deleteMode`         | `"backspace" \| "select"`               | `"backspace"`                                    | How phrases erase: character backspace vs reverse selection highlight sweep.   |
| `typos`              | `boolean \| number`                     | `false`                                          | Enable realistic neighboring QWERTY key typos (boolean or custom rate 0-1).     |
| `naturalVariance`    | `boolean`                               | `true`                                           | Adds organic hesitations (+/-40%) to typing speed.                              |
| `pauseBeforeDelete`  | `number`                                | `1000`                                           | Pause duration before erasing a completed phrase in ms.                         |
| `loopDelay`          | `number`                                | `1000`                                           | Delay before repeating the sequences loop in ms.                                |
| `autoLoop`           | `boolean`                               | `true`                                           | Whether to restart the sequence loop indefinitely.                              |
| `as`                 | `"div" \| "p" \| "span" \| "h1"-"h3"`   | `"div"`                                          | HTML element to render the container as.                                        |
| `className`          | `string`                                | `undefined`                                      | CSS classes for the outer container.                                            |
| `textClassName`      | `string`                                | `undefined`                                      | CSS classes for the typed text element.                                         |
