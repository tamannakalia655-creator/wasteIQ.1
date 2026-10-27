
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { Loader2 } from "lucide-react"

export default function AdminLayout(props: {
  children: React.ReactNode
}) {
  const { children } = props
  const router = useRouter()
  const { user, isUserLoading } = useUser()
  const db = useFirestore()

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid)
  }, [db, user?.uid])

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userRef)

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login?role=admin")
    } else if (!isUserDataLoading && userData && userData.role !== "admin") {
      router.push(`/${userData.role}/dashboard`)
    }
  }, [user, isUserLoading, userData, isUserDataLoading, router])

  if (isUserLoading || isUserDataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (userData?.role !== "admin") return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar role="admin" />
        <main className="flex-1 relative">
          <div className="md:hidden absolute top-4 left-4 z-50">
            <SidebarTrigger className="bg-white/80 backdrop-blur-md shadow-sm rounded-xl" />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
