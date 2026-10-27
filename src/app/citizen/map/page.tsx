"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import BaripadaMap from "@/components/map/BaripadaMap"

export default function CitizenMapView() {
  return (
    <div className="relative w-full h-[calc(100vh-64px)] md:h-screen flex flex-col bg-background overflow-hidden pb-16 md:pb-0">
      {/* Slim Top Navigation Header */}
      <header className="z-30 bg-white/95 backdrop-blur-md border-b px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-xl h-9 w-9">
            <Link href="/citizen/dashboard" title="Back to Dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-sm md:text-base font-bold text-foreground">Baripada Waste Map</h1>
            <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium">
              Interactive map of all 28 municipal wards · Baripada, Odisha
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" asChild className="text-xs font-bold rounded-xl h-8 px-3 flex items-center gap-1.5">
            <Link href="/citizen/bins">
              <Trash2 className="h-3.5 w-3.5 text-primary" />
              <span>Smart Bins List</span>
            </Link>
          </Button>
          <Button size="sm" asChild className="text-xs font-bold rounded-xl h-8 px-3">
            <Link href="/citizen/report">
              <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-500" />
              <span>Report Issue</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Pure Map Area - Map Only */}
      <div className="relative flex-1 w-full h-full min-h-0">
        <BaripadaMap
          role="citizen"
          heightClassName="h-full w-full"
        />
      </div>
    </div>
  )
}
