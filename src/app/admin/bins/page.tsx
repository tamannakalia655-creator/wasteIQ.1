"use client"

import { useState, useMemo } from "react"
import { BINS } from "@/app/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Trash2, MapPin, AlertCircle, CheckCircle2, Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function BinMonitoring() {
  const [selectedWard, setSelectedWard] = useState<string>("all")
  const [search, setSearch] = useState("")

  const filteredBins = useMemo(() => {
    return BINS.filter(bin => {
      const matchesWard = selectedWard === "all" || bin.ward.toString() === selectedWard;
      const matchesSearch = 
        bin.id.toLowerCase().includes(search.toLowerCase()) || 
        bin.location.toLowerCase().includes(search.toLowerCase()) ||
        bin.ward.toString().includes(search);
      
      return matchesWard && matchesSearch;
    });
  }, [selectedWard, search]);

  const wards = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Bin Network</h1>
          <p className="text-muted-foreground font-medium">Real-time telemetry from 140 sensor-enabled bins</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="rounded-xl font-bold flex gap-2">
            <Link href="/admin/map">
              <MapPin className="h-4 w-4 text-primary" />
              GIS Waste Map
            </Link>
          </Button>
          <Button className="rounded-xl font-bold flex gap-2">
            <Settings className="h-4 w-4" />
            Configure Alerts
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-primary text-primary-foreground">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase opacity-80">Total Fleet</p>
              <h4 className="text-2xl font-bold">{BINS.length}</h4>
            </div>
            <Trash2 className="h-8 w-8 opacity-30" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-destructive text-destructive-foreground">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase opacity-80">Urgent Pickup</p>
              <h4 className="text-2xl font-bold">{BINS.filter(b => b.fillLevel > 85).length}</h4>
            </div>
            <AlertCircle className="h-8 w-8 opacity-30" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Functional</p>
              <h4 className="text-2xl font-bold">100%</h4>
            </div>
            <CheckCircle2 className="h-8 w-8 text-primary opacity-30" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Average Fill</p>
              <h4 className="text-2xl font-bold">54%</h4>
            </div>
            <Filter className="h-8 w-8 text-secondary-foreground opacity-30" />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Bin ID, location, or ward..." 
            className="pl-10 h-11 rounded-xl border-none bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={selectedWard} onValueChange={setSelectedWard}>
          <SelectTrigger className="w-full md:w-[200px] h-11 rounded-xl bg-white border-none shadow-sm">
            <SelectValue placeholder="All Wards" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            {wards.map(w => (
              <SelectItem key={w} value={w.toString()}>Ward {w}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBins.map((bin) => (
          <Card key={bin.id} className="border-none shadow-sm group hover:ring-2 hover:ring-primary/20 transition-all">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant={bin.fillLevel > 85 ? 'destructive' : 'secondary'} 
                    className="rounded-lg text-[8px] font-bold uppercase"
                  >
                    {bin.status}
                  </Badge>
                  <Badge variant="outline" className="text-[8px] font-bold uppercase">Ward {bin.ward}</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm">{bin.id}</h3>
                <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {bin.location}
                </p>
                <div className="flex items-center justify-between text-[9px] text-muted-foreground pt-1">
                  <span>Battery: {bin.batteryLevel}%</span>
                  <span>Cleaned: {bin.lastCleaned}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-muted-foreground uppercase">Fill Level</span>
                  <span className={bin.fillLevel > 85 ? 'text-destructive' : 'text-primary'}>{bin.fillLevel}%</span>
                </div>
                <Progress 
                  value={bin.fillLevel} 
                  className="h-1.5" 
                  indicatorColor={bin.fillLevel > 85 ? 'bg-destructive' : 'bg-primary'} 
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <Button variant="ghost" className="text-[10px] font-bold uppercase h-8 px-2 flex-1" asChild>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}`} target="_blank" rel="noopener noreferrer">
                    Directions
                  </a>
                </Button>
                <Button variant="outline" className="text-[10px] font-bold uppercase h-8 px-2 flex-1 rounded-lg" asChild>
                  <Link href="/admin/map">
                    View on Map
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredBins.length === 0 && (
        <div className="py-32 text-center flex flex-col items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground/30">
            <Trash2 className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold">No results found</h3>
            <p className="text-sm text-muted-foreground">Adjust your search or filters to find what you're looking for.</p>
          </div>
        </div>
      )}
    </div>
  )
}
