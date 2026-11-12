import { MusicPlayer } from "@/features/music"

/**
 * In-content Soundtrack block: the site's vinyl player embedded directly in
 * the profile flow (no close button — rendered as fixed content, not a popup).
 * The class overrides expand the player's responsive fixed widths to fill the
 * container; tailwind-merge keeps the trailing utility per variant.
 */
export function ProfileMusicCard() {
  return (
    <section aria-label="Soundtrack" className="flex flex-col gap-3">
      <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
        ( Soundtrack )
      </p>
      <MusicPlayer
        showCloseButton={false}
        className="w-full max-w-full rounded-2xl border border-border/80 bg-card/30 backdrop-blur-md xs:max-w-full sm:w-full sm:max-w-full md:w-full md:max-w-full"
      />
    </section>
  )
}
