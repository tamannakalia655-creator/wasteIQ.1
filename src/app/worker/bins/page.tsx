
"use client"

import { useState, useMemo } from "react"
import { BINS } from "@/app/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MapPin, Trash2, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react"
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
          <h1 className="text-lg font-bold">Bin Monitoring</h1>
        </div>
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
                        <h3 className="font-bold text-foreground">{bin.id}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{bin.location}</p>
                        <div className="mt-2 flex items-center gap-2">
                           <span className="text-lg font-bold text-destructive">{bin.fillLevel}%</span>
                           <Progress value={bin.fillLevel} className="w-24 h-1.5" indicatorColor="bg-destructive" />
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="rounded-xl font-bold bg-primary hover:bg-primary/90"
                      onClick={() => handleEmptyBin(bin.id)}
                    >
                      Empty Now
                    </Button>
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
                      <p className="text-[10px] text-muted-foreground font-medium">{bin.fillLevel}% Full • {bin.type}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase">{bin.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
