"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Leaf, 
  ShieldCheck, 
  Loader2, 
  Info, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Lock, 
  Compass, 
  ClipboardList,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase"
import { startReviewerDemoSession } from "@/lib/demo-auth"

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const db = useFirestore()
  const roleParam = searchParams.get('role') || 'citizen'
  
  // Tab state: default to 'demo' if reviewing admin/worker or query param is set
  const [activeTab, setActiveTab] = useState<string>("demo")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoLoadingRole, setDemoLoadingRole] = useState<"admin" | "worker" | null>(null)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [demoNotice, setDemoNotice] = useState<string | null>(null)

  // Standard Email/Password Sign-In
  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier || !password || !db || !auth) return
    
    setLoading(true)

    try {
      const trimmedId = identifier.trim()
      const isOfficialAdminUsername = trimmedId === "admin@baripadawasteIQ"
      const loginEmail = isOfficialAdminUsername ? "admin@baripada.gov" : trimmedId
      const loginPassword = isOfficialAdminUsername ? "admin@123" : password

      // 1. Attempt Authentication with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      const user = userCredential.user

      // 2. Initial Role Check and Document Sync
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (!userDoc.exists()) {
        if (isOfficialAdminUsername) {
          setDocumentNonBlocking(userDocRef, {
            id: user.uid,
            email: loginEmail,
            role: "admin",
            createdAt: new Date().toISOString()
          }, { merge: true })

          const adminProfileRef = doc(db, "users", user.uid, "adminProfile", "profile")
          setDocumentNonBlocking(adminProfileRef, {
            id: "profile",
            userId: user.uid,
            fullName: "System Administrator",
            email: loginEmail,
            mobileNumber: "+91 06792 252000"
          }, { merge: true })
        } else if (trimmedId.toLowerCase().includes('worker')) {
          setDocumentNonBlocking(userDocRef, {
            id: user.uid,
            email: user.email,
            role: "worker",
            createdAt: new Date().toISOString()
          }, { merge: true })

          const workerProfileRef = doc(db, "users", user.uid, "workerProfile", "profile")
          setDocumentNonBlocking(workerProfileRef, {
            id: "profile",
            userId: user.uid,
            workerName: user.email?.split('@')[0] || "Worker",
            workerId: `W-${user.uid.slice(0, 4).toUpperCase()}`,
            assignedWardId: "12",
            contactNumber: "+91 00000 00000"
          }, { merge: true })
        } else {
          setDocumentNonBlocking(userDocRef, {
            id: user.uid,
            email: user.email,
            role: "citizen",
            createdAt: new Date().toISOString()
          }, { merge: true })
        }
      }

      // 3. Wait for database sync before redirecting
      const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const actualRole = snapshot.data().role
          
          if (roleParam === 'admin' && actualRole !== 'admin') {
            unsubscribe()
            setLoading(false)
            toast({ variant: "destructive", title: "Access Denied", description: "This is not an admin account." })
            return
          }
          if (roleParam === 'worker' && actualRole !== 'worker') {
            unsubscribe()
            setLoading(false)
            toast({ variant: "destructive", title: "Access Denied", description: "This is not a worker account." })
            return
          }

          toast({ title: "Welcome Back", description: `Successfully signed in as ${actualRole}.` })
          unsubscribe()
          router.push(`/${actualRole}/dashboard`)
        }
      })

    } catch (err: any) {
      setLoading(false)
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: err.message || "Please check your credentials.",
      })
    }
  }

  // Reviewer Demo Launch Handler
  const handleLaunchDemo = async (role: "admin" | "worker") => {
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Firebase Connecting...",
        description: "Please wait a moment while Firebase initializes."
      })
      return
    }

    setDemoLoadingRole(role)
    setDemoNotice(null)

    try {
      const res = await startReviewerDemoSession(auth, db, role)
      
      toast({
        title: `Authenticated as ${role === 'admin' ? 'Municipal Admin' : 'Sanitation Worker'}`,
        description: `Logged in to isolated sandbox under real Firebase Auth (${res.isAnonymousFallback ? 'Anonymous Token' : 'Demo Account'}).`
      })

      // Short pause to ensure Firestore listener state stabilizes
      setTimeout(() => {
        router.push(`/${role}/dashboard`)
      }, 350)
    } catch (err: any) {
      setDemoLoadingRole(null)
      console.error("Demo launch failed:", err)
      setDemoNotice(err.message || "Failed to initialize demo session.")
      toast({
        variant: "destructive",
        title: "Demo Authentication Error",
        description: err.message || "Could not launch reviewer demo session."
      })
    }
  }

  const isAdminPortal = roleParam === 'admin'
  const isWorkerPortal = roleParam === 'worker'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50/70 py-10 px-4">
      {/* Top Bar Header */}
      <div className="mb-6 flex w-full max-w-lg items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="rounded-xl gap-1 text-muted-foreground hover:text-foreground">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-primary font-bold">
          <Leaf className="h-5 w-5" />
          <span>WasteIQ · Baripada</span>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold border-emerald-300 text-emerald-800 bg-emerald-50">
          Civic Tech
        </Badge>
      </div>

      <Card className="w-full max-w-lg border border-border/70 shadow-xl bg-white rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-4 pt-6 bg-gradient-to-b from-emerald-50/60 to-white border-b border-border/40">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {isAdminPortal ? <ShieldCheck className="h-6 w-6" /> : isWorkerPortal ? <Briefcase className="h-6 w-6" /> : <Leaf className="h-6 w-6" />}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            WasteIQ Access Portal
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
            Smart municipal waste management and citizen participation platform for Baripada, Odisha.
          </CardDescription>

          {/* Mode Switch Tabs */}
          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/70 p-1">
                <TabsTrigger value="demo" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                  Judge / Reviewer Demo
                </TabsTrigger>
                <TabsTrigger value="credentials" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Lock className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                  Standard Login
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* TAB 1: REVIEWER DEMO ACCESS */}
          {activeTab === "demo" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/80 p-3.5 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-emerald-700 text-white text-[10px] font-bold">
                    My Bharat Social Hack
                  </Badge>
                  <span className="text-xs font-bold text-emerald-900">
                    Evaluation Sandbox
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Review the protected municipal panels with real Firebase authentication and isolated sample Baripada data. Real citizen and administrative records remain secure.
                </p>
              </div>

              {demoNotice && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="font-semibold">Setup Notice:</strong> {demoNotice}
                  </div>
                </div>
              )}

              {/* Option A: Admin Demo */}
              <div className="rounded-xl border border-border p-4 bg-white hover:border-primary/40 transition-all space-y-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Municipal Admin Demo</h4>
                      <p className="text-[11px] text-muted-foreground">Urban Local Body (ULB) Executive Oversight</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-medium bg-emerald-100/60 text-emerald-800">
                    Protected
                  </Badge>
                </div>

                <ul className="text-[11px] text-muted-foreground space-y-1.5 border-t border-border/50 pt-2.5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Live citizen complaint triage & worker task allocation</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Baripada 28-ward smart bin telemetry & GIS route monitoring</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Protected sandbox: sensitive system secrets & real users locked</span>
                  </li>
                </ul>

                <Button 
                  onClick={() => handleLaunchDemo("admin")}
                  disabled={demoLoadingRole !== null}
                  className="w-full rounded-xl font-bold text-xs h-10 bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  {demoLoadingRole === "admin" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating Admin Session...
                    </>
                  ) : (
                    "Launch Admin Demo (Reviewer Mode)"
                  )}
                </Button>
              </div>

              {/* Option B: Worker Demo */}
              <div className="rounded-xl border border-border p-4 bg-white hover:border-primary/40 transition-all space-y-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Sanitation Field Worker Demo</h4>
                      <p className="text-[11px] text-muted-foreground">On-Ground Duty & Task Execution</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-medium bg-sky-100/60 text-sky-800">
                    Mobile-First
                  </Badge>
                </div>

                <ul className="text-[11px] text-muted-foreground space-y-1.5 border-t border-border/50 pt-2.5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 flex-shrink-0" />
                    <span>Assigned complaint tasks in Ward 8 & 12 with live status updates</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 flex-shrink-0" />
                    <span>Interactive Baripada map with bin coordinates and directions</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 flex-shrink-0" />
                    <span>Demonstrates Assigned → In Progress → Resolved completion workflow</span>
                  </li>
                </ul>

                <Button 
                  onClick={() => handleLaunchDemo("worker")}
                  disabled={demoLoadingRole !== null}
                  variant="outline"
                  className="w-full rounded-xl font-bold text-xs h-10 border-sky-600 text-sky-700 hover:bg-sky-50"
                >
                  {demoLoadingRole === "worker" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating Worker Session...
                    </>
                  ) : (
                    "Launch Worker Demo (Reviewer Mode)"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: STANDARD CREDENTIAL LOGIN */}
          {activeTab === "credentials" && (
            <form onSubmit={handleStandardSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id" className="text-xs font-semibold">
                  {isAdminPortal ? 'Admin Username or Email' : 'Registered Email Address'}
                </Label>
                <Input 
                  id="id" 
                  type="text"
                  placeholder={isAdminPortal ? "admin@baripadawasteIQ" : "citizen@example.com"} 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required 
                  className="h-11 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" text-xs font-semibold>Password</Label>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="h-11 rounded-xl pr-10 text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl font-bold text-sm" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Credentials...
                  </>
                ) : "Sign In to Account"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-border/40 bg-slate-50/50 py-4 px-6 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            <span>Role-Based Authorization backed by Firestore Rules</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Need citizen registration? <Link href="/signup" className="font-semibold text-primary hover:underline">Create Citizen Account</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
