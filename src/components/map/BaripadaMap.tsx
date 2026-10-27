"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import { BINS, BARIPADA_CENTER, SmartBin } from "@/app/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  MapPin, 
  Compass, 
  RotateCcw,
  AlertCircle,
  Loader2,
  Navigation,
  Layers
} from "lucide-react"
import { cn } from "@/lib/utils"
import 'leaflet/dist/leaflet.css'

interface BaripadaMapProps {
  initialWard?: number | "all"
  onSelectBin?: (bin: SmartBin | null) => void
  selectedBinId?: string | null
  heightClassName?: string
  showControls?: boolean
  showAdminActions?: boolean
  role?: "citizen" | "worker" | "admin"
}

export default function BaripadaMap({
  initialWard = "all",
  onSelectBin,
  selectedBinId,
  heightClassName = "h-full min-h-[550px]",
  showControls = true,
  showAdminActions = false,
  role = "citizen"
}: BaripadaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const isInitializingRef = useRef<boolean>(false)
  const markersLayerRef = useRef<any>(null)
  const markersMapRef = useRef<Map<string, any>>(new Map())
  const userMarkerRef = useRef<any>(null)

  const [selectedWard, setSelectedWard] = useState<string>(initialWard.toString())
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // Filtered bins according to current criteria
  const filteredBins = useMemo(() => {
    return BINS.filter((bin) => {
      const matchesWard = selectedWard === "all" || bin.ward.toString() === selectedWard
      const matchesStatus = 
        statusFilter === "all" ? true :
        statusFilter === "urgent" ? bin.fillLevel > 85 :
        statusFilter === "high" ? (bin.fillLevel > 70 && bin.fillLevel <= 85) :
        statusFilter === "normal" ? (bin.fillLevel > 30 && bin.fillLevel <= 70) :
        bin.fillLevel <= 30
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = !query || 
        bin.id.toLowerCase().includes(query) ||
        bin.location.toLowerCase().includes(query) ||
        bin.wardName.toLowerCase().includes(query) ||
        bin.ward.toString() === query

      return matchesWard && matchesStatus && matchesSearch
    })
  }, [selectedWard, statusFilter, searchQuery])

  // Sync selected bin from props
  useEffect(() => {
    if (selectedBinId) {
      const found = BINS.find(b => b.id === selectedBinId)
      if (found && mapInstanceRef.current && found.lat && found.lng) {
        mapInstanceRef.current.flyTo([found.lat, found.lng], 16, { duration: 0.8 })
        const marker = markersMapRef.current.get(found.id)
        if (marker) {
          marker.openPopup()
        }
      }
    }
  }, [selectedBinId])

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true

    async function initLeaflet() {
      if (!mapContainerRef.current || mapInstanceRef.current || isInitializingRef.current) return
      isInitializingRef.current = true

      try {
        const L = (await import('leaflet')).default

        // Guard against component unmounting while waiting for dynamic import
        if (!isMounted || !mapContainerRef.current) {
          isInitializingRef.current = false
          return
        }

        // Clean up any stale map instance or Leaflet ID attached to the container
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove()
          } catch (e) {
            console.warn("Cleaned up existing map instance:", e)
          }
          mapInstanceRef.current = null
        }

        const container = mapContainerRef.current as HTMLElement & { _leaflet_id?: number | string | null }
        if (container && container._leaflet_id) {
          delete container._leaflet_id
        }

        if (!isMounted || !mapContainerRef.current) {
          isInitializingRef.current = false
          return
        }

        // Create Leaflet map instance centered on Baripada, Odisha
        const map = L.map(mapContainerRef.current, {
          center: [BARIPADA_CENTER.lat, BARIPADA_CENTER.lng],
          zoom: 14,
          minZoom: 12,
          maxZoom: 18,
          zoomControl: false // Custom styled zoom controls
        })

        // Standard OpenStreetMap Tile Layer (Clear street names and roads)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
        }).addTo(map)

        // Layer group for bin markers
        const markersGroup = L.layerGroup().addTo(map)
        markersLayerRef.current = markersGroup
        mapInstanceRef.current = map

        // Sizing adjustment
        setTimeout(() => {
          if (map && isMounted) {
            try {
              map.invalidateSize()
            } catch (e) {
              // Ignore if already unmounted
            }
          }
        }, 150)

        if (isMounted) {
          setMapLoaded(true)
          setMapError(null)
        }
      } catch (err) {
        console.error("Leaflet initialization error:", err)
        if (isMounted) {
          setMapError("Unable to render map. Please check your internet connection.")
        }
      } finally {
        isInitializingRef.current = false
      }
    }

    initLeaflet()

    return () => {
      isMounted = false
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (e) {
          console.warn("Error removing Leaflet map:", e)
        }
        mapInstanceRef.current = null
      }
      if (mapContainerRef.current) {
        const container = mapContainerRef.current as HTMLElement & { _leaflet_id?: number | string | null }
        if (container && container._leaflet_id) {
          delete container._leaflet_id
        }
      }
      userMarkerRef.current = null
      markersLayerRef.current = null
      markersMapRef.current.clear()
    }
  }, [])

  // Update Markers whenever filteredBins change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return

    import('leaflet').then((LModule) => {
      const L = LModule.default
      const layer = markersLayerRef.current
      layer.clearLayers()
      markersMapRef.current.clear()

      filteredBins.forEach((bin) => {
        const isUrgent = bin.fillLevel > 85
        const isHigh = bin.fillLevel > 70 && bin.fillLevel <= 85
        const isLow = bin.fillLevel <= 30

        const bgClass = isUrgent 
          ? "#dc2626" 
          : isHigh 
            ? "#ea580c" 
            : isLow 
              ? "#16a34a" 
              : "#0284c7"

        const badgeBg = isUrgent ? "#fee2e2" : isHigh ? "#ffedd5" : isLow ? "#dcfce7" : "#e0f2fe"
        const badgeColor = isUrgent ? "#b91c1c" : isHigh ? "#c2410c" : isLow ? "#15803d" : "#0369a1"

        const iconHtml = `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            ${isUrgent ? `
              <div style="
                position: absolute;
                inset: -4px;
                border-radius: 9999px;
                background-color: rgba(220, 38, 38, 0.45);
                animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              "></div>
            ` : ''}
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 9999px;
              background-color: ${bgClass};
              border: 2.5px solid #ffffff;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 10px;
              font-weight: 700;
              font-family: inherit;
            ">
              ${bin.fillLevel}%
            </div>
          </div>
        `

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-bin-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        })

        const marker = L.marker([bin.lat, bin.lng], { icon: customIcon })

        // Small, clear information popup anchored right at the marker
        const popupContent = `
          <div style="font-family: inherit; min-width: 190px; max-width: 240px; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <strong style="font-size: 13px; color: #111827;">${bin.id}</strong>
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: ${badgeBg}; color: ${badgeColor};">
                ${bin.status}
              </span>
            </div>
            <p style="font-size: 11px; color: #4b5563; margin: 0 0 6px 0; line-height: 1.3;">
              ${bin.location}<br/>
              <span style="color: #9ca3af; font-size: 10px;">Ward ${bin.ward} · ${bin.wardName}</span>
            </p>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; margin-bottom: 8px;">
              <span style="color: #6b7280;">Fill Level:</span>
              <strong style="color: ${bgClass};">${bin.fillLevel}% (${bin.type})</strong>
            </div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}" 
               target="_blank" 
               rel="noopener noreferrer" 
               style="display: block; text-align: center; width: 100%; padding: 6px 10px; background-color: #16a34a; color: #ffffff; font-size: 11px; font-weight: 700; border-radius: 8px; text-decoration: none; box-sizing: border-box;">
              Get Directions
            </a>
          </div>
        `

        marker.bindPopup(popupContent, { maxWidth: 260, minWidth: 190 })

        marker.on('click', () => {
          if (onSelectBin) onSelectBin(bin)
        })

        marker.addTo(layer)
        markersMapRef.current.set(bin.id, marker)
      })
    })
  }, [filteredBins, onSelectBin, mapLoaded])

  // Recenter to Baripada Center
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([BARIPADA_CENTER.lat, BARIPADA_CENTER.lng], 14, { duration: 1 })
    }
  }

  // Zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn()
  }
  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut()
  }

  // User Geolocation
  const handleLocateMe = () => {
    setLocationError(null)
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.")
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocating(false)
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        if (mapInstanceRef.current) {
          const L = (await import('leaflet')).default
          mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.2 })

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([lat, lng])
          } else {
            const userIcon = L.divIcon({
              html: `
                <div style="position: relative; width: 24px; height: 24px;">
                  <div style="position: absolute; inset: -4px; border-radius: 9999px; background: rgba(59, 130, 246, 0.4); animation: ping 1.5s infinite;"></div>
                  <div style="width: 20px; height: 20px; border-radius: 9999px; background: #2563eb; border: 3px solid #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>
                </div>
              `,
              className: 'user-location-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })
            userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
              .bindPopup("<div style='font-size: 11px; font-weight: 700; padding: 2px;'>Your Location in Baripada</div>")
              .addTo(mapInstanceRef.current)
          }
        }
      },
      (err) => {
        setLocating(false)
        console.error("Location error:", err)
        setLocationError("Location permission denied. Map remains focused on Baripada, Odisha.")
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  return (
    <div className={cn("relative w-full overflow-hidden bg-muted/20", heightClassName)}>
      {/* Loading Overlay */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 z-30 bg-background/80 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">Loading Baripada Waste Map...</p>
        </div>
      )}

      {/* Error Overlay */}
      {mapError && (
        <div className="absolute inset-0 z-30 bg-background flex flex-col items-center justify-center p-6 text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-bold text-foreground">Map Failed to Load</p>
          <p className="text-xs text-muted-foreground max-w-sm">{mapError}</p>
        </div>
      )}

      {/* Geolocation feedback alert */}
      {locationError && (
        <div className="absolute top-16 left-4 right-4 z-30 p-2.5 text-xs bg-amber-50 text-amber-800 rounded-xl border border-amber-200 flex items-center justify-between shadow-md">
          <span>{locationError}</span>
          <button onClick={() => setLocationError(null)} className="font-bold ml-2">Dismiss</button>
        </div>
      )}

      {/* Floating Slim Search & Ward Filter directly ON the map (Google Maps style) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 max-w-[calc(100%-120px)] sm:max-w-md">
        <div className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-border/40 overflow-hidden flex-1 min-w-[150px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search Bin or Ward..."
            className="pl-8 h-9 text-xs border-none bg-transparent shadow-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          className="h-9 px-2.5 text-xs font-semibold rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-border/40 text-foreground cursor-pointer"
        >
          <option value="all">All Wards (1–28)</option>
          {Array.from({ length: 28 }, (_, i) => i + 1).map((w) => (
            <option key={w} value={w.toString()}>
              Ward {w}
            </option>
          ))}
        </select>
      </div>

      {/* Floating Zoom & Location Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleLocateMe}
          title="Locate my position in Baripada"
          disabled={locating}
          className="h-9 w-9 bg-white/95 backdrop-blur-md shadow-md rounded-xl hover:bg-white text-foreground"
        >
          <Compass className={cn("h-4 w-4 text-primary", locating && "animate-spin")} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleRecenter}
          title="Recenter map to Baripada center"
          className="h-9 w-9 bg-white/95 backdrop-blur-md shadow-md rounded-xl hover:bg-white text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <div className="bg-white/95 backdrop-blur-md shadow-md rounded-xl flex flex-col overflow-hidden border border-border/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            title="Zoom In"
            className="h-8 w-9 rounded-none border-b border-border/30 hover:bg-muted font-bold text-sm"
          >
            +
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="h-8 w-9 rounded-none hover:bg-muted font-bold text-sm"
          >
            -
          </Button>
        </div>
      </div>

      {/* Floating Location Legend (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-border/40 text-[11px] font-medium flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 inline-block" /> Available (&le;30%)
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-600 inline-block" /> Normal (31–70%)
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-600 inline-block" /> High (71–85%)
        </span>
        <span className="flex items-center gap-1 font-semibold text-red-600">
          <span className="h-2.5 w-2.5 rounded-full bg-red-600 inline-block animate-pulse" /> Urgent (&gt;85%)
        </span>
      </div>

      {/* Floating Map Center Notice (Bottom-Right) */}
      <div className="hidden sm:block absolute bottom-3 right-3 z-20 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-muted-foreground border shadow-sm">
        Baripada (21.9322° N, 86.7275° E) · 140 Bins
      </div>

      {/* Pure Map DOM Node */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-10"
        style={{ minHeight: "100%" }}
      />
    </div>
  )
}
