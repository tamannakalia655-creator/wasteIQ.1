"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Camera, 
  MapPin, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Trophy, 
  X,
  FileCheck,
  Building2
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useDoc, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase"
import { collection, doc, increment } from "firebase/firestore"
import { WARD_NAMES } from "@/app/lib/mock-data"

function ReportWasteForm() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    type: "Overflowing Bin",
    ward: "12",
    location: "",
    description: "",
    binId: ""
  })

  // Pre-fill from query params if clicked from Map or Bin details
  useEffect(() => {
    const binIdParam = searchParams.get("binId")
    const locParam = searchParams.get("location")
    if (locParam) {
      setFormData(prev => ({ ...prev, location: locParam }))
    }
    if (binIdParam) {
      setFormData(prev => ({ ...prev, binId: binIdParam, type: "Overflowing Bin" }))
    }
  }, [searchParams])

  // Get citizen profile
  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid, "citizenProfile", "profile")
  }, [db, user?.uid])
  const { data: profileData } = useDoc(profileRef)

  useEffect(() => {
    if (profileData?.wardId && !formData.ward) {
      setFormData(prev => ({ ...prev, ward: profileData.wardId.toString() }))
    }
  }, [profileData])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !db || !profileRef) {
      toast({
        variant: "destructive",
        title: "Session required",
        description: "Please sign in to file an official report."
      })
      return
    }

    if (!formData.location.trim() || !formData.description.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please specify the location and description."
      })
      return
    }

    setLoading(true)

    const isCritical = formData.type.includes("Illegal") || formData.type.includes("Hazardous")
    const isHigh = formData.type.includes("Overflowing")

    const complaintData = {
      citizenId: user.uid,
      citizenName: profileData?.fullName || "Citizen",
      type: formData.type,
      location: formData.location.trim(),
      ward: Number(formData.ward) || 12,
      binId: formData.binId || null,
      description: formData.description.trim(),
      photoUrl: previewImage || null,
      status: "Pending",
      priority: isCritical ? "Critical" : isHigh ? "High" : "Medium",
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
          title: "Report Submitted Successfully",
          description: "Your report has been forwarded to Ward sanitation workers. +10 Eco Points awarded!",
        })
      })
      .catch((err) => {
        console.error("Complaint filing error:", err)
        toast({
          variant: "destructive",
          title: "Submission Error",
          description: "Unable to submit report. Please check your connection and retry.",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-amber-900 shadow-md">
            <Trophy className="h-4 w-4" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Complaint Filed Successfully</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Thank you for reporting. Your issue has been logged in the Baripada Municipal queue and awarded <span className="font-bold text-emerald-700">+10 Eco Points</span> to your profile.
        </p>
        <div className="mt-8 space-y-3 w-full max-w-xs">
          <Button asChild className="w-full h-11 rounded-xl font-bold">
            <Link href="/citizen/dashboard">View Status on Dashboard</Link>
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-11 rounded-xl font-bold" 
            onClick={() => {
              setSubmitted(false)
              setPreviewImage(null)
              setFormData({ type: "Overflowing Bin", ward: "12", location: "", description: "", binId: "" })
            }}
          >
            File Another Report
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-8">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 px-4 py-3.5 backdrop-blur-md border-b">
        <div className="container max-w-lg mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-xl">
            <Link href="/citizen/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-base font-bold text-foreground">Report Waste Issue</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Baripada Municipal Grievance Redressal</p>
          </div>
        </div>
      </header>

      <main className="container max-w-lg space-y-5 px-4 py-6 mx-auto">
        {/* Eco points incentive banner */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-tight text-emerald-900">Civic Participation Reward</p>
              <p className="text-xs text-emerald-700">Receive 10 Eco Points per genuine community report</p>
            </div>
          </div>
          <span className="text-base font-black text-emerald-800">+10 PTS</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded-2xl border shadow-sm">
          {/* Issue Type */}
          <div className="space-y-1.5">
            <Label htmlFor="type" className="text-xs font-semibold">Issue Category</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full h-11 px-3 text-sm rounded-xl border bg-muted/20 text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="Overflowing Bin">Overflowing Smart Bin</option>
              <option value="Street Littering">Street Littering &amp; Garbage Pile</option>
              <option value="Missed Door-to-Door Collection">Missed Door-to-Door Collection</option>
              <option value="Broken Smart Bin">Broken Bin Sensor / Physical Damage</option>
              <option value="Illegal Dumping">Illegal Dumping (Hazardous / Bulk Waste)</option>
            </select>
          </div>

          {/* Ward Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="ward" className="text-xs font-semibold">Municipal Ward</Label>
            <select
              id="ward"
              value={formData.ward}
              onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
              className="w-full h-11 px-3 text-sm rounded-xl border bg-muted/20 text-foreground focus:ring-2 focus:ring-primary"
            >
              {WARD_NAMES.map((name, i) => (
                <option key={i + 1} value={(i + 1).toString()}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Description */}
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-xs font-semibold">Exact Location / Landmark</Label>
            <div className="relative">
              <Input
                id="location"
                placeholder="e.g. Near Station Bazar Railway Overbridge, Main Road"
                className="h-11 rounded-xl pl-9"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            </div>
            {formData.binId && (
              <p className="text-[11px] text-primary font-medium">Linked to Smart Bin: {formData.binId}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="desc" className="text-xs font-semibold">Detailed Description</Label>
            <Textarea
              id="desc"
              placeholder="Describe the condition, smell, obstruction to traffic, or any safety concerns..."
              className="min-h-[100px] rounded-xl text-sm resize-none"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Optional Reference Photo */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Attach Photo (Optional)</Label>
            {previewImage ? (
              <div className="relative rounded-xl overflow-hidden border h-36 w-full">
                <img src={previewImage} alt="Report Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex h-28 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground font-semibold">Tap to upload reference image</span>
                <span className="text-[10px] text-muted-foreground">PNG, JPG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl text-sm font-bold shadow-md"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck className="mr-2 h-4 w-4" />}
            Submit Official Report
          </Button>
        </form>

        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex gap-2.5 text-xs text-blue-900">
          <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            All submitted reports are dispatched directly to the municipal sanitation worker assigned to the respective ward. You can track progress on your dashboard.
          </p>
        </div>
      </main>
    </div>
  )
}

export default function ReportWaste() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ReportWasteForm />
    </Suspense>
  )
}
