
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BINS } from "@/app/lib/mock-data"
import { ClipboardList, Map, CheckCircle2, AlertCircle, ArrowRight, User, Bell, Loader2 } from "lucide-react"
import Link from "next/link"
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase"
import { doc, collection, query, where } from "firebase/firestore"

export default function WorkerDashboard() {
  const { user, isUserLoading: isAuthLoading } = useUser()
  const db = useFirestore()
  const [mounted, setMounted] = useState(false)
  const [nearbyFullBins, setNearbyFullBins] = useState(0)

  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid, "workerProfile", "profile")
  }, [db, user?.uid])

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef)
  
  // Fetch tasks assigned specifically to this worker for the count
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return query(
      collection(db, "complaints"), 
      where("assignedWorkerId", "==", user.uid)
    )
  }, [db, user?.uid])
  
  const { data: assignedTasks, isLoading: isTasksLoading } = useCollection(tasksQuery)

  // Client-side filter for active tasks count
  const activeTaskCount = (assignedTasks || []).filter(t => t.status !== 'Resolved').length

  // Fetch notifications for badges
  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return query(
      collection(db, "notifications"), 
      where("target", "in", ["all", "workers"])
    )
  }, [db, user?.uid])
  const { data: notifications } = useCollection(notificationsQuery)

  useEffect(() => {
    setMounted(true)
    setNearbyFullBins(BINS.filter(b => b.fillLevel > 80).length)
  }, [])

  if (isAuthLoading || (isProfileLoading && !profileData)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center justify-between ml-12 md:ml-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">On Duty</p>
              <h2 className="text-sm font-bold">
                {profileData?.workerName || user?.email?.split('@')[0] || "Worker"}
              </h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/worker/notifications">
              <Bell className="h-6 w-6" />
              {notifications && notifications.length > 0 && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
              )}
            </Link>
          </Button>
        </div>
      </header>

      <main className="container max-w-lg space-y-6 px-4 py-6 mx-auto">
        {/* Quick Work Status */}
        <Card className="border-none bg-primary text-white shadow-xl shadow-primary/20">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-2xl font-bold">Working Hard?</h3>
              <p className="text-sm opacity-80">Check your current queue of reports.</p>
            </div>
            <div className="h-16 w-16 flex-shrink-0">
               <div className="relative h-full w-full flex items-center justify-center">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path className="stroke-white/20" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="stroke-white" strokeWidth="3" strokeDasharray="67, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-[10px] font-bold">LIVE</span>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Actionable Tasks Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/worker/tasks" className="block group">
            <Card className="border-none shadow-sm active:scale-95 transition-all">
              <CardContent className="p-4 flex flex-col items-center gap-2">
                 <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <ClipboardList className="h-5 w-5" />
                 </div>
                 <div className="text-center">
                    <p className="text-lg font-bold">{isTasksLoading ? "..." : activeTaskCount}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Tasks Assigned</p>
                 </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/worker/bins" className="block group">
            <Card className="border-none shadow-sm active:scale-95 transition-all">
              <CardContent className="p-4 flex flex-col items-center gap-2">
                 <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive group-hover:bg-destructive group-hover:text-white transition-colors">
                    <AlertCircle className="h-5 w-5" />
                 </div>
                 <div className="text-center">
                    <p className="text-lg font-bold">{mounted ? nearbyFullBins : "--"}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Full Bins</p>
                 </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Progress List */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Duty Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
             <div className="space-y-1.5">
               <div className="flex justify-between text-xs font-bold">
                 <span>ACTIVE QUEUE</span>
                 <span className="text-primary">{activeTaskCount} Reports</span>
               </div>
               <Progress value={Math.min(activeTaskCount * 10, 100)} className="h-1.5" />
             </div>

             <div className="space-y-1.5">
               <div className="flex justify-between text-xs font-bold">
                 <span>WARD 12 BINS</span>
                 <span className="text-secondary-foreground">{nearbyFullBins} Alerts</span>
               </div>
               <Progress value={67} className="h-1.5 bg-secondary/20" indicatorColor="bg-secondary" />
             </div>
          </CardContent>
        </Card>

        {/* Quick Access List */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase text-muted-foreground px-1">Quick Links</h4>
          <Button asChild variant="outline" className="w-full h-14 justify-between rounded-2xl border-none shadow-sm bg-white hover:bg-muted group">
            <Link href="/worker/route">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Map className="h-4 w-4" />
                </div>
                <span className="font-semibold">Optimized Route</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full h-14 justify-between rounded-2xl border-none shadow-sm bg-white hover:bg-muted group">
            <Link href="/worker/report">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="font-semibold">Submit Work Report</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
