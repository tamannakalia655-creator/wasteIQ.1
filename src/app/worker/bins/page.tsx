
"use client"

import { useState, useMemo } from "react"
import { BINS } from "@/app/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MapPin, Trash2, ArrowLeft, CheckCircle2, AlertTriangle, Navigation, ExternalLink, Map, Battery, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function WorkerBins() {
  const { toast } = useToast()
  const [bins, setBins] = useState(BINS)

  const urgentBins = useMemo(() => 
    bins.filter(bin => bin.fillLevel > 80).sort((a, b) => b.fillLevel - a.fillLevel)
  , [bins]);

  const handleEmptyBin = (id: string) => {
    setBins(prev => prev.map(b => b.id === id ? { ...b, fillLevel: 0, status: 'Empty' } : b))
    toast({
      title: "Bin Emptied",
      description: `Status for ${id} has been updated to Empty.`,
    })
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/worker/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-lg font-bold">Smart Bins Monitoring</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Field queue &amp; urgent capacity alerts</p>
          </div>
        </div>
        <Button size="sm" asChild className="rounded-xl text-xs font-bold">
          <Link href="/worker/route">
            <Map className="h-3.5 w-3.5 mr-1" />
            Pickup Route
          </Link>
        </Button>
      </header>

      <main className="container max-w-lg space-y-6 px-4 py-6 mx-auto">
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase text-muted-foreground px-1 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Urgent Pickups Required
          </h2>
          <div className="grid gap-4">
            {urgentBins.map((bin) => (
              <Card key={bin.id} className="border-none shadow-sm overflow-hidden border-l-4 border-l-destructive">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-destructive/10">
                        <Trash2 className="h-6 w-6 text-destructive" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">{bin.id}</h3>
                          <Badge variant="outline" className="text-[9px] font-bold uppercase">Ward {bin.ward}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{bin.location}</p>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {bin.lastCleaned}
                          </span>
                          <span className="flex items-center gap-1">
                            <Battery className="h-3 w-3 text-emerald-600" /> {bin.batteryLevel}% Sensor
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                           <span className="text-lg font-bold text-destructive">{bin.fillLevel}%</span>
                           <Progress value={bin.fillLevel} className="w-24 h-1.5" indicatorColor="bg-destructive" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-xs"
                        onClick={() => handleEmptyBin(bin.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Empty Now
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="rounded-xl font-bold text-xs"
                        asChild
                      >
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="h-3.5 w-3.5 mr-1 text-primary" />
                          Directions
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <h2 className="text-sm font-bold uppercase text-muted-foreground px-1">All Smart Bins (Ward 12)</h2>
          <div className="grid gap-3">
            {bins.filter(b => b.ward === 12 && b.fillLevel <= 80).map((bin) => (
              <Card key={bin.id} className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-bold">{bin.id}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {bin.fillLevel}% Full • {bin.type} • Sensor: {bin.batteryLevel}%
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{bin.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase">{bin.status}</Badge>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" asChild title="Get Directions">
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}`} target="_blank" rel="noopener noreferrer">
                        <Navigation className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
