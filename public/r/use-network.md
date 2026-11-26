# useNetwork

> Tracks the browser's online and offline status and provides available network connection details such as connection type, downlink speed, and round-trip time.

## Installation

  

  
    ```bash
npx shadcn@latest add https://byphongphan.com/r/use-network.json
```
  

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-network.ts
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

```
      - Update the import paths to match your project setup.
    
  

## Usage

### Offline Status Banner

```tsx
import { useNetwork } from "@/shared/hooks"

export function NetworkStatusBanner() {
  const { online } = useNetwork()

  if (online) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive px-4 py-2 text-center text-sm font-medium text-destructive-foreground">
      You are currently offline. Some features may be unavailable.
    </div>
  )
}
```

### Connection Telemetry Dashboard

```tsx
import { useNetwork } from "@/shared/hooks"

export function ConnectionQualityBadge() {
  const { online, effectiveType, downlink, rtt, saveData } = useNetwork()

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4 text-xs">
      <div className="flex items-center gap-2">
        <span
          className={`size-2 rounded-full ${online ? "bg-emerald-500" : "bg-red-500"}`}
        />
        <span className="font-medium">{online ? "Connected" : "Disconnected"}</span>
      </div>

      {online && (
        <ul className="text-muted-foreground space-y-1">
          <li>Speed: {downlink ? `${downlink} Mbps` : "Unknown"}</li>
          <li>Latency (RTT): {rtt ? `${rtt} ms` : "Unknown"}</li>
          <li>Type: {effectiveType?.toUpperCase() ?? "Unknown"}</li>
          {saveData && <li>Data Saver: Enabled</li>}
        </ul>
      )}
    </div>
  )
}
```

## Features

- **Reactive Online & Offline Detection**: Listens to browser-level `online` and `offline` events with passive event listeners.
- **Network Information API Integration**: Reads connection quality properties (`downlink`, `rtt`, `effectiveType`, `saveData`) on supported browsers (Chromium / Chrome / Edge / Opera).
- **Dynamic Change Tracking**: Automatically recalculates telemetry whenever the underlying network adapter changes (e.g. switching between Wi-Fi and 4G/5G).
- **SSR-Safe**: Gracefully initializes with `{ online: true }` during server rendering to prevent hydration mismatch warnings.
- **Zero Dependencies**: Pure React hook using native Web APIs without external libraries.

## Parameters

The hook takes no arguments: `useNetwork(): NetworkState`.

## Returns

Returns a `NetworkState` object:

| Property        | Type                                                       | Description                                                                 |
| :-------------- | :--------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `online`        | `boolean`                                                  | Whether the browser has active internet connectivity (`navigator.onLine`).   |
| `since`         | `Date \| undefined`                                        | Timestamp representing when the current status was recorded.                |
| `downlink`      | `number \| undefined`                                      | Estimated effective bandwidth in megabits per second (Mbps).                |
| `downlinkMax`   | `number \| undefined`                                      | Maximum downlink speed supported by the physical connection technology.    |
| `effectiveType` | `'slow-2g' \| '2g' \| '3g' \| '4g' \| string \| undefined` | Effective connection type derived from latency and bandwidth calculations.  |
| `rtt`           | `number \| undefined`                                      | Estimated round-trip latency in milliseconds (ms).                          |
| `saveData`      | `boolean \| undefined`                                     | Indicates whether the user has requested a reduced-data mode in browser.    |
| `type`          | `string \| undefined`                                      | Physical connection type (`'wifi'`, `'cellular'`, `'ethernet'`, etc.).      |
