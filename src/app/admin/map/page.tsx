"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  MapPin, 
  Trash2, 
  Filter, 
  Layers, 
  Compass,
  Maximize2,
  Info
} from "lucide-react"
import { BINS, WARD_POSITIONS } from "@/app/lib/mock-data"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function AdminMap() {
  const [selectedBin, setSelectedBin] = useState<any>(null)
  const [searchWard, setSearchWard] = useState("")

  return (
    <div className="h-screen w-full relative bg-background overflow-hidden flex flex-col">
      {/* Floating Header Interface */}
      <div className="absolute inset-x-0 top-0 z-40 p-6 pointer-events-none">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="w-full md:w-96 space-y-3 pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 flex gap-2 border border-primary/20">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search Ward (1-28)..." 
                  className="h-11 border-none shadow-none pl-9 bg-transparent"
                  value={searchWard}
                  onChange={(e) => setSearchWard(e.target.value)}
                />
              </div>
              <Button variant="secondary" size="icon" className="h-11 w-11 rounded-xl bg-muted/50">
                <Filter className="h-5 w-5" />
              </Button>
            </div>

            <Card className="bg-white/90 backdrop-blur-md border-none shadow-xl rounded-2xl hidden md:block">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Live Municipal Telemetry</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-primary/10 space-y-1">
                    <p className="text-[8px] font-bold uppercase text-primary">Fleet Active</p>
                    <p className="text-lg font-bold">12 / 14</p>
                  </div>
                  <div className="p-3 rounded-xl bg-destructive/10 space-y-1">
                    <p className="text-[8px] font-bold uppercase text-destructive">Overflow Alerts</p>
                    <p className="text-lg font-bold">{BINS.filter(b => b.fillLevel > 90).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-2 pointer-events-auto">
            <Button variant="secondary" size="icon" className="h-11 w-11 rounded-xl bg-white shadow-xl hover:bg-muted border border-border/40">
              <Layers className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="icon" className="h-11 w-11 rounded-xl bg-white shadow-xl hover:bg-muted border border-border/40">
              <Compass className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="icon" className="h-11 w-11 rounded-xl bg-white shadow-xl hover:bg-muted border border-border/40">
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Ward Map Container */}
      <div className="flex-1 relative bg-[#f8fafc] overflow-auto p-20 cursor-grab active:cursor-grabbing">
        <div className="min-w-[1200px] min-h-[900px] relative border-2 border-dashed border-primary/10 rounded-[4rem] bg-white shadow-inner">
          
          {/* Ward Boundaries */}
          {Object.entries(WARD_POSITIONS).map(([num, pos]) => {
            const isHighlighted = searchWard !== "" && num === searchWard;
            return (
              <div 
                key={num} 
                className={cn(
                  "absolute flex items-center justify-center transition-all duration-500",
                  isHighlighted ? "scale-110 z-30" : "opacity-80"
                )}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div className={cn(
                  "h-16 w-16 rounded-full flex items-center justify-center border-2",
                  isHighlighted ? "bg-primary text-white border-primary shadow-2xl" : "bg-muted/30 text-muted-foreground border-border"
                )}>
                  <span className="text-sm font-bold">W-{num}</span>
                </div>
              </div>
            );
          })}

          {/* Individual Bin Markers */}
          {BINS.map((bin) => (
            <button
              key={bin.id}
              onClick={() => setSelectedBin(bin)}
              className={cn(
                "absolute h-3 w-3 rounded-full border border-white shadow-lg transition-all hover:scale-150 z-20",
                bin.fillLevel > 90 ? "bg-destructive animate-pulse scale-125" : 
                bin.fillLevel > 75 ? "bg-orange-500" : 
                bin.fillLevel > 40 ? "bg-primary" : "bg-blue-400"
              )}
              style={{ left: `${bin.x}%`, top: `${bin.y}%` }}
              title={bin.location}
            />
          ))}

          {/* Mock Connection Lines */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-5">
            <line x1="25%" y1="15%" x2="50%" y2="15%" stroke="currentColor" strokeWidth="2" />
            <line x1="50%" y1="15%" x2="75%" y2="25%" stroke="currentColor" strokeWidth="2" />
            <line x1="15%" y1="30%" x2="35%" y2="25%" stroke="currentColor" strokeWidth="2" />
            <line x1="35%" y1="68%" x2="50%" y2="75%" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Selected Bin Details */}
      {selectedBin && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-50">
          <Card className="border-none bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg",
                  selectedBin.fillLevel > 90 ? "bg-destructive text-white" : "bg-primary/10 text-primary"
                )}>
                  <Trash2 className="h-8 w-8" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">{selectedBin.id} ({selectedBin.type})</h4>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedBin(null)}>
                      <span className="sr-only">Close</span>
                      <Maximize2 className="h-4 w-4 rotate-45" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {selectedBin.location}
                  </p>
                  <div className="flex items-center justify-between gap-4 mt-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>Fill Level</span>
                        <span>{selectedBin.fillLevel}%</span>
                      </div>
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
                    <Button size="sm" className="rounded-xl font-bold h-9">Notify Crew</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legend Popover */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 z-40 flex flex-col gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="icon" className="h-11 w-11 rounded-xl bg-white shadow-xl hover:bg-muted border border-primary/20 text-primary pointer-events-auto">
              <Info className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" className="w-64 rounded-2xl p-4 shadow-2xl border-none">
            <h5 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Map Legend</h5>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-destructive animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Critical (&gt;90% Fill)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Warning (75-90% Fill)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Moderate (40-75% Fill)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Low (&lt;40% Fill)</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tight">Ward Boundary Marker</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
