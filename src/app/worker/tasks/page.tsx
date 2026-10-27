
"use client"

import { useState } from "react"
import { useFirestore, useCollection, useMemoFirebase, useUser, updateDocumentNonBlocking } from "@/firebase"
import { collection, query, where, doc } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft, MoreVertical, Clock, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react"
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

export default function WorkerTasks() {
  const { toast } = useToast()
  const db = useFirestore()
  const { user, isUserLoading } = useUser()
  const [updatingTask, setUpdatingTask] = useState<any | null>(null)

  // 1. Fetch complaints assigned specifically to THIS worker
  // Removed orderBy to avoid index requirement errors in prototype
  const complaintsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return query(
      collection(db, "complaints"),
      where("assignedWorkerId", "==", user.uid)
    )
  }, [db, user?.uid])

  const { data: allAssignedComplaints, isLoading: isTasksLoading } = useCollection(complaintsQuery)

  // 2. Client-side filtering and sorting for active tasks
  const activeTasks = (allAssignedComplaints || [])
    .filter(task => task.status !== 'Resolved')
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  const handleConfirmResolve = (taskId: string) => {
    if (!db) return
    
    const ref = doc(db, "complaints", taskId)
    updateDocumentNonBlocking(ref, {
      status: "Resolved",
      resolvedAt: new Date().toISOString()
    })

    setUpdatingTask(null)
    toast({
      title: "Task Completed",
      description: "The complaint has been marked as Resolved.",
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/worker/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Assigned Tasks</h1>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </header>

      <main className="container max-w-lg space-y-4 px-4 py-6 mx-auto">
        <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
           <Button size="sm" className="rounded-full px-4 font-bold uppercase text-[10px]">Active ({activeTasks.length})</Button>
           <Button size="sm" variant="outline" className="rounded-full px-4 font-bold uppercase text-[10px] border-none bg-white shadow-sm">Nearby</Button>
        </div>

        <div className="space-y-4">
          {activeTasks.map((task) => (
            <Card key={task.id} className="border-none shadow-sm overflow-hidden active:scale-[0.98] transition-all">
              <CardContent className="p-0">
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-muted-foreground">{task.id.slice(0, 8).toUpperCase()}</span>
                       <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                       <span className="text-xs font-bold text-muted-foreground uppercase">{task.priority} Priority</span>
                    </div>
                    <Badge variant={task.status === 'Assigned' ? 'default' : 'outline'} className="text-[10px] uppercase font-bold tracking-tight">
                       {task.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-bold text-foreground">{task.type}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      {task.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tighter pt-1">
                     <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {task.createdAt ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }) : "Just now"}
                     </div>
                     {(task.priority === 'High' || task.priority === 'Critical') && (
                        <div className="flex items-center gap-1.5 text-destructive">
                           <AlertTriangle className="h-3 w-3" />
                           Action Required
                        </div>
                     )}
                  </div>
                </div>
                <div className="bg-muted/30 p-3 flex gap-2">
                   <Button 
                    variant="default" 
                    className="flex-1 h-9 rounded-lg text-xs font-bold"
                    onClick={() => setUpdatingTask(task)}
                   >
                      Update Status
                   </Button>
                   <Button variant="outline" className="h-9 rounded-lg border-none bg-white shadow-sm text-xs font-bold">
                      Navigate
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {activeTasks.length === 0 && !isTasksLoading && (
            <div className="text-center py-20 text-muted-foreground bg-white/50 rounded-2xl border border-dashed">
              <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 opacity-20" />
              </div>
              <p className="font-bold">No assigned tasks found</p>
              <p className="text-xs mt-1">Check back later or contact your supervisor.</p>
            </div>
          )}
        </div>
      </main>

      {/* Update Status Dialog */}
      <Dialog open={!!updatingTask} onOpenChange={(open) => !open && setUpdatingTask(null)}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Update Status</DialogTitle>
            <DialogDescription>
              Confirm that you have resolved this waste management issue.
            </DialogDescription>
          </DialogHeader>
          
          {updatingTask && (
            <div className="py-4 space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Task</p>
                <p className="text-sm font-bold">{updatingTask.type}</p>
                <p className="text-xs text-muted-foreground">{updatingTask.location}</p>
              </div>
              
              <div className="rounded-xl bg-orange-50 p-3 flex gap-3 border border-orange-100">
                <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <p className="text-[11px] text-orange-800 font-medium leading-tight">
                  Marking as resolved will notify the citizen and update the municipal records.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2">
            <Button 
              className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
              onClick={() => updatingTask && handleConfirmResolve(updatingTask.id)}
            >
              Mark as Resolved
            </Button>
            <Button 
              variant="ghost" 
              className="w-full rounded-xl" 
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
