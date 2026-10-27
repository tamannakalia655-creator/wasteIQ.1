
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Leaf, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc } from "firebase/firestore"
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const router = useRouter()
  const auth = useAuth()
  const db = useFirestore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    ward: "",
    address: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // 2. Create Base User Doc (Non-blocking)
      // Mirroring essential data here for administrative listing efficiency
      const userRef = doc(db, "users", user.uid)
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        email: formData.email,
        mobileNumber: formData.mobile,
        fullName: formData.name, // Mirrored for Admin UI
        wardId: formData.ward,   // Mirrored for Admin UI
        role: "citizen",
        createdAt: new Date().toISOString()
      }, { merge: true })

      // 3. Create Detailed Citizen Profile (Non-blocking)
      const profileRef = doc(db, "users", user.uid, "citizenProfile", "profile")
      setDocumentNonBlocking(profileRef, {
        id: "profile",
        userId: user.uid,
        fullName: formData.name,
        address: formData.address,
        wardId: formData.ward,
        totalRewardPoints: 0,
        citizenId: `C-${Math.floor(1000 + Math.random() * 9000)}`
      }, { merge: true })

      toast({
        title: "Welcome to WasteIQ!",
        description: "Your citizen account has been successfully created.",
      })
      
      router.push("/citizen/dashboard")
    } catch (err: any) {
      console.error("Signup Error:", err)
      let msg = "An unexpected error occurred. Please try again."
      if (err.code === 'auth/email-already-in-use') msg = "This email is already registered."
      if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters."
      
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  const wards = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-6 flex w-full max-w-md items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div className="flex items-center gap-2 text-primary">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg">WasteIQ</span>
        </div>
        <div className="w-10" />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Join Baripada's Movement</CardTitle>
          <CardDescription>Register to help keep our city clean and earn eco-points across all 28 wards.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" placeholder="+91..." required value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ward">Ward Number (1-28)</Label>
                <Select required onValueChange={(v) => setFormData({...formData, ward: v})}>
                  <SelectTrigger className="h-10 rounded-md">
                    <SelectValue placeholder="Select Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((w) => (
                      <SelectItem key={w} value={w.toString()}>Ward {w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Street, Locality" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4">
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link href="/login?role=citizen" className="font-semibold text-primary">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
