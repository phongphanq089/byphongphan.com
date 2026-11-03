import { useState, useEffect } from "react"

export interface NetworkState {
  online: boolean
  since?: Date
  downlink?: number
  downlinkMax?: number
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g" | string
  rtt?: number
  saveData?: boolean
  type?: string
}

interface NetworkInformation extends EventTarget {
  readonly downlink?: number
  readonly downlinkMax?: number
  readonly effectiveType?: "slow-2g" | "2g" | "3g" | "4g"
  readonly rtt?: number
  readonly saveData?: boolean
  readonly type?: string
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

const getConnection = (): NetworkInformation | undefined => {
  if (typeof navigator === "undefined") return undefined
  const nav = navigator as NavigatorWithConnection
  return nav.connection || nav.mozConnection || nav.webkitConnection
}

const getNetworkState = (): NetworkState => {
  if (typeof navigator === "undefined") {
    return { online: true }
  }

  const connection = getConnection()

  return {
    online: navigator.onLine,
    since: new Date(),
    downlink: connection?.downlink,
    downlinkMax: connection?.downlinkMax,
    effectiveType: connection?.effectiveType,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
    type: connection?.type,
  }
}

export function useNetwork(): NetworkState {
  const [state, setState] = useState<NetworkState>(() => ({
    online: true,
  }))

  useEffect(() => {
    setState(getNetworkState())

    const handleUpdate = () => {
      setState(getNetworkState())
    }

    window.addEventListener("online", handleUpdate, { passive: true })
    window.addEventListener("offline", handleUpdate, { passive: true })

    const connection = getConnection()
    if (connection) {
      connection.addEventListener("change", handleUpdate, { passive: true })
    }

    return () => {
      window.removeEventListener("online", handleUpdate)
      window.removeEventListener("offline", handleUpdate)
      if (connection) {
        connection.removeEventListener("change", handleUpdate)
      }
    }
  }, [])

  return state
}
