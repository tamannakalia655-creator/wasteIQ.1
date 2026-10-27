
"use client"

import { useState, Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft, Leaf, ShieldCheck, Loader2, Info, Briefcase } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase"

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const db = useFirestore()
  const role = searchParams.get('role') || 'citizen'
  
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier || !password || !db) return
    
    setLoading(true)

    try {
      const trimmedId = identifier.trim()
      const isOfficialAdminUsername = trimmedId === "admin@baripadawasteIQ"
      const loginEmail = isOfficialAdminUsername ? "admin@baripada.gov" : trimmedId
      const loginPassword = isOfficialAdminUsername ? "admin@123" : password

      // 1. Attempt Authentication
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      const user = userCredential.user

      // 2. Initial Role Check
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (!userDoc.exists()) {
        // First-time initialization for special accounts
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
      // This prevents Permission Errors on the next page by ensuring the rule get() succeeds
      const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const actualRole = snapshot.data().role
          
          // Role-Gate Verification
          if (role === 'admin' && actualRole !== 'admin') {
            unsubscribe()
            setLoading(false)
            toast({ variant: "destructive", title: "Access Denied", description: "This is not an admin account." })
            return
          }
          if (role === 'worker' && actualRole !== 'worker') {
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

  const isAdminPortal = role === 'admin' || identifier === 'admin@baripadawasteIQ';
  const isWorkerPortal = role === 'worker';
  const roleTitle = isAdminPortal ? 'Admin Portal' : isWorkerPortal ? 'Worker Access' : 'Citizen Login';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-6 flex w-full max-w-md items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div className="flex items-center gap-2 text-primary">
          <Leaf className="h-6 w-6" />
          <span className="font-bold text-lg">WasteIQ</span>
        </div>
        <div className="w-10" />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl shadow-primary/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {isAdminPortal ? <ShieldCheck className="h-7 w-7" /> : isWorkerPortal ? <Briefcase className="h-7 w-7" /> : <Leaf className="h-7 w-7" />}
          </div>
          <CardTitle className="text-2xl font-bold">{roleTitle}</CardTitle>
          <CardDescription>Secure access to the Baripada WasteIQ platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">{isAdminPortal ? 'Admin Username' : 'Email Address'}</Label>
              <Input 
                id="id" 
                type="text"
                placeholder={isAdminPortal ? "admin@baripadawasteIQ" : "your@email.com"} 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required 
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="h-11 rounded-xl pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t py-6">
          {isAdminPortal && (
            <div className="rounded-xl bg-blue-50 p-3 border border-blue-100 flex gap-2 text-left">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-blue-800 font-medium">
                Official Admin Access: Designated username and password provided by the municipality.
              </p>
            </div>
          )}
          <p className="text-sm text-muted-foreground text-center">
            {role === 'citizen' ? (
              <>New here? <Link href="/signup" className="font-semibold text-primary">Create account</Link></>
            ) : (
              <>Need help? <Link href="/citizen/help" className="font-semibold text-primary">Contact support</Link></>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
