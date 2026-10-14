const ITEMS = [
  { active: true, width: 50 },
  { active: false, width: 30 },
  { active: false, width: 30 },
  { active: false, width: 30 },
  { active: false, width: 30 },
  { active: false, width: 30 },
  { active: false, width: 30 },
  { active: false, width: 30 },
  { active: false, width: 30 },
]

export function LineNavSchematic() {
  return (
    <div className="relative w-full max-w-[210px] overflow-hidden rounded-md bg-background px-3 py-2 select-none">
      <div className="flex flex-col">
        {ITEMS.map((item, index) => (
          <div key={index} className="flex h-[15px] items-center gap-4">
            <div className="flex h-full w-[30px] shrink-0 items-center">
              <span
                className={[
                  "block h-px transition-all",
                  item.active
                    ? "w-[50px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    : "w-[30px] bg-white/20",
                ].join(" ")}
              />
            </div>

            <div className="flex min-w-0 flex-1 items-center">
              <span
                className={[
                  "block h-[2px] rounded-[1px] transition-all",
                  item.active
                    ? "w-[82px] bg-black shadow-[0_0_6px_rgba(255,255,255,0.15)] dark:bg-white"
                    : [
                        "w-[105px]",
                        "bg-black/30 dark:bg-white/25",
                        index === 1 && "w-[112px]",
                        index === 2 && "w-[98px]",
                        index === 3 && "w-[91px]",
                        index === 4 && "w-[118px]",
                        index === 5 && "w-[83px]",
                        index === 6 && "w-[76px]",
                        index === 7 && "w-[110px]",
                        index === 8 && "w-[102px]",
                      ]
                        .filter(Boolean)
                        .join(" "),
                ].join(" ")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LineNavSchematic
