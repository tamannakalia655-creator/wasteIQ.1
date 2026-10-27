"use client"

import { useState, useMemo } from "react"
import { BINS } from "@/app/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MapPin, Trash2, ArrowLeft, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function SmartBins() {
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
    <div className="min-h-screen bg-background pb-12">
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/citizen/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Baripada Smart Bins</h1>
        </div>
      </header>

      <main className="container max-w-2xl space-y-4 px-4 py-6 mx-auto">
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, location, or ward..." 
              className="pl-10 h-12 rounded-xl border-none bg-white shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 px-2">
             <div>
               <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                 {filteredBins.length} Bins found
               </p>
             </div>
             <div className="flex items-center gap-2">
               <Filter className="h-3 w-3 text-muted-foreground" />
               <Select value={selectedWard} onValueChange={setSelectedWard}>
                 <SelectTrigger className="w-[130px] h-8 rounded-lg bg-white border-none shadow-sm text-xs font-bold">
                   <SelectValue placeholder="Ward" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Wards</SelectItem>
                   {wards.map((w) => (
                     <SelectItem key={w} value={w.toString()}>Ward {w}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredBins.map((bin) => (
            <Card key={bin.id} className="border-none shadow-sm overflow-hidden active:scale-[0.99] transition-transform">
              <CardContent className="p-0">
                <div className="flex items-start justify-between p-4">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                      <Trash2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">{bin.id}</h3>
                        <Badge variant="outline" className="text-[8px] h-4 px-1.5 font-bold uppercase">W-{bin.ward}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {bin.location}
                      </div>
                      <div className="flex gap-2 mt-2">
                         <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tight">
                           {bin.type}
                         </Badge>
                         <Badge 
                           variant={bin.fillLevel > 85 ? "destructive" : bin.fillLevel > 50 ? "default" : "outline"} 
                           className="text-[10px] uppercase font-bold tracking-tight"
                         >
                           {bin.status}
                         </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-muted-foreground uppercase">Fill Level</span>
                    <span className={bin.fillLevel > 85 ? "text-destructive" : "text-primary"}>
                      {bin.fillLevel}%
                    </span>
                  </div>
                  <Progress 
                    value={bin.fillLevel} 
                    className="h-2" 
                    indicatorColor={bin.fillLevel > 85 ? "bg-destructive" : "bg-primary"}
                  />
                </div>
                <div className="bg-muted/30 p-2 flex justify-center">
                   <Button variant="link" size="sm" className="text-primary text-[10px] h-auto p-0 font-bold uppercase tracking-wider">
                      Get Directions
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBins.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-4 animate-in fade-in">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Search className="h-8 w-8" />
            </div>
            <div>
              <p className="font-bold text-foreground">No bins matching your search</p>
              <p className="text-xs text-muted-foreground mt-1">Try different keywords or check another ward.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => {setSearch(""); setSelectedWard("all")}} className="rounded-xl">
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
