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
