"use client"

import { useState } from "react"
import { useFirestore, useCollection, useMemoFirebase, useUser, updateDocumentNonBlocking } from "@/firebase"
import { collection, query, where, doc } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, ArrowLeft, Clock, AlertTriangle, Loader2, CheckCircle2, Navigation, ExternalLink, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function WorkerTasks() {
  const { toast } = useToast()
  const db = useFirestore()
  const { user, isUserLoading } = useUser()
  const [updatingTask, setUpdatingTask] = useState<any | null>(null)
  const [filter, setFilter] = useState<"all" | "in-progress" | "pending">("all")

  // Fetch complaints assigned to this worker
  const complaintsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return query(
      collection(db, "complaints"),
      where("assignedWorkerId", "==", user.uid)
    )
  }, [db, user?.uid])

  const { data: allAssignedComplaints, isLoading: isTasksLoading } = useCollection(complaintsQuery)

  // Filter & sort
  const activeTasks = (allAssignedComplaints || [])
    .filter(task => {
      if (filter === "all") return task.status !== "Resolved"
      if (filter === "in-progress") return task.status === "In Progress"
      return task.status === "Assigned" || task.status === "Pending"
    })
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

  const handleStartTask = (taskId: string) => {
    if (!db) return
    const ref = doc(db, "complaints", taskId)
    updateDocumentNonBlocking(ref, {
      status: "In Progress",
      startedAt: new Date().toISOString()
    })
    toast({
      title: "Task In Progress",
      description: "Status updated to In Progress.",
    })
  }

  const handleConfirmResolve = (taskId: string) => {
    if (!db) return
    const ref = doc(db, "complaints", taskId)
    updateDocumentNonBlocking(ref, {
      status: "Resolved",
      resolvedAt: new Date().toISOString()
    })

    setUpdatingTask(null)
    toast({
      title: "Task Marked as Resolved",
      description: "Municipal records and citizen notified.",
    })
  }

  if (isUserLoading || (isTasksLoading && !allAssignedComplaints)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-8">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 px-4 py-3.5 backdrop-blur-md border-b">
        <div className="container max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-xl">
              <Link href="/worker/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground">Assigned Field Tasks</h1>
              <p className="text-[11px] text-muted-foreground font-medium">
                {activeTasks.length} active collection assignments
              </p>
            </div>
          </div>
          <Button size="sm" asChild variant="outline" className="rounded-xl text-xs font-bold">
            <Link href="/worker/route">Route Map</Link>
          </Button>
        </div>
      </header>

      <main className="container max-w-lg space-y-4 px-4 py-6 mx-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-colors",
              filter === "all" ? "bg-primary text-white" : "bg-white border text-muted-foreground"
            )}
          >
            All Active ({allAssignedComplaints?.filter(t => t.status !== "Resolved").length ?? 0})
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-colors",
              filter === "in-progress" ? "bg-primary text-white" : "bg-white border text-muted-foreground"
            )}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-colors",
              filter === "pending" ? "bg-primary text-white" : "bg-white border text-muted-foreground"
            )}
          >
            Awaiting Action
          </button>
        </div>

        <div className="space-y-3.5">
          {activeTasks.map((task) => (
            <Card key={task.id} className="border shadow-sm overflow-hidden bg-white">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary">{task.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                        task.priority === "Critical" ? "bg-red-100 text-red-700" :
                        task.priority === "High" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {task.priority} Priority
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground mt-1">{task.type}</h3>
                  </div>

                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                    task.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-800"
                  )}>
                    {task.status}
                  </span>
                </div>

                <div className="space-y-1 bg-muted/20 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-foreground/90 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span>{task.location}</span>
                  </div>
                  {task.description && (
                    <p className="text-muted-foreground text-[11px] pt-1 italic">
                      &quot;{task.description}&quot;
                    </p>
                  )}
                  {task.citizenName && (
                    <p className="text-[11px] text-muted-foreground">Reported by: {task.citizenName}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.createdAt ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }) : "Recent"}
                  </span>
                  {task.binId && (
                    <span className="font-mono text-primary font-bold">Bin: {task.binId}</span>
                  )}
                </div>

                <div className="pt-2 border-t flex items-center gap-2">
                  {task.status !== "In Progress" ? (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="flex-1 h-9 rounded-xl text-xs font-bold"
                      onClick={() => handleStartTask(task.id)}
                    >
                      <Play className="h-3.5 w-3.5 mr-1 text-primary" />
                      Start Work
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      className="flex-1 h-9 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => setUpdatingTask(task)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Mark Resolved
                    </Button>
                  )}

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(task.location + ', Baripada, Odisha')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1 h-9 px-3.5 rounded-xl border bg-muted/30 text-xs font-bold text-foreground hover:bg-muted"
                  >
                    <Navigation className="h-3.5 w-3.5 text-primary" />
                    <span>Navigate</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {activeTasks.length === 0 && !isTasksLoading && (
            <div className="text-center py-16 text-muted-foreground bg-white rounded-2xl border p-8 space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <p className="font-bold text-foreground">No pending assigned tasks</p>
              <p className="text-xs text-muted-foreground">All assignments for your shift have been cleared.</p>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={!!updatingTask} onOpenChange={(open) => !open && setUpdatingTask(null)}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Confirm Resolution</DialogTitle>
            <DialogDescription>
              Confirm that this waste report has been resolved on site.
            </DialogDescription>
          </DialogHeader>
          
          {updatingTask && (
            <div className="py-2 space-y-2">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 space-y-1">
                <p className="font-bold">{updatingTask.type}</p>
                <p className="text-[11px] text-emerald-800">{updatingTask.location}</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2">
            <Button 
              className="w-full h-11 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700"
              onClick={() => updatingTask && handleConfirmResolve(updatingTask.id)}
            >
              Confirm &amp; Notify Citizen
            </Button>
            <Button 
              variant="ghost" 
              className="w-full rounded-xl text-xs" 
              onClick={() => setUpdatingTask(null)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
