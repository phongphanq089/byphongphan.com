import { Eye, EyeOff, Loader2 } from "lucide-react"
import * as React from "react"

import { Input } from "@/registry/ui/input"
import { Label } from "@/registry/ui/label"
import { cn } from "@/shared/lib/utils"

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
