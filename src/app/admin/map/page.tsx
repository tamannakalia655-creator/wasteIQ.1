"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2, Radio } from "lucide-react"
import Link from "next/link"
import BaripadaMap from "@/components/map/BaripadaMap"

export default function AdminMapPage() {
  return (
    <div className="relative w-full h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Header */}
      <header className="z-30 bg-white/95 backdrop-blur-md border-b px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-xl h-9 w-9 md:hidden">
            <Link href="/admin/dashboard" title="Back to Dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold text-foreground">
                Baripada Municipal GIS Map
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                Live Telemetry (140 Bins)
              </span>
            </div>
            <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium">
              Geographic monitoring across all 28 municipal wards · Baripada, Odisha
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="rounded-xl font-bold text-xs h-8 px-3 flex items-center gap-1.5">
            <Link href="/admin/bins">
              <Trash2 className="h-3.5 w-3.5 text-primary" />
              <span>Smart Bins Table</span>
            </Link>
          </Button>
          <Button asChild className="rounded-xl font-bold text-xs h-8 px-3">
            <Link href="/admin/complaints">
              Assigned Crew
            </Link>
          </Button>
        </div>
      </header>

      {/* Pure Map Area - Map Only */}
      <div className="relative flex-1 w-full h-full min-h-0">
        <BaripadaMap
          role="admin"
          showAdminActions={true}
          heightClassName="h-full w-full"
        />
      </div>
    </div>
  )
}
