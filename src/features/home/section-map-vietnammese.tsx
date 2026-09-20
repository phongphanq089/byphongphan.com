import { Compass, Crosshair, Globe2, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

import { GridContainer } from "@/app/layouts"
import {
  Badge,
  Button,
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  useMap,
} from "@/shared/ui"

// Coordinates for Ninh Hoa town (Khanh Hoa province) & Vietnam overview
const NINH_HOA_COORDINATES = {
  longitude: 109.126,
  latitude: 12.4917,
  name: "Ninh Hoà",
  province: "Khánh Hoà",
  country: "Vietnam",
  region: "Khánh Hoà, South Central Coast",
  elevation: "Coastal Town",
  timezone: "UTC+7 (ICT)",
} as const

const VIETNAM_CENTER = {
  longitude: 108.2772,
  latitude: 14.0583,
  zoom: 5.6,
} as const

type MapViewMode = "ninh-hoa" | "vietnam"

/**
 * Controller component inside Map that programmatically animates
 * camera positions when switching view modes.
 */
function MapCameraHandler({ viewMode }: { viewMode: MapViewMode }) {
  const { map } = useMap()

  useEffect(() => {
    if (!map) return

    if (viewMode === "ninh-hoa") {
      map.flyTo({
        center: [NINH_HOA_COORDINATES.longitude, NINH_HOA_COORDINATES.latitude],
        zoom: 11.2,
        pitch: 28,
        bearing: 0,
        essential: true,
        duration: 2000,
      })
    } else {
      map.flyTo({
        center: [VIETNAM_CENTER.longitude, VIETNAM_CENTER.latitude],
        zoom: VIETNAM_CENTER.zoom,
        pitch: 0,
        bearing: 0,
        essential: true,
        duration: 2200,
      })
    }
  }, [viewMode, map])

  return null
}

export function SectionMapVietnamese() {
  const [viewMode, setViewMode] = useState<MapViewMode>("ninh-hoa")

  return (
    <div className="w-full">
      <GridContainer
        showCrosshairs={false}
        borderLeft={false}
        borderRight={false}
        borderBottom
        className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-foreground">
            {NINH_HOA_COORDINATES.name}, {NINH_HOA_COORDINATES.province},{" "}
            {NINH_HOA_COORDINATES.country}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="font-mono text-xs text-muted-foreground">
            {NINH_HOA_COORDINATES.latitude.toFixed(4)}°N,{" "}
            {NINH_HOA_COORDINATES.longitude.toFixed(4)}°E
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "ninh-hoa" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("ninh-hoa")}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <Crosshair className="size-3.5" />
            Focus Ninh Hoà
          </Button>
          <Button
            variant={viewMode === "vietnam" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("vietnam")}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <Globe2 className="size-3.5" />
            Vietnam Overview
          </Button>
        </div>
      </GridContainer>

      <div className="">
        <div className="relative h-[440px] w-full overflow-hidden bg-background sm:h-[520px] md:h-[580px]">
          <Map
            center={[
              NINH_HOA_COORDINATES.longitude,
              NINH_HOA_COORDINATES.latitude,
            ]}
            zoom={9.0}
            minZoom={3.5}
            maxZoom={16}
            pitch={20}
            cooperativeGestures={true}
            className="size-full"
          >
            {/* Programmatic Camera Controller */}
            <MapCameraHandler viewMode={viewMode} />

            {/* Standard Map Controls (Zoom, Compass, Fullscreen) */}
            <MapControls
              position="top-right"
              showZoom
              showCompass
              showFullscreen
            />

            {/* Ninh Hoa Living Location Marker */}
            <MapMarker
              longitude={NINH_HOA_COORDINATES.longitude}
              latitude={NINH_HOA_COORDINATES.latitude}
            >
              <MarkerContent className="group cursor-pointer">
                <div className="relative -mt-10 flex size-8 items-center justify-center">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/25 opacity-75" />
                  <span className="absolute inline-flex size-6 animate-pulse rounded-full border border-primary/50 bg-primary/30" />
                  <span className="relative flex size-3.5 items-center justify-center rounded-full border-2 border-white bg-primary shadow-[0_0_12px_var(--primary)]">
                    <span className="size-1 rounded-full bg-white" />
                  </span>
                </div>
              </MarkerContent>

              {/* Click / Tap Popup with Detailed Telemetry */}
              <MarkerPopup
                closeButton
                offset={18}
                className="max-w-xs border-border/80 bg-popover/95 p-3.5 backdrop-blur-md"
              >
                <div className="space-y-2 pt-5">
                  <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <MapPin className="size-3.5 text-primary" />
                      <span>{NINH_HOA_COORDINATES.name}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {NINH_HOA_COORDINATES.province}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Coordinates:</span>
                      <span className="font-mono text-foreground">
                        {NINH_HOA_COORDINATES.latitude.toFixed(4)}°N,{" "}
                        {NINH_HOA_COORDINATES.longitude.toFixed(4)}°E
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Region:</span>
                      <span className="text-foreground">
                        {NINH_HOA_COORDINATES.region}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Timezone:</span>
                      <span className="font-mono text-foreground">
                        {NINH_HOA_COORDINATES.timezone}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Coastal town in Khánh Hoà province specializing in
                      frontend craft, web animations, and design systems.
                    </p>
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          </Map>

          {/* Bottom-left telemetry HUD badge */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden items-center gap-2 rounded-sm border border-border/80 bg-background/85 px-3 py-1.5 shadow-sm backdrop-blur-md sm:flex">
            <Compass className="size-3.5 animate-spin text-muted-foreground [animation-duration:12s]" />
            <span className="font-mono text-[11px] text-muted-foreground">
              Ctrl + Scroll to zoom • CARTO Basemap
            </span>
          </div>

          {/* Mobile indicator badge */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-2 py-1 shadow-sm backdrop-blur-md sm:hidden">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="text-[10px] text-primary">Ninh Hoà, VN</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionMapVietnamese
