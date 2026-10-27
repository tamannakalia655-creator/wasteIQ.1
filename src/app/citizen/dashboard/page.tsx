
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CITIZEN_STATS, BINS } from "@/app/lib/mock-data"
import { Search, Map, Trophy, Recycle, Sparkles, Trash2, ArrowRight, MessageSquareText, MapPin, Loader2, Bell } from "lucide-react"
import Link from "next/link"
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase"
import { doc, collection, query, where } from "firebase/firestore"

export default function CitizenDashboard() {
  const { user } = useUser()
  const db = useFirestore()
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    fullBinsCount: 0,
    availableBinsCount: 0,
    totalBins: 0
  })

  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid, "citizenProfile", "profile")
  }, [db, user?.uid])

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef)

  // Fetch real notification count - only if db and user are ready
  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return query(
      collection(db, "notifications"), 
      where("target", "in", ["all", "citizens"])
    )
  }, [db, user?.uid])
  const { data: notifications } = useCollection(notificationsQuery)

  useEffect(() => {
    setMounted(true)
    const full = BINS.filter(b => b.fillLevel > 85).length
    setStats({
      fullBinsCount: full,
      availableBinsCount: BINS.length - full,
      totalBins: BINS.length
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center justify-between ml-12 md:ml-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 p-1 flex items-center justify-center overflow-hidden">
               <img src={`https://picsum.photos/seed/${user?.uid || 'user'}/100/100`} className="rounded-full h-full w-full object-cover" alt="User" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Welcome back,</p>
              {isProfileLoading ? (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              ) : (
                <h2 className="text-sm font-bold">{profileData?.fullName || "Citizen"}</h2>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/citizen/notifications">
              <Bell className="h-6 w-6" />
              {notifications && notifications.length > 0 && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
              )}
            </Link>
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl space-y-6 px-4 py-6 mx-auto">
        {/* Quick Help Search Bar */}
        <Link href="/citizen/disposal" className="group block">
          <Card className="overflow-hidden border-none bg-primary text-white shadow-xl shadow-primary/20 transition-all active:scale-95">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Search className="h-8 w-8 opacity-80" />
                <div className="text-left">
                  <p className="text-lg font-bold">How do I dispose this?</p>
                  <p className="text-sm opacity-70">Search our AI-powered disposal guide...</p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-secondary" />
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Area Cleanliness</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{CITIZEN_STATS.cleanlinessScore}%</span>
              </div>
              <p className="mt-1 text-[10px] text-primary font-medium">↑ 5% from last week</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Reward Points</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{profileData?.totalRewardPoints ?? CITIZEN_STATS.rewardPoints}</span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Eco Champion Rank</p>
            </CardContent>
          </Card>
        </div>

        {/* Recycling Progress */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-semibold">Community Recycling Rate</CardTitle>
              </div>
              <span className="text-sm font-bold text-primary">{CITIZEN_STATS.recyclingRate}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={CITIZEN_STATS.recyclingRate} className="h-3" />
            <p className="mt-2 text-xs text-muted-foreground">Goal: 75% by end of month. Help us reach it!</p>
          </CardContent>
        </Card>

        {/* Bin Status Snippet */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-semibold">Baripada Smart Bins Status</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-primary font-bold">
                <Link href="/citizen/bins">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-around rounded-xl bg-muted/50 p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{mounted ? stats.totalBins : "--"}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Bins</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{mounted ? stats.fullBinsCount : "--"}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Full/Alert</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{mounted ? stats.availableBinsCount : "--"}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Available</p>
              </div>
            </div>
            <p className="text-[10px] text-center text-muted-foreground">Real-time data from all 28 Wards of Baripada</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button asChild className="h-20 flex-col gap-1 rounded-2xl bg-white text-foreground hover:bg-muted shadow-sm border-none">
            <Link href="/citizen/report">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">Report Waste</span>
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col gap-1 rounded-2xl bg-white text-foreground hover:bg-muted shadow-sm border-none">
            <Link href="/citizen/map">
              <Map className="h-6 w-6 text-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">Find Centers</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
