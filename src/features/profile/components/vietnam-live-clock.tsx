import { useEffect, useState } from "react"

/**
 * Live running clock formatted for the Vietnam timezone (Asia/Ho_Chi_Minh, UTC+7).
 * Updates every second with tabular numerals for stable layout width.
 */
export function VietnamLiveClock() {
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      setTime(formatter.format(now))
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!time) {
    return <span className="font-mono tabular-nums opacity-60">--:--:--</span>
  }

  return <span className="font-mono tabular-nums">{time}</span>
}
