import { cn } from "@/shared/lib/utils"

export function CursorSvg({
  className,
  color = "#ffffff",
}: {
  className?: string
  color?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ color }}
      className={cn(
        "size-7 drop-shadow-[0_4px_14px_rgba(0,0,0,0.55)] sm:size-8 md:size-9",
        className
      )}
    >
      <path
        d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.63-4.63h7.67c.45 0 .67-.54.35-.85L5.5 3.21z"
        fill="currentColor"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ClickBurst({ className }: { className?: string }) {
  return (
    <span
      data-burst=""
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inline-block size-4",
        "before:absolute before:inset-[35%] before:rounded-full before:bg-current",
        "after:absolute after:inset-0 after:rounded-full",
        "after:bg-[conic-gradient(from_0deg,transparent_0_8%,currentColor_8%_12%,transparent_12%_33%,currentColor_33%_37%,transparent_37%_58%,currentColor_58%_62%,transparent_62%_83%,currentColor_83%_87%,transparent_87%)]",
        "after:[mask-image:radial-gradient(circle,transparent_38%,black_40%,black_60%,transparent_62%)]",
        className
      )}
    />
  )
}

export interface CursorProps {
  name?: string
  className?: string
}

export function Cursor({ name = "Phong Phan", className }: CursorProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-20 overflow-visible",
        className
      )}
    >
      <div className="collab-cursor collab-cursor--host absolute text-primary">
        <div className="relative flex items-start">
          <ClickBurst className="-top-1.5 -left-1.5 size-7 text-primary" />
          <CursorSvg color="var(--primary)" />
          <div className="-mt-1 ml-1.5 flex items-center gap-1.5 rounded-full rounded-tl-xs bg-primary px-2.5 py-1 font-sans text-[11px] font-semibold whitespace-nowrap text-primary-foreground shadow-[0_4px_14px_rgba(0,0,0,0.35)] ring-1 ring-white/25 select-none sm:text-xs">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span>{name}</span>
          </div>
        </div>
      </div>

      <style>{`
        .collab-cursor {
          display: inline-block;
          transform-origin: 5px 3px;
          will-change: transform, left, top;
          animation-fill-mode: both;
        }

        .collab-cursor--host {
          animation: collab-host 15s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        .collab-cursor [data-burst] {
          opacity: 0;
          animation: collab-burst 15s ease-in-out infinite;
          animation-fill-mode: both;
        }

        @keyframes collab-host {
          0% {
            top: -14px;
            left: 3%;
            transform: rotate(-12deg) scale(1);
          }
          /* Rê sang góc trên bên phải - resize handle */
          11% {
            top: -8px;
            left: min(94%, calc(100% - 44px));
            transform: rotate(6deg) scale(1);
          }
          14% {
            top: -8px;
            left: min(94%, calc(100% - 44px));
            transform: rotate(0deg) scale(0.9);
          }
          17% {
            top: -8px;
            left: min(94%, calc(100% - 44px));
            transform: rotate(0deg) scale(1);
          }
          /* Rê xuống bắt đầu quét tiêu đề */
          26% {
            top: 30%;
            left: 22%;
            transform: rotate(-8deg) scale(1);
          }

          38% {
            top: 30%;
            left: 72%;
            transform: rotate(-3deg) scale(1);
          }
          41% {
            top: 30%;
            left: 72%;
            transform: rotate(-3deg) scale(0.9);
          }
          44% {
            top: 30%;
            left: 72%;
            transform: rotate(-3deg) scale(1);
          }

          53% {
            top: 55%;
            left: 34%;
            transform: rotate(-10deg) scale(1);
          }

          63% {
            top: 82%;
            left: 50%;
            transform: rotate(-5deg) scale(1);
          }
          66% {
            top: 82%;
            left: 50%;
            transform: rotate(-5deg) scale(0.88);
          }
          69% {
            top: 82%;
            left: 50%;
            transform: rotate(-5deg) scale(1);
          }

          79% {
            top: calc(100% - 22px);
            left: min(94%, calc(100% - 44px));
            transform: rotate(8deg) scale(1);
          }
          82% {
            top: calc(100% - 22px);
            left: min(94%, calc(100% - 44px));
            transform: rotate(8deg) scale(0.9);
          }
          85% {
            top: calc(100% - 22px);
            left: min(94%, calc(100% - 44px));
            transform: rotate(8deg) scale(1);
          }

          93% {
            top: 60%;
            left: 3%;
            transform: rotate(-12deg) scale(1);
          }

          100% {
            top: -14px;
            left: 3%;
            transform: rotate(-12deg) scale(1);
          }
        }

        @keyframes collab-burst {
          0%, 12%, 18%, 39%, 45%, 64%, 70%, 80%, 86%, 100% {
            opacity: 0;
            transform: scale(0.3);
          }
          14%, 41%, 66%, 82% {
            opacity: 1;
            transform: scale(1.1);
          }
          16%, 43%, 68%, 84% {
            opacity: 0;
            transform: scale(1.7);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .collab-cursor,
          .collab-cursor [data-burst] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  )
}
