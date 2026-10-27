
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MoreVertical, 
  Clock, 
  User, 
  MapPin,
  ArrowRight,
  Loader2,
  Briefcase,
  CheckCircle2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useUser, useDoc } from "@/firebase"
import { collection, doc, query, where, orderBy } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export default function ComplaintManagement() {
  const { toast } = useToast()
  const { user } = useUser()
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null)
  const db = useFirestore()

  // Guard: Verify admin status before listing workers
  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid)
  }, [db, user?.uid])
  const { data: userData } = useDoc(userRef)
  const isAdmin = userData?.role === 'admin'

  const complaintsRef = useMemoFirebase(() => {
    if (!db || !isAdmin) return null
    return query(collection(db, "complaints"), orderBy("createdAt", "desc"))
  }, [db, isAdmin])

  const { data: complaints, isLoading } = useCollection(complaintsRef)

  // Fetch workers for assignment - restricted to admins to prevent permission errors
  const workersQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null
    return query(collection(db, "users"), where("role", "==", "worker"))
  }, [db, isAdmin])
  const { data: workers, isLoading: isWorkersLoading } = useCollection(workersQuery)

  const handleOpenAssignDialog = (complaintId: string) => {
    setSelectedComplaintId(complaintId)
    setAssignDialogOpen(true)
  }

  const handleAssignToWorker = (workerId: string, workerName: string) => {
    if (!db || !selectedComplaintId) return
    
    const ref = doc(db, "complaints", selectedComplaintId)
    updateDocumentNonBlocking(ref, {
      status: "Assigned",
      assignedWorkerId: workerId,
      assignedWorkerName: workerName,
      assignedAt: new Date().toISOString()
    })

    setAssignDialogOpen(false)
    setSelectedComplaintId(null)
    
    toast({
      title: "Worker Assigned",
      description: `${workerName} has been assigned to this complaint.`,
    })
  }

  const filteredComplaints = (complaints || []).filter(c => {
    const matchesFilter = filter === 'all' ? true : 
                         filter === 'pending' ? c.status === 'Pending' :
                         filter === 'urgent' ? (c.priority === 'Critical' || c.priority === 'High') : true
    
    const matchesSearch = c.type?.toLowerCase().includes(search.toLowerCase()) || 
                         c.citizenName?.toLowerCase().includes(search.toLowerCase()) ||
                         c.location?.toLowerCase().includes(search.toLowerCase()) ||
                         c.id.toLowerCase().includes(search.toLowerCase())

    return matchesFilter && matchesSearch
  })

  if (!isAdmin && !isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying administrative access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Complaints Center</h1>
          <p className="text-muted-foreground font-medium">Monitoring {complaints?.length ?? 0} active reports across Baripada</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-bold border-primary/20 text-primary">Export CSV</Button>
          <Button className="rounded-xl font-bold">Priority View</Button>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
         <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, name or ward..." 
              className="pl-10 rounded-xl h-11 border-none bg-white shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-2">
           <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')} className="rounded-full text-[10px] font-bold uppercase px-4 h-8">All</Button>
           <Button variant={filter === 'pending' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('pending')} className="rounded-full text-[10px] font-bold uppercase px-4 h-8">Pending</Button>
           <Button variant={filter === 'urgent' ? 'destructive' : 'outline'} size="sm" onClick={() => setFilter('urgent')} className="rounded-full text-[10px] font-bold uppercase px-4 h-8">Critical</Button>
         </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className={cn(
                    "w-1.5 flex-shrink-0",
                    complaint.priority === 'Critical' ? "bg-red-500" : 
                    complaint.priority === 'High' ? "bg-orange-500" : "bg-blue-500"
                  )} />
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{complaint.id.slice(0, 8)}</span>
                          <Badge variant={complaint.status === 'Resolved' ? 'secondary' : 'outline'} className="rounded-lg text-[9px] font-bold uppercase">
                            {complaint.status}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-bold">{complaint.type}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium pt-1">
                          <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {complaint.citizenName || 'Citizen'}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {complaint.location}</span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> 
                            {complaint.createdAt ? formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true }) : "Just now"}
                          </span>
                        </div>
                        {complaint.assignedWorkerName && (
                          <div className="flex items-center gap-2 mt-2 text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full w-fit">
                            <Briefcase className="h-3 w-3" />
                            Assigned to: {complaint.assignedWorkerName}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block mr-2">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Priority</p>
                          <p className={cn(
                            "text-xs font-bold uppercase",
                            complaint.priority === 'Critical' ? "text-red-600" : 
                            complaint.priority === 'High' ? "text-orange-600" : "text-blue-600"
                          )}>{complaint.priority}</p>
                        </div>
                        {complaint.status === 'Pending' && (
                          <Button 
                            variant="outline" 
                            className="rounded-xl h-10 px-4 font-bold text-xs flex gap-2 border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => handleOpenAssignDialog(complaint.id)}
                          >
                            Assign Worker
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem className="font-medium text-xs">View Details</DropdownMenuItem>
                            <DropdownMenuItem className="font-medium text-xs">Contact Citizen</DropdownMenuItem>
                            <DropdownMenuItem className="font-medium text-xs text-destructive">Dismiss Case</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredComplaints.length === 0 && (
            <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
              <CheckCircle2 className="h-12 w-12 opacity-20" />
              <p>No complaints matching this criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Assign Worker Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Assign Sanitation Worker</DialogTitle>
            <DialogDescription>
              Select a field worker to resolve this complaint.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search worker by name..." className="pl-10 rounded-xl" />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {isWorkersLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                (workers || []).map((worker) => (
                  <button
                    key={worker.id}
                    onClick={() => handleAssignToWorker(worker.id, worker.fullName || worker.email.split('@')[0])}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{worker.fullName || worker.email.split('@')[0]}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">ID: {worker.id.slice(0, 6)}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))
              )}
              {(!workers || workers.length === 0) && !isWorkersLoading && (
                <p className="text-center py-10 text-xs text-muted-foreground">No workers available.</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setAssignDialogOpen(false)} className="rounded-xl font-bold">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
