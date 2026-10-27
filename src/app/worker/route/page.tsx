
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Navigation, MapPin, Truck, CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { BINS } from "@/app/lib/mock-data"

const ROUTE_STOPS = [
  { id: '1', title: 'Ward 12 - Purnachandrapur Office', type: 'start', time: '08:00 AM' },
  { id: 'BIN-1012', title: 'Main Market Bin', type: 'bin', status: 'pending' },
  { id: 'BIN-1040', title: 'Residential Square Bin', type: 'bin', status: 'pending' },
  { id: 'HUB-01', title: 'Bhanjpur Recycling Center', type: 'hub', status: 'pending' },
  { id: '2', title: 'Ward 12 - Purnachandrapur Office', type: 'end', time: '12:00 PM' },
]

export default function OptimizedRoute() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 flex items-center gap-4 bg-white/80 px-4 py-4 backdrop-blur-md border-b">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/worker/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Optimized Route</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Map Placeholder */}
        <div className="flex-1 bg-muted relative overflow-hidden flex items-center justify-center">
           <div className="text-center space-y-4">
              <Truck className="h-12 w-12 text-primary/40 mx-auto animate-bounce" />
              <p className="text-sm font-medium text-muted-foreground">Live Route Map Loading...</p>
           </div>
           
           {/* Mock Path Overlay */}
           <div className="absolute inset-0 p-10 opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                 <path d="M20,80 Q40,40 60,60 T90,20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
           </div>
        </div>

        {/* Route Sidebar */}
        <div className="w-full md:w-96 bg-white border-l overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="font-bold text-xl">Today's Schedule</h2>
             <Badge className="bg-primary/10 text-primary border-none">Active</Badge>
          </div>

          <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
            {ROUTE_STOPS.map((stop, idx) => (
              <div key={stop.id} className="relative pl-10">
                <div className={`absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                  stop.type === 'start' || stop.type === 'end' ? 'bg-secondary' : 'bg-primary'
                }`}>
                  {stop.type === 'bin' && <CheckCircle2 className="h-3 w-3 text-white" />}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-bold uppercase">{stop.time || `Stop ${idx}`}</p>
                  <h3 className="font-bold text-sm">{stop.title}</h3>
                  {stop.type === 'bin' && (
                    <Button variant="link" className="h-auto p-0 text-primary text-xs font-bold" asChild>
                       <Link href="/worker/bins">View Bin Details <ChevronRight className="h-3 w-3 ml-1" /></Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t">
             <Button className="w-full h-12 rounded-xl font-bold flex gap-2">
                <Navigation className="h-4 w-4" />
                Start Navigation
             </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`inline-flex items-center px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${className}`}>{children}</span>
}
