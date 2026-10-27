"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BINS, SmartBin } from "@/app/lib/mock-data"
import { 
  Search, 
  Map as MapIcon, 
  Trophy, 
  Recycle, 
  Trash2, 
  ArrowRight, 
  MapPin, 
  Loader2, 
  Bell, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase"
import { doc, collection, query, where, limit } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

export default function CitizenDashboard() {
  const { user } = useUser()
  const db = useFirestore()

  // Citizen Profile
  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid, "citizenProfile", "profile")
  }, [db, user?.uid])
  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef)

  // Real Notifications
  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return query(
      collection(db, "notifications"), 
      where("target", "in", ["all", "citizens"]),
      limit(20)
    )
  }, [db, user?.uid])
  const { data: notifications } = useCollection(notificationsQuery)

  // Real Complaints filed by this citizen
  const complaintsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return query(
      collection(db, "complaints"),
      where("citizenId", "==", user.uid),
      limit(5)
    )
  }, [db, user?.uid])
  const { data: myComplaints, isLoading: isComplaintsLoading } = useCollection(complaintsQuery)

  // Smart bin fleet counts
  const fleetStats = useMemo(() => {
    const urgent = BINS.filter(b => b.fillLevel > 85).length
    const normal = BINS.filter(b => b.fillLevel <= 70).length
    const userWard = profileData?.wardId ? Number(profileData.wardId) : 12
    const wardBins = BINS.filter(b => b.ward === userWard)
    return {
      total: BINS.length,
      urgent,
      available: normal,
      wardBins
    }
  }, [profileData?.wardId])

  const citizenPoints = profileData?.totalRewardPoints ?? 120
  const userWardNum = profileData?.wardId ?? 12

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 px-4 py-3.5 backdrop-blur-md border-b">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Baripada Citizen Portal · Ward {userWardNum}
              </p>
              <h2 className="text-base font-bold text-foreground">
                {isProfileLoading ? "Loading..." : profileData?.fullName || "Citizen"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative rounded-xl" asChild>
              <Link href="/citizen/notifications" title="Broadcasts & Updates">
                <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                {notifications && notifications.length > 0 && (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
                )}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl space-y-6 px-4 py-6 mx-auto">
        {/* Prominent Primary Call-to-Action */}
        <div className="bg-gradient-to-r from-emerald-700 to-green-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-700/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Smarter Waste Management. Cleaner Communities.
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Spot waste or an overflowing bin in your ward?
            </h1>
            <p className="text-sm text-emerald-50/90 leading-relaxed">
              Report it directly to municipal sanitation crews in Baripada. Earn +10 Eco Points per verified submission.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <Button asChild size="lg" className="rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold shadow-md h-12 px-6">
              <Link href="/citizen/report">
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                Report an Issue
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/30 text-white hover:bg-white/10 font-semibold h-12 px-6">
              <Link href="/citizen/map">
                <MapIcon className="h-4 w-4 mr-2" />
                Explore Waste Map
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Search Disposal Guide Banner */}
        <Link href="/citizen/disposal" className="group block">
          <div className="bg-white rounded-2xl p-4 border shadow-sm hover:border-primary/50 transition-all flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">How do I dispose this item?</h3>
                <p className="text-xs text-muted-foreground">
                  Search plastic bottles, peels, batteries, e-waste for color-coded bin guidance
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-transform flex-shrink-0" />
          </div>
        </Link>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border shadow-sm bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-[11px] font-bold uppercase text-muted-foreground">Total Smart Bins</p>
              <h4 className="text-2xl font-bold text-foreground">{fleetStats.total}</h4>
              <p className="text-[11px] text-muted-foreground">All 28 Wards</p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-[11px] font-bold uppercase text-red-600">Urgent Pickup</p>
              <h4 className="text-2xl font-bold text-red-600">{fleetStats.urgent}</h4>
              <p className="text-[11px] text-muted-foreground">&gt;85% Fill Alert</p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-[11px] font-bold uppercase text-emerald-700">Available Bins</p>
              <h4 className="text-2xl font-bold text-emerald-700">{fleetStats.available}</h4>
              <p className="text-[11px] text-muted-foreground">Ready for Disposal</p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-[11px] font-bold uppercase text-primary">Eco Reward Pts</p>
              <h4 className="text-2xl font-bold text-foreground">{citizenPoints}</h4>
              <p className="text-[11px] text-primary font-semibold">Eco Champion Rank</p>
            </CardContent>
          </Card>
        </div>

        {/* Real Complaint Status / History Section */}
        <Card className="border shadow-sm bg-white">
          <CardHeader className="p-5 pb-3 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">My Reported Issues</CardTitle>
              <p className="text-xs text-muted-foreground">Track resolution status from municipal workers</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs font-bold text-primary">
              <Link href="/citizen/report">Report New</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0 divide-y">
            {isComplaintsLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                <p className="text-xs text-muted-foreground mt-2">Checking municipal database...</p>
              </div>
            ) : myComplaints && myComplaints.length > 0 ? (
              myComplaints.map((c) => (
                <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{c.type}</span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                        c.status === "Resolved" ? "bg-emerald-100 text-emerald-800" :
                        c.status === "Assigned" ? "bg-blue-100 text-blue-800" :
                        "bg-amber-100 text-amber-800"
                      )}>
                        {c.status || "Pending Review"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                      <span>{c.location}</span>
                      {c.createdAt && (
                        <>
                          <span>·</span>
                          <span>{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
                        </>
                      )}
                    </p>
                    {c.assignedWorkerName && (
                      <p className="text-xs text-primary font-medium">
                        Assigned crew: {c.assignedWorkerName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {c.status === "Resolved" ? (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Cleared
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        <Clock className="h-3.5 w-3.5" /> In progress
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="text-sm font-bold text-foreground">No active complaints filed</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Your area looks clean! If you spot littering, missed pickups, or broken bins, file a report anytime.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nearby Smart Bins in User's Ward */}
        <Card className="border shadow-sm bg-white">
          <CardHeader className="p-5 pb-3 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Smart Bins in Ward {userWardNum}
              </CardTitle>
              <p className="text-xs text-muted-foreground">Nearby collection points with real-time capacity readings</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs font-bold text-primary">
              <Link href="/citizen/bins">View All 140</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {fleetStats.wardBins.slice(0, 3).map((bin) => (
                <div key={bin.id} className="p-3.5 rounded-2xl border bg-muted/20 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{bin.id}</h4>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[170px]">{bin.location}</p>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded",
                      bin.fillLevel > 85 ? "bg-red-100 text-red-700" :
                      bin.fillLevel > 70 ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-800"
                    )}>
                      {bin.fillLevel}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full",
                        bin.fillLevel > 85 ? "bg-red-600" :
                        bin.fillLevel > 70 ? "bg-orange-500" : "bg-emerald-600"
                      )} 
                      style={{ width: `${bin.fillLevel}%` }} 
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-muted-foreground">{bin.type}</span>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>Directions</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <Button asChild variant="outline" className="rounded-xl text-xs font-bold h-10 w-full sm:w-auto">
                <Link href="/citizen/map">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  Open Full Interactive Map
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
