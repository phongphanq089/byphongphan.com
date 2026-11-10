import { Globe } from "lucide-react"

export function Avatar3x4Card() {
  return (
    <div className="relative w-64 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/15 backdrop-blur-xl sm:w-72">
      {/* 3:4 Aspect Ratio Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        <img
          src="/avatar-about.jpg"
          alt="Phong Phan"
          className="size-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Bottom Dark Gradient with Bio & Details */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/65 to-transparent p-4 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-white">
              Phong Phan
            </h3>
            <span className="font-mono text-[10px] text-white/60">
              @phongphanq089
            </span>
          </div>

          <p className="mt-0.5 text-xs font-medium text-white/80">
            Frontend Engineer · Fullstack Capable
          </p>

          <p className="mt-1 flex items-center gap-1 font-mono text-[11px] text-white/70">
            <Globe className="size-3 text-white/70" />
            <span>Vietnamese</span>
          </p>

          <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-white/70">
            Crafting fluid interfaces, micro-interactions &amp; high-craft web
            systems with obsessive attention to detail.
          </p>
        </div>
      </div>

      {/* Popover Arrow pointer at bottom center */}
      <div
        aria-hidden="true"
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2"
      >
        <div className="size-3 rotate-45 border-r border-b border-border/80 bg-black shadow-xs" />
      </div>
    </div>
  )
}

export default Avatar3x4Card
