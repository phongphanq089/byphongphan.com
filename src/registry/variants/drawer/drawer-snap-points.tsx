import { useState } from "react"
import { Button } from "@/registry/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/ui/drawer"

const SNAP_POINTS = [0.35, 0.7, 1]

export function DrawerSnapPoints() {
  const [snapPoint, setSnapPoint] = useState<number | string | null>(
    SNAP_POINTS[0]
  )

  return (
    <Drawer
      snapPoints={SNAP_POINTS}
      snapPoint={snapPoint}
      onSnapPointChange={setSnapPoint}
    >
      <DrawerTrigger render={<Button variant="outline" />}>
        Snap Points (35%, 70%, 100%)
      </DrawerTrigger>
      <DrawerPopup showBar>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Multiple Snap Points</DrawerTitle>
            <DrawerDescription>
              Drag the drawer or select a preset snap point below.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerPanel className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Presets:
              </span>
              <div className="flex gap-2">
                {SNAP_POINTS.map((point) => (
                  <Button
                    key={point}
                    size="sm"
                    variant={snapPoint === point ? "default" : "outline"}
                    onClick={() => setSnapPoint(point)}
                  >
                    {Math.round(point * 100)}%
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <div>
                  Active Snap Point:{" "}
                  <span className="font-semibold text-foreground">
                    {typeof snapPoint === "number"
                      ? `${Math.round(snapPoint * 100)}%`
                      : String(snapPoint)}
                  </span>
                </div>
                <div>Configured Points: [0.35, 0.7, 1.0]</div>
              </div>
            </div>

            <div className="space-y-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="flex h-10 items-center justify-between rounded-lg border border-border/60 bg-card px-3 text-sm text-card-foreground"
                >
                  <span>Activity stream event #{i + 1}</span>
                  <span className="text-xs text-muted-foreground">
                    Just now
                  </span>
                </div>
              ))}
            </div>
          </DrawerPanel>
          <DrawerFooter variant="bare">
            <DrawerClose render={<Button variant="outline" />}>
              Close
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerPopup>
    </Drawer>
  )
}

export default DrawerSnapPoints
