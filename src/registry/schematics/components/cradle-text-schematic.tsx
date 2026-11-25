export function CradleTextSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-background p-3 select-none dark:bg-neutral-950/80">
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          CRADLE TEXT
        </span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      <div className="relative flex h-16 flex-col items-center justify-center">
        {/* Overhead rail */}
        <div className="absolute inset-x-4 top-2 h-0.5 rounded-full bg-primary/40" />

        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 160 50"
          fill="none"
        >
          {/* Left swinging thread and bob */}
          <line
            x1="30"
            y1="8"
            x2="16"
            y2="34"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="1.2"
          />
          <circle cx="16" cy="34" r="5" className="fill-primary" />

          {/* Middle threads and bobs at rest */}
          {[50, 70, 90, 110].map((x) => (
            <g key={x}>
              <line
                x1={x}
                y1="8"
                x2={x}
                y2="36"
                stroke="currentColor"
                className="text-muted-foreground/40"
                strokeWidth="1"
              />
              <circle
                cx={x}
                cy="36"
                r="4.5"
                className="fill-muted-foreground/60"
              />
            </g>
          ))}

          {/* Right resting bob */}
          <line
            x1="130"
            y1="8"
            x2="130"
            y2="36"
            stroke="currentColor"
            className="text-muted-foreground/40"
            strokeWidth="1"
          />
          <circle
            cx="130"
            cy="36"
            r="4.5"
            className="fill-muted-foreground/60"
          />
        </svg>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Newton&apos;s Cradle</span>
        <span className="font-medium text-primary">Impulse Clack</span>
      </div>
    </div>
  )
}

export default CradleTextSchematic
