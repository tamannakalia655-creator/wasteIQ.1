
"use client"

import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase"
import { collection, query, where, limit } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Bell, 
  Info, 
  AlertCircle, 
  Megaphone, 
  ShieldAlert, 
  CheckCircle2, 
  Clock,
  Loader2,
  Briefcase
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export default function WorkerNotifications() {
  const db = useFirestore()
  const { user } = useUser()

  // Removed orderBy to avoid composite index requirement
  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return query(
      collection(db, "notifications"),
      where("target", "in", ["all", "workers"]),
      limit(50)
    )
  }, [db, user?.uid])

  const { data: notifications, isLoading } = useCollection(notificationsQuery)

  // Client-side sorting for display
  const sortedNotifications = (notifications || []).sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  })

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'campaign': return <Megaphone className="h-5 w-5 text-primary" />;
      case 'system': return <ShieldAlert className="h-5 w-5 text-orange-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  }

  const getBg = (type: string) => {
    switch (type) {
      case 'alert': return "bg-destructive/10";
      case 'campaign': return "bg-primary/10";
      case 'system': return "bg-orange-100";
      default: return "bg-blue-50";
    }
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 px-4 py-6 backdrop-blur-md border-b border-border/40">
        <div className="container max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link href="/worker/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Duty Updates</h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Field Personnel Alerts</p>
            </div>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary-foreground shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>
      </header>

      <main className="container max-w-2xl space-y-4 px-4 py-6 mx-auto">
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-center gap-3 mb-6">
           <Info className="h-5 w-5 text-primary flex-shrink-0" />
           <p className="text-xs font-medium text-primary/80">Stay tuned for shift adjustments and emergency disposal protocols.</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-foreground/60">Fetching Intel</p>
              <p className="text-xs text-muted-foreground">Contacting municipal servers...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedNotifications.map((note) => (
              <Card key={note.id} className="border-none shadow-sm group hover:shadow-md transition-all overflow-hidden bg-white">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className={cn("w-1.5 flex-shrink-0 transition-all group-hover:w-2", 
                      note.type === 'alert' ? "bg-destructive" : 
                      note.type === 'campaign' ? "bg-primary" : 
                      note.type === 'system' ? "bg-orange-500" : "bg-blue-500"
                    )} />
                    <div className="flex-1 p-5">
                      <div className="flex items-start gap-4">
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner", getBg(note.type))}>
                          {getIcon(note.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h3 className="font-bold text-base text-foreground truncate">{note.title}</h3>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-lg">
                              <Clock className="h-3 w-3" />
                              {note.createdAt ? formatDistanceToNow(new Date(note.createdAt), { addSuffix: true }) : "Just now"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {note.message}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-dashed">
                             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{note.type} Protocol</span>
                             <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-tight">Confirm Read</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!notifications || notifications.length === 0) && (
              <div className="py-32 text-center space-y-6">
                <div className="mx-auto h-24 w-24 rounded-[3rem] bg-muted/20 flex items-center justify-center text-muted-foreground/30 relative">
                  <Bell className="h-12 w-12" />
                  <div className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary/20 animate-ping" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Duty log clear</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-[260px] mx-auto">
                    No active broadcasts for field workers. Continue with your assigned ward routes.
                  </p>
                </div>
                <Button asChild variant="outline" className="rounded-xl font-bold">
                  <Link href="/worker/tasks">View Current Tasks</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        <footer className="pt-12 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Official Municipal Duty Channel</p>
        </footer>
      </main>
    </div>
  )
}
