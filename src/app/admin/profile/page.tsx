"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  Settings, 
  UserCheck, 
  Lock,
  Loader2
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase"
import { doc } from "firebase/firestore"

export default function AdminProfile() {
  const { toast } = useToast()
  const { user, isUserLoading } = useUser()
  const db = useFirestore()

  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid, "adminProfile", "profile")
  }, [db, user?.uid])

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef)
  
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    phone: ""
  })

  useEffect(() => {
    if (profileData) {
      setEditData({
        username: profileData.fullName || "Admin Chief",
        email: profileData.email || "admin@baripada.gov",
        phone: profileData.mobileNumber || "+91 06792 252000"
      })
    }
  }, [profileData])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileRef) return

    updateDocumentNonBlocking(profileRef, {
      fullName: editData.username,
      email: editData.email,
      mobileNumber: editData.phone
    })

    toast({
      title: "System Admin Updated",
      description: "Official records have been refreshed.",
    })
  }

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !profileData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Admin Profile Missing</h2>
        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Access restricted. Please sign in again or contact IT support.</p>
        <Button asChild className="mt-6 rounded-xl"><Link href="/login?role=admin">Back to Login</Link></Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
        </div>
      </header>

      <main className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-sm text-center py-8">
            <CardContent className="space-y-4">
              <div className="mx-auto h-32 w-32 rounded-3xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                <ShieldCheck className="h-16 w-16" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{profileData.fullName || 'Admin Chief'}</h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Super Administrator</p>
              </div>
              <Badge variant="secondary" className="rounded-lg uppercase text-[10px] font-bold">System Level: 4</Badge>
            </CardContent>
          </Card>

          <Button asChild variant="destructive" className="w-full h-12 rounded-xl shadow-lg shadow-destructive/10">
            <Link href="/" className="flex items-center justify-center gap-2">
              <LogOut className="h-5 w-5" />
              Secure Logout
            </Link>
          </Button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-0 divide-y">
              <div className="p-6">
                <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4">Account Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1.5">
                      <UserCheck className="h-3 w-3" />
                      Official Username
                    </p>
                    <p className="text-sm font-bold">admin@baripadawasteIQ</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3" />
                      Access ID
                    </p>
                    <p className="text-sm font-bold">ADM-BAR-{user.uid.slice(0, 4).toUpperCase()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1.5">
                      <Mail className="h-3 w-3" />
                      Official Email
                    </p>
                    <p className="text-sm font-bold">{profileData.email || user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1.5">
                      <Phone className="h-3 w-3" />
                      Direct Line
                    </p>
                    <p className="text-sm font-bold">{profileData.mobileNumber || '+91 06792 252000'}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="rounded-xl font-bold text-xs h-9">Edit System Info</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Admin Information</DialogTitle>
                        <DialogDescription>Update official system contact details.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSave} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="username">Admin Name</Label>
                          <Input 
                            id="username" 
                            value={editData.username} 
                            onChange={(e) => setEditData({...editData, username: e.target.value})}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Official Email</Label>
                          <Input 
                            id="email" 
                            value={editData.email} 
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Direct Line</Label>
                          <Input 
                            id="phone" 
                            value={editData.phone} 
                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            className="rounded-xl"
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="w-full rounded-xl">Save Changes</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4">Security & Maintenance</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between h-12 rounded-xl bg-background border-none shadow-sm group">
                    <div className="flex items-center gap-3">
                      <Lock className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">Update Password</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between h-12 rounded-xl bg-background border-none shadow-sm group">
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">System Audit Logs</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
