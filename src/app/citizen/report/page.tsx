
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, MapPin, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Trophy } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useDoc, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase"
import { collection, doc, increment } from "firebase/firestore"

export default function ReportWaste() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    description: ""
  })

  // Get citizen profile to store their name with the complaint and update points
  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid, "citizenProfile", "profile")
  }, [db, user?.uid])
  const { data: profileData } = useDoc(profileRef)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !db || !profileRef) return
    
    setLoading(true)
    
    const complaintData = {
      citizenId: user.uid,
      citizenName: profileData?.fullName || "Citizen",
      type: formData.type,
      location: formData.location,
      description: formData.description,
      status: "Pending",
      priority: formData.type === 'illegal' ? "Critical" : formData.type === 'overflow' ? "High" : "Medium",
      createdAt: new Date().toISOString()
    }

    addDocumentNonBlocking(collection(db, "complaints"), complaintData)
      .then(() => {
        // Award 10 Eco Points for the report
        updateDocumentNonBlocking(profileRef, {
          totalRewardPoints: increment(10)
        })

        setSubmitted(true)
        toast({
          title: "Complaint Submitted",
          description: "Your report has been logged. You've earned 10 Eco Points!",
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

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg animate-bounce">
            <Trophy className="h-4 w-4" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Reported Successfully!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for being a responsible citizen. You earned <span className="font-bold text-primary">+10 Eco Points</span> for this report.
        </p>
        <div className="mt-8 space-y-3 w-full max-w-xs">
          <Button asChild className="w-full h-12 rounded-xl">
            <Link href="/citizen/dashboard">Back to Home</Link>
          </Button>
          <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => {
            setSubmitted(false)
            setFormData({ type: "", location: "", description: "" })
          }}>
            Report Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-4 bg-white/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/citizen/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Report an Issue</h1>
        </div>
      </header>

      <main className="container max-w-lg space-y-6 px-4 py-6 mx-auto">
        <div className="bg-secondary/10 rounded-2xl p-4 border border-secondary/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary-foreground">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-tight">Earn Rewards</p>
              <p className="text-[10px] text-muted-foreground font-medium">Earn 10 Eco Points per verified report</p>
            </div>
          </div>
          <span className="text-lg font-black text-secondary-foreground">+10</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Issue Type</Label>
              <Select 
                required 
                onValueChange={(v) => setFormData({...formData, type: v})}
                value={formData.type}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select the issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overflow">Overflowing Bin</SelectItem>
                  <SelectItem value="litter">Street Littering</SelectItem>
                  <SelectItem value="missed">Missed Collection</SelectItem>
                  <SelectItem value="broken">Broken Smart Bin</SelectItem>
                  <SelectItem value="illegal">Illegal Dumping</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reference Photo (Optional)</Label>
              <div className="flex h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 transition-colors hover:bg-muted/50 cursor-pointer">
                <Camera className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground font-medium">Click to capture or upload</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location / Ward</Label>
              <div className="relative">
                <Input 
                  id="location" 
                  placeholder="Enter location or Ward No." 
                  className="h-12 rounded-xl pl-10" 
                  required 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the issue in more detail..." 
                className="min-h-[100px] rounded-xl" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/20" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Submit Complaint
          </Button>
        </form>

        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
           <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
           <p className="text-xs text-blue-800 leading-relaxed">
             Your report will be sent to the Baripada Municipal Corporation. Verified reports earn Eco Points!
           </p>
        </div>
      </main>
    </div>
  )
}
