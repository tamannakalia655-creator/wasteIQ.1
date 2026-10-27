"use client"

import { useState, useMemo } from "react"
import { BINS, SmartBin } from "@/app/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MapPin, Trash2, ArrowLeft, Filter, Search, Navigation, AlertTriangle, ExternalLink, Map as MapIcon, Battery, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function SmartBins() {
  const [selectedWard, setSelectedWard] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [search, setSearch] = useState("")

  const filteredBins = useMemo(() => {
    return BINS.filter(bin => {
      const matchesWard = selectedWard === "all" || bin.ward.toString() === selectedWard
      const matchesType = selectedType === "all" || bin.type === selectedType
      const matchesStatus = 
        selectedStatus === "all" ? true :
        selectedStatus === "urgent" ? bin.fillLevel > 85 :
        selectedStatus === "high" ? (bin.fillLevel > 70 && bin.fillLevel <= 85) :
        bin.fillLevel <= 70

      const query = search.toLowerCase().trim()
      const matchesSearch = 
        !query ||
        bin.id.toLowerCase().includes(query) || 
        bin.location.toLowerCase().includes(query) ||
        bin.wardName.toLowerCase().includes(query) ||
        bin.ward.toString() === query

      return matchesWard && matchesType && matchesStatus && matchesSearch
    })
  }, [selectedWard, selectedType, selectedStatus, search])

  const wards = Array.from({ length: 28 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 px-4 py-3.5 backdrop-blur-md border-b">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-xl">
              <Link href="/citizen/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <h1 className="text-base md:text-lg font-bold text-foreground">Baripada Smart Bins</h1>
              <p className="text-[11px] text-muted-foreground font-medium">
                140 sensor-enabled bins across 28 municipal wards
              </p>
            </div>
          </div>
          <Button size="sm" asChild className="rounded-xl text-xs font-bold">
            <Link href="/citizen/map">
              <MapIcon className="h-3.5 w-3.5 mr-1.5" />
              Interactive Map
            </Link>
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl space-y-4 px-4 py-6 mx-auto">
        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by Bin ID (BIN-1001), Ward (1-28), or street location..." 
              className="pl-10 h-11 rounded-xl bg-muted/30 border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="h-10 px-3 text-xs font-semibold rounded-xl bg-muted/30 border-none text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Wards (1–28)</option>
              {wards.map((w) => (
                <option key={w} value={w.toString()}>Ward {w}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-10 px-3 text-xs font-semibold rounded-xl bg-muted/30 border-none text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Waste Types</option>
              <option value="Dry Waste">Dry Waste</option>
              <option value="Wet Waste">Wet Waste</option>
              <option value="Recyclable">Recyclable</option>
              <option value="Hazardous">Hazardous</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 px-3 text-xs font-semibold rounded-xl bg-muted/30 border-none text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Capacity Levels</option>
              <option value="urgent">Urgent Pickup (&gt;85%)</option>
              <option value="high">Near Full (70–85%)</option>
              <option value="normal">Normal (&le;70%)</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
            <span>Showing {filteredBins.length} of {BINS.length} bins</span>
            <span>Capacity Threshold: Alert at 85%</span>
          </div>
        </div>

        {/* Bins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredBins.map((bin) => (
            <Card key={bin.id} className="border shadow-sm overflow-hidden hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl font-bold text-xs text-white",
                      bin.fillLevel > 85 ? "bg-red-600 shadow-sm" :
                      bin.fillLevel > 70 ? "bg-orange-500 shadow-sm" :
                      bin.fillLevel <= 30 ? "bg-emerald-600 shadow-sm" : "bg-sky-600 shadow-sm"
                    )}>
                      {bin.fillLevel}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-foreground">{bin.id}</h3>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                          Ward {bin.ward}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{bin.location}</span>
                      </p>
                    </div>
                  </div>

                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                    bin.fillLevel > 85 ? "bg-red-100 text-red-700" :
                    bin.fillLevel > 70 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"
                  )}>
                    {bin.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground text-[11px]">{bin.type} · {bin.capacity}</span>
                    <span className={cn(
                      "text-[11px] font-bold",
                      bin.fillLevel > 85 ? "text-red-600" :
                      bin.fillLevel > 70 ? "text-orange-600" : "text-emerald-700"
                    )}>
                      {bin.fillLevel}% Full
                    </span>
                  </div>
                  <Progress 
                    value={bin.fillLevel} 
                    className="h-2" 
                    indicatorColor={
                      bin.fillLevel > 85 ? "bg-red-600" :
                      bin.fillLevel > 70 ? "bg-orange-500" : "bg-emerald-600"
                    }
                  />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Cleaned: {bin.lastCleaned}
                    </span>
                    <span className="flex items-center gap-1">
                      <Battery className={cn("h-3 w-3", bin.batteryLevel < 20 ? "text-red-500" : "text-emerald-600")} />
                      Battery: {bin.batteryLevel}%
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-primary hover:underline text-xs"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Get Directions</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                  <Link
                    href={`/citizen/report?binId=${bin.id}&location=${encodeURIComponent(bin.location)}`}
                    className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground text-xs"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    <span>Report Issue</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBins.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-3 bg-white rounded-2xl border p-8">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-foreground">No bins found matching filters</p>
              <p className="text-xs text-muted-foreground mt-1">Try clearing your search query or selecting all wards.</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setSearch("")
                setSelectedWard("all")
                setSelectedType("all")
                setSelectedStatus("all")
              }} 
              className="rounded-xl font-bold"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
