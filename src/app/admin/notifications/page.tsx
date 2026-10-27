
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Send, 
  Target, 
  History, 
  AlertTriangle, 
  Megaphone,
  Clock,
  ArrowLeft,
  Loader2,
  Trash2,
  ShieldCheck,
  Info
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase"
import { collection, query, orderBy, limit, doc } from "firebase/firestore"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export default function BroadcasterPage() {
  const { toast } = useToast()
  const db = useFirestore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target: "all",
    type: "info"
  })

  const historyQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(15))
  }, [db])

  const { data: history, isLoading: historyLoading } = useCollection(historyQuery)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!db) return
    setLoading(true)
    
    const notificationData = {
      ...formData,
      createdAt: new Date().toISOString()
    }

    addDocumentNonBlocking(collection(db, "notifications"), notificationData)
      .then(() => {
        toast({
          title: "Broadcast Dispatched",
          description: `Successfully sent to ${formData.target === 'all' ? 'the entire community' : formData.target}.`,
        })
        setFormData({ title: "", message: "", target: "all", type: "info" })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDelete = (id: string) => {
    if (!db) return
    const ref = doc(db, "notifications", id)
    deleteDocumentNonBlocking(ref)
    toast({
      title: "Broadcast Retracted",
      description: "The notification has been removed from all feeds.",
    })
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="md:hidden rounded-full">
            <Link href="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Broadcaster</h1>
            <p className="text-muted-foreground font-medium">Global communication hub for Baripada Waste Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Transmitting</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compose Form */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-primary/5 border-b pb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                <Megaphone className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">New Announcement</CardTitle>
                <CardDescription>Draft and dispatch a verified broadcast message</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSend} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(v) => setFormData({...formData, type: v})}
                  >
                    <SelectTrigger className="rounded-xl h-12 bg-muted/30 border-none">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="info">General Update</SelectItem>
                      <SelectItem value="alert">Emergency Alert</SelectItem>
                      <SelectItem value="campaign">Eco Campaign</SelectItem>
                      <SelectItem value="system">System Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Audience</Label>
                  <Select 
                    value={formData.target} 
                    onValueChange={(v) => setFormData({...formData, target: v})}
                  >
                    <SelectTrigger className="rounded-xl h-12 bg-muted/30 border-none">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">Public (Everyone)</SelectItem>
                      <SelectItem value="citizens">Citizens Only</SelectItem>
                      <SelectItem value="workers">Sanitation Workers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Ward 12 Collection Delay Today" 
                  className="rounded-xl h-12 bg-muted/30 border-none px-4"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detailed Message</Label>
                  <span className={cn(
                    "text-[10px] font-bold uppercase",
                    formData.message.length > 450 ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {formData.message.length} / 500
                  </span>
                </div>
                <Textarea 
                  id="message" 
                  placeholder="Provide essential details here..." 
                  className="rounded-xl min-h-[180px] resize-none bg-muted/30 border-none p-4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>

              <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium bg-muted/20 px-4 py-2 rounded-xl">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Messages are delivered in real-time to all matching user apps.
                 </div>
                 <Button type="submit" className="w-full sm:w-auto rounded-xl px-10 h-14 font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]" disabled={loading}>
                   {loading ? (
                     <Loader2 className="h-5 w-5 animate-spin mr-2" />
                   ) : (
                     <Send className="h-5 w-5 mr-2" />
                   )}
                   {loading ? "Dispatching..." : "Transmit Broadcast"}
                 </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar History */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Recent Logs</CardTitle>
                </div>
                <Badge variant="secondary" className="rounded-lg text-[9px] font-bold">{history?.length ?? 0}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {historyLoading ? (
                <div className="p-16 flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Accessing Records</p>
                </div>
              ) : (
                <div className="divide-y max-h-[600px] overflow-y-auto custom-scrollbar">
                  {(history || []).map((item) => (
                    <div key={item.id} className="p-5 hover:bg-muted/30 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className={cn(
                          "text-[8px] h-5 uppercase font-bold tracking-tighter rounded-md",
                          item.type === 'alert' ? "border-destructive text-destructive bg-destructive/5" :
                          item.type === 'campaign' ? "border-primary text-primary bg-primary/5" : "bg-muted"
                        )}>
                          {item.type}
                        </Badge>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:text-destructive" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-3 w-3" />
                           </Button>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold truncate mb-1">{item.title}</h4>
                      <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase mt-2">
                         <span className="flex items-center gap-1.5"><Target className="h-3 w-3" /> {item.target}</span>
                         <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  ))}
                  {(!history || history.length === 0) && (
                    <div className="p-16 text-center">
                      <p className="text-xs font-medium text-muted-foreground">No broadcasts on record.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-2xl bg-orange-50 p-6 border border-orange-100 flex gap-4">
             <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0" />
             <div>
               <p className="text-xs font-bold text-orange-900 uppercase tracking-tight mb-1">Administrative Warning</p>
               <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
                 Official broadcasts cannot be edited once sent. High-priority alerts trigger instant push notifications on user devices.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
