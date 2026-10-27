"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MapPin, Search, Layers, Compass, Trash2, Recycle, Navigation, Info } from "lucide-react"
import Link from "next/link"
import { BINS, WARD_POSITIONS } from "@/app/lib/mock-data"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function MapView() {
  const [selectedBin, setSelectedBin] = useState<any>(null)
  const [search, setSearch] = useState("")

  const filteredBins = BINS.filter(bin => 
    search === "" || bin.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 pt-12 md:pt-4 pointer-events-none">
        <div className="container max-w-lg mx-auto flex gap-2 pointer-events-auto">
          <Button variant="default" size="icon" asChild className="rounded-xl shadow-lg shadow-primary/20 flex-shrink-0 bg-primary h-12 w-12">
            <Link href="/citizen/dashboard"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Find Bins or Recycling Centers..." 
              className="h-12 rounded-xl bg-white/95 backdrop-blur-md pl-9 shadow-lg border-primary/20" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 bg-muted relative overflow-auto cursor-grab active:cursor-grabbing">
        <div className="min-w-[1000px] min-h-[800px] p-20 relative">
          
          {/* Ward Map Visualization */}
          {Object.entries(WARD_POSITIONS).map(([num, pos]) => (
            <div 
              key={num} 
              className="absolute pointer-events-none"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className="h-20 w-20 rounded-full border border-primary/5 bg-primary/5 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary/20 uppercase tracking-tighter">Ward {num}</span>
              </div>
            </div>
          ))}

          {/* User Location Marker (Mocked at Ward 12) */}
          <div className="absolute z-30" style={{ left: '40%', top: '85%' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl animate-pulse" />
              <div className="h-10 w-10 bg-blue-500 border-4 border-white rounded-full flex items-center justify-center text-white shadow-2xl relative z-10">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-[8px] font-bold whitespace-nowrap">
                YOU ARE HERE (W-12)
              </div>
            </div>
          </div>

          {/* Bins as Markers */}
          {filteredBins.map((bin) => (
            <button
              key={bin.id}
              onClick={() => setSelectedBin(bin)}
              className={cn(
                "absolute h-4 w-4 rounded-full border-2 border-white shadow-md transition-all hover:scale-150 z-20",
                bin.fillLevel > 90 ? "bg-destructive scale-110" : 
                bin.fillLevel > 75 ? "bg-orange-500" : 
                bin.fillLevel > 40 ? "bg-primary" : "bg-blue-400"
              )}
              style={{ left: `${bin.x}%`, top: `${bin.y}%` }}
            />
          ))}

          {/* Key Locations / Landmarks */}
          <div className="absolute top-[15%] left-[50%] flex flex-col items-center">
             <div className="h-8 w-8 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 mb-1">
                <Recycle className="h-4 w-4" />
             </div>
             <span className="text-[8px] font-bold uppercase tracking-tight bg-white px-2 py-0.5 rounded shadow-sm">Recycling Hub: W-21</span>
          </div>
        </div>
      </div>

      {/* Detail Card Overlay */}
      {selectedBin && (
        <div className="absolute bottom-6 left-4 right-4 z-40 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4">
          <Card className="border-none bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner",
                  selectedBin.fillLevel > 90 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                )}>
                  <Trash2 className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm truncate">{selectedBin.id} ({selectedBin.type})</h3>
                    <button className="text-muted-foreground" onClick={() => setSelectedBin(null)}>
                      <Layers className="h-4 w-4 rotate-45" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3" /> {selectedBin.location}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            selectedBin.fillLevel > 90 ? "bg-destructive" : "bg-primary"
                          )} 
                          style={{ width: `${selectedBin.fillLevel}%` }} 
                        />
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold",
                      selectedBin.fillLevel > 90 ? "text-destructive" : "text-primary"
                    )}>
                      {selectedBin.fillLevel}% Full
                    </span>
                    <Button size="sm" className="rounded-lg font-bold h-8 px-4 flex gap-1">
                      <Navigation className="h-3 w-3" />
                      Go
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map UI Controls */}
      <div className="absolute right-4 top-24 z-40 space-y-2 flex flex-col items-center">
        <Button variant="secondary" size="icon" className="h-11 w-11 rounded-xl bg-white shadow-xl hover:bg-muted border">
          <Layers className="h-5 w-5" />
        </Button>
        <Button variant="secondary" size="icon" className="h-11 w-11 rounded-xl bg-white shadow-xl hover:bg-muted border">
          <Compass className="h-5 w-5" />
        </Button>
        
        {/* Info/Legend Trigger */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="icon" className="h-11 w-11 rounded-xl bg-white shadow-xl hover:bg-muted border border-primary/20 text-primary">
              <Info className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" className="w-56 rounded-2xl p-4 shadow-2xl border-none">
            <h5 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Bin Conditions</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-destructive shadow-sm animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Critical (&gt;90%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-orange-500 shadow-sm" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Almost Full (75-90%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary shadow-sm" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Moderate (40-75%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-400 shadow-sm" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Low (&lt;40%)</span>
              </div>
              <div className="pt-3 mt-3 border-t border-dashed">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tight">Ward Area</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
