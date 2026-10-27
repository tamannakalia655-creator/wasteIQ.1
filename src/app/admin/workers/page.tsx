
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, MoreVertical, Briefcase, MapPin, CheckCircle2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase"
import { collection, query, where, doc } from "firebase/firestore"

export default function WorkerManagement() {
  const db = useFirestore()
  const { user } = useUser()

  // Guard: Verify admin status before listing workers
  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid)
  }, [db, user?.uid])
  const { data: userData } = useDoc(userRef)
  const isAdmin = userData?.role === 'admin'

  const workersQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null
    return query(collection(db, "users"), where("role", "==", "worker"))
  }, [db, isAdmin])

  const { data: workers, isLoading } = useCollection(workersQuery)

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sanitation Workers</h1>
          <p className="text-muted-foreground">Manage on-field staff and ward assignments</p>
        </div>
        <Button className="rounded-xl font-bold flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Worker
        </Button>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
         <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search workers by name or ID..." className="pl-10 rounded-xl h-11 border-none bg-white shadow-sm" />
         </div>
         <Button variant="outline" className="rounded-xl h-11 px-6 font-bold flex gap-2">
            <Filter className="h-4 w-4" />
            Ward Filters
         </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(workers || []).map((worker) => (
            <Card key={worker.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{worker.fullName || worker.email.split('@')[0]}</h3>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">{worker.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Assigned Ward: <span className="text-foreground font-semibold">TBD</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-secondary-foreground" />
                    <span>Status: <span className="text-foreground font-semibold">Online</span></span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex items-center justify-between">
                  <Badge variant="default" className="rounded-lg uppercase text-[10px] font-bold">
                    Active
                  </Badge>
                  <Button variant="outline" size="sm" className="rounded-lg font-bold text-xs">Assign Tasks</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(workers || []).length === 0 && !isLoading && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              No workers registered in the system yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
