
"use client"

import { useState } from "react"
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase"
import { collection, query, where, limit } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
  Filter
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export default function CitizenNotifications() {
  const db = useFirestore()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("all")

  // Removed orderBy to avoid composite index requirement in prototype
  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return query(
      collection(db, "notifications"),
      where("target", "in", ["all", "citizens"]),
      limit(50)
    )
  }, [db, user?.uid])

  const { data: notifications, isLoading } = useCollection(notificationsQuery)

  // Client-side sorting and filtering
  const filteredNotifications = (notifications || [])
    .filter(note => {
      if (activeTab === 'all') return true
      return note.type === activeTab
    })
    .sort((a, b) => {
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
      <header className="sticky top-0 z-40 bg-white/80 px-4 py-6 backdrop-blur-md border-b border-border/40">
        <div className="container max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="rounded-full">
                <Link href="/citizen/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Updates & Alerts</h1>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Baripada Municipal broadcasts</p>
              </div>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <Bell className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl px-4 py-6 mx-auto space-y-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-xs font-bold px-4">All</TabsTrigger>
              <TabsTrigger value="alert" className="rounded-lg text-xs font-bold px-4">Alerts</TabsTrigger>
              <TabsTrigger value="campaign" className="rounded-lg text-xs font-bold px-4">Campaigns</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Scanning frequencies...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredNotifications.map((note) => (
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
                                <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap bg-muted/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {note.createdAt ? formatDistanceToNow(new Date(note.createdAt), { addSuffix: true }) : "Just now"}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {note.message}
                              </p>
                              <div className="mt-4 flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-muted/50 border text-muted-foreground">
                                  {note.type}
                                </span>
                                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Verified Broadcast</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredNotifications.length === 0 && (
                  <div className="py-32 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto h-24 w-24 rounded-[2.5rem] bg-muted/30 flex items-center justify-center text-muted-foreground/20">
                      <Bell className="h-12 w-12" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground/80">Quiet at the moment</h3>
                      <p className="text-sm text-muted-foreground max-w-[240px] mx-auto mt-2">
                        No new {activeTab === 'all' ? 'notifications' : activeTab + 's'} for your ward. We'll alert you if something comes up!
                      </p>
                    </div>
                    <Button variant="outline" className="rounded-xl font-bold" onClick={() => setActiveTab('all')}>
                      View All Updates
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <footer className="pt-12 text-center space-y-4">
          <div className="h-px w-12 bg-border mx-auto" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Official Municipal Broadcast Channel</p>
          <div className="flex justify-center gap-4 opacity-30">
             <ShieldAlert className="h-4 w-4" />
             <CheckCircle2 className="h-4 w-4" />
          </div>
        </footer>
      </main>
    </div>
  )
}
