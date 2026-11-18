# Login 01

> Split-screen modern authentication screen with photography hero, tracked typography, and full dark mode support.

## Installation

```bash
npx shadcn@latest add https://byphongphan.com/r/login-01.json
```

## Source Code

### `block/login-01/page.tsx`

```tsx
import { LoginForm } from "./components/login-form"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col bg-background text-foreground select-none lg:flex-row">
      {/* ── Left Column: Form & Brand Area ── */}
      <section className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:w-1/2 lg:p-14 xl:p-20">
        {/* Center: Heading & Form */}
        <main className="my-auto w-full max-w-[380px] self-center py-10 sm:py-14">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
              Welcome back.
            </h1>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Sign in to see your upcoming sessions, read your notes, or move a
              slot.
            </p>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>
        </main>

        {/* Footer: Signup Link */}
        <footer className="w-full max-w-[380px] self-center text-xs text-muted-foreground sm:text-sm">
          <span>New here? </span>
          <a
            href="#book-conversation"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
          >
            Book a first conversation instead
          </a>
        </footer>
      </section>

      {/* ── Right Column: Photographic Visual & Editorial Quote ── */}
      <aside className="relative hidden w-1/2 overflow-hidden bg-zinc-950 select-none lg:block">
        {/* Ocean & Swimmers Scenic Photograph */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2160&q=80"
          alt="Serene turquoise ocean water with sunny atmosphere"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 will-change-transform hover:scale-[1.03] dark:brightness-[0.88] dark:contrast-[1.05]"
          loading="eager"
        />

        {/* Dark Gradient Overlay for optimal quote readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5 dark:from-zinc-950/95 dark:via-black/50 dark:to-black/20" />

        {/* Editorial Quote at Bottom */}
        <div className="absolute right-0 bottom-0 left-0 p-8 sm:p-12 lg:p-16">
          <p className="max-w-md text-sm leading-relaxed font-normal text-white/95 drop-shadow sm:text-base">
            Your notes are only ever visible to you and your practitioner.
          </p>
        </div>
      </aside>
    </div>
  )
}

```

### `block/login-01/components/login-form.tsx`

```tsx
import { Eye, EyeOff, Loader2 } from "lucide-react"
import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface LoginFormProps {
  className?: string
  onSuccess?: () => void
}

export function LoginForm({ className, onSuccess }: LoginFormProps) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication delay for interaction feedback
    await new Promise((resolve) => setTimeout(resolve, 900))
    setIsLoading(false)
    onSuccess?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col space-y-5", className)}
      noValidate
    >
      {/* ── 1. Email Field ── */}
      <div className="flex flex-col space-y-2">
        <Label
          htmlFor="login-email"
          className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase select-none"
        >
          Email
        </Label>
        <Input
          id="login-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          className="h-11 rounded-xl border-zinc-200 bg-white/70 px-3.5 text-sm transition-all focus-visible:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus-visible:border-zinc-700 dark:focus-visible:ring-white/10"
        />
      </div>

      {/* ── 2. Password Field ── */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="login-password"
            className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase select-none"
          >
            Password
          </Label>
          <a
            href="#forgot-password"
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Forgotten your password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="h-11 rounded-xl border-zinc-200 bg-white/70 px-3.5 pr-10 text-sm transition-all focus-visible:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus-visible:border-zinc-700 dark:focus-visible:ring-white/10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── 3. Pill Submit Button with Indicator ── */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "relative flex h-11 w-full items-center justify-between rounded-full px-5 text-sm font-medium transition-all duration-200 select-none active:scale-[0.99]",
            "bg-zinc-950 text-white shadow-sm hover:bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white",
            "disabled:pointer-events-none disabled:opacity-60"
          )}
        >
          {/* Invisible spacer to guarantee exact visual centering */}
          <span className="size-2 opacity-0" aria-hidden="true" />

          {/* Centered label */}
          <span className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin text-current" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </span>

          {/* Right indicator mark */}
          <span
            className="flex size-2 items-center justify-center"
            aria-hidden="true"
          >
            <span className="size-1.5 rounded-full bg-current opacity-80" />
          </span>
        </button>
      </div>
    </form>
  )
}

```
