
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Hash, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Trophy, 
  Sparkles,
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
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase"
import { doc } from "firebase/firestore"

export default function CitizenProfile() {
  const { toast } = useToast()
  const { user, isUserLoading } = useUser()
  const db = useFirestore()

  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid, "citizenProfile", "profile")
  }, [db, user?.uid])

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef)

  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    address: ""
  })

  useEffect(() => {
    if (profileData) {
      setEditData({
        name: profileData.fullName || "",
        phone: "", 
        address: profileData.address || ""
      })
    }
  }, [profileData])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileRef) return

    updateDocumentNonBlocking(profileRef, {
      fullName: editData.name,
      address: editData.address
    })

    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
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
          <Settings className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Profile Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">It looks like your profile record is missing. Try signing out and back in.</p>
        <Button asChild className="mt-6 rounded-xl"><Link href="/login">Back to Sign In</Link></Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/citizen/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">My Profile</h1>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/citizen/settings"><Settings className="h-5 w-5" /></Link>
        </Button>
      </header>

      <main className="container max-w-lg space-y-6 px-4 py-6 mx-auto">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-primary/10 shadow-lg p-1">
              <img src={`https://picsum.photos/seed/${user.uid}/200/200`} className="h-full w-full rounded-full object-cover" alt="User" />
            </div>
            <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-2 ring-white">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold">{profileData.fullName}</h2>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-secondary" />
            Eco Champion • Ward {profileData.wardId}
          </p>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0 divide-y">
            <div className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Hash className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Citizen ID</p>
                <p className="text-sm font-semibold">{profileData.citizenId}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Email Address</p>
                <p className="text-sm font-semibold">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Address</p>
                <p className="text-sm font-semibold">{profileData.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
           <Dialog>
             <DialogTrigger asChild>
               <Button variant="outline" className="w-full h-12 justify-between rounded-xl bg-white border-none shadow-sm">
                  <span className="font-semibold">Edit Personal Info</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
               </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-[425px] rounded-2xl">
               <DialogHeader>
                 <DialogTitle>Edit Profile</DialogTitle>
                 <DialogDescription>
                   Make changes to your profile here. Click save when you're done.
                 </DialogDescription>
               </DialogHeader>
               <form onSubmit={handleSave} className="grid gap-4 py-4">
                 <div className="grid gap-2">
                   <Label htmlFor="name">Full Name</Label>
                   <Input 
                     id="name" 
                     value={editData.name} 
                     onChange={(e) => setEditData({...editData, name: e.target.value})}
                     className="rounded-xl"
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="address">Address</Label>
                   <Input 
                     id="address" 
                     value={editData.address} 
                     onChange={(e) => setEditData({...editData, address: e.target.value})}
                     className="rounded-xl"
                   />
                 </div>
                 <DialogFooter>
                   <Button type="submit" className="w-full rounded-xl mt-2">Save changes</Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>

           <Button variant="outline" className="w-full h-12 justify-between rounded-xl bg-white border-none shadow-sm">
              <span className="font-semibold">Reward History</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
           </Button>
        </div>

        <Button asChild variant="ghost" className="w-full h-12 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive">
           <Link href="/" className="flex items-center justify-center gap-2">
              <LogOut className="h-5 w-5" />
              Sign Out from Account
           </Link>
        </Button>
      </main>
    </div>
  )
}
