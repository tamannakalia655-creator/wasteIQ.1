"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Navigation, MapPin, Truck, CheckCircle2, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { BINS, SmartBin } from "@/app/lib/mock-data"
import BaripadaMap from "@/components/map/BaripadaMap"
import { cn } from "@/lib/utils"

interface RouteStop {
  id: string
  title: string
  type: "start" | "bin" | "hub" | "end"
  time: string
  completed: boolean
  binId?: string
  lat?: number
  lng?: number
  fillLevel?: number
}

export default function WorkerOptimizedRoute() {
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null)
  const [stops, setStops] = useState<RouteStop[]>([
    { 
      id: 'START-01', 
      title: 'Ward 12 Municipal Depot, Purnachandrapur', 
      type: 'start', 
      time: '07:30 AM', 
      completed: true,
      lat: 21.9225,
      lng: 86.7350
    },
    { 
      id: 'BIN-1012', 
      binId: 'BIN-1012',
      title: 'Purnachandrapur · Main Market Junction', 
      type: 'bin', 
      time: '08:15 AM', 
      completed: true,
      lat: 21.9230,
      lng: 86.7360,
      fillLevel: 88
    },
    { 
      id: 'BIN-1040', 
      binId: 'BIN-1040',
      title: 'Sunagadia · Residential Square Bin', 
      type: 'bin', 
      time: '09:00 AM', 
      completed: false,
      lat: 21.9330,
      lng: 86.7360,
      fillLevel: 94
    },
    { 
      id: 'BIN-1005', 
      binId: 'BIN-1005',
      title: 'Station Bazar · Auto Stand Collection Point', 
      type: 'bin', 
      time: '09:45 AM', 
      completed: false,
      lat: 21.9378,
      lng: 86.7335,
      fillLevel: 82
    },
    { 
      id: 'HUB-01', 
      title: 'Bhanjpur Solid Waste Processing Center', 
      type: 'hub', 
      time: '11:00 AM', 
      completed: false,
      lat: 21.9280,
      lng: 86.7410
    },
    { 
      id: 'END-01', 
      title: 'Ward 12 Depot Return & Telemetry Sync', 
      type: 'end', 
      time: '12:30 PM', 
      completed: false,
      lat: 21.9225,
      lng: 86.7350
    },
  ])

  const toggleStopCompleted = (stopId: string) => {
    setStops(prev => prev.map(s => s.id === stopId ? { ...s, completed: !s.completed } : s))
  }

  const completedCount = stops.filter(s => s.completed).length

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 px-4 py-3 backdrop-blur-md border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-xl">
            <Link href="/worker/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-base md:text-lg font-bold text-foreground">Assigned Pickup Route</h1>
            <p className="text-[11px] text-muted-foreground font-medium">
              Ward 12 &amp; Ward 20 Collection Circuit · Truck OD-11-8421
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" asChild className="text-xs font-bold rounded-xl hidden sm:flex">
            <Link href="/worker/bins">
              Smart Bins List
            </Link>
          </Button>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {completedCount} of {stops.length} Complete
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Real Street Map Section */}
        <div className="flex-1 p-4">
          <BaripadaMap
            role="worker"
            initialWard={12}
            selectedBinId={selectedBinId}
            heightClassName="h-[550px] lg:h-[calc(100vh-140px)]"
          />
        </div>

        {/* Route Stops Checklist Sidebar */}
        <div className="w-full lg:w-[400px] bg-white border-t lg:border-t-0 lg:border-l p-4 md:p-6 space-y-4 overflow-y-auto max-h-[600px] lg:max-h-[calc(100vh-80px)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-foreground">Collection Schedule</h2>
              <p className="text-xs text-muted-foreground">Tap any stop to inspect coordinates or mark complete</p>
            </div>
            <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${(completedCount / stops.length) * 100}%` }} 
              />
            </div>
          </div>

          {/* Navigation Routing Information Banner */}
          <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-xs text-foreground/80 space-y-1">
            <p className="font-bold text-primary flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5" />
              Live Turn-by-Turn Navigation
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Routing uses actual GPS coordinates in Baripada, Mayurbhanj. Tap any marker on the map or click &quot;GPS Directions&quot; on any stop to open directions in your device maps app.
            </p>
          </div>

          <div className="space-y-3">
            {stops.map((stop, idx) => (
              <div
                key={stop.id}
                onClick={() => {
                  if (stop.binId) setSelectedBinId(stop.binId)
                }}
                className={cn(
                  "p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2",
                  stop.completed ? "bg-muted/30 border-muted" : "bg-white border-border shadow-sm hover:border-primary/50",
                  selectedBinId === stop.binId && "ring-2 ring-primary border-primary"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStopCompleted(stop.id)
                      }}
                      className={cn(
                        "mt-0.5 h-6 w-6 rounded-lg border flex items-center justify-center transition-colors",
                        stop.completed ? "bg-primary border-primary text-white" : "border-border hover:border-primary"
                      )}
                      title="Toggle completed state"
                    >
                      {stop.completed && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          {stop.time} · Stop {idx + 1}
                        </span>
                        {stop.fillLevel && (
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.2 rounded",
                            stop.fillLevel > 85 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                          )}>
                            {stop.fillLevel}% Fill
                          </span>
                        )}
                      </div>
                      <h4 className={cn("text-sm font-semibold mt-0.5", stop.completed && "line-through text-muted-foreground")}>
                        {stop.title}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                  {stop.binId ? (
                    <span className="text-[11px] font-mono font-bold text-primary">
                      {stop.binId}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground uppercase font-bold">
                      {stop.type}
                    </span>
                  )}
                  {stop.lat && stop.lng && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary hover:underline font-bold text-[11px] flex items-center gap-1"
                    >
                      <span>GPS Directions</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
