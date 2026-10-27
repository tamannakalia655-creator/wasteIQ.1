"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Phone, Mail, Clock, AlertTriangle, BookOpen, Camera, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useDoc, useMemoFirebase, addDocumentNonBlocking } from "@/firebase"
import { collection, doc } from "firebase/firestore"

export default function HelpCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    category: "",
    description: ""
  })

  // Get citizen profile to store their name with the complaint
  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid, "citizenProfile", "profile")
  }, [db, user?.uid])
  const { data: profileData } = useDoc(profileRef)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !db || !formData.category || !formData.description) return
    
    setLoading(true)
    
    const complaintData = {
      citizenId: user.uid,
      citizenName: profileData?.fullName || "Citizen",
      type: `App Issue: ${formData.category}`,
      location: "Digital Support",
      description: formData.description,
      status: "Pending",
      priority: "Medium",
      createdAt: new Date().toISOString()
    }

    addDocumentNonBlocking(collection(db, "complaints"), complaintData)
      .then(() => {
        setSubmitted(true)
        toast({
          title: "Issue Transmitted",
          description: "Your report has been sent to the municipal IT administration.",
        })
      })
      .catch((err) => {
        console.error(err)
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "There was an error filing your report. Please try again.",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="sticky top-0 z-40 flex items-center gap-4 bg-white/80 dark:bg-card/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/citizen/settings"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Help Center</h1>
        </div>
      </header>

      <main className="container max-w-2xl space-y-6 px-4 py-6 mx-auto">
        {/* Contact Support */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase text-muted-foreground px-1">Contact Support</h2>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0 divide-y">
              <div className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Helpline Number</p>
                  <p className="text-sm font-bold">1800-123-WASTE</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Email Support</p>
                  <p className="text-sm font-bold">support@wasteiq.in</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Support Hours</p>
                  <p className="text-sm font-bold">9 AM – 6 PM (Mon–Sat)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Emergency Hotline */}
        <Card className="border-none bg-destructive/10 text-destructive shadow-none">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-xs font-medium leading-relaxed">
              If you see hazardous waste or illegal dumping, contact your local municipal authority immediately.
            </p>
          </CardContent>
        </Card>

        {/* Report a Problem Form */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase text-muted-foreground px-1">Report a Technical Issue</h2>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              {submitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold">Issue Transmitted</h3>
                  <p className="text-xs text-muted-foreground">Your technical feedback has been sent to the Admin Panel.</p>
                  <Button variant="outline" size="sm" onClick={() => {
                    setSubmitted(false)
                    setFormData({ category: "", description: "" })
                  }}>Report Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Issue Category</Label>
                    <Select required onValueChange={(v) => setFormData({...formData, category: v})}>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="app-not-working">App not working</SelectItem>
                        <SelectItem value="complaint-not-updating">Complaint not updating</SelectItem>
                        <SelectItem value="map-not-loading">Map not loading</SelectItem>
                        <SelectItem value="bin-status-incorrect">Bin status incorrect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea 
                      id="desc" 
                      placeholder="Describe what happened..." 
                      className="rounded-xl min-h-[100px]" 
                      required 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Screenshot (Optional)</Label>
                    <div className="flex h-24 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 transition-colors hover:bg-muted/50 cursor-pointer">
                      <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Add Photo</p>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 rounded-xl font-bold" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Transmit to Admin
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>

        {/* App Usage Guides */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase text-muted-foreground px-1">App Usage Guides</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Report Waste", icon: BookOpen },
              { title: "Use Guide", icon: BookOpen },
              { title: "Earn Rewards", icon: BookOpen },
              { title: "Track Status", icon: BookOpen },
            ].map((guide, idx) => (
              <Button key={idx} variant="outline" className="h-20 flex-col gap-1 rounded-2xl bg-white dark:bg-card border-none shadow-sm hover:bg-muted group">
                <BookOpen className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase text-center">{guide.title}</span>
              </Button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
