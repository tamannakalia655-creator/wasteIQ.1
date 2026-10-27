
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { Loader2 } from "lucide-react"
import { ChatBot } from "@/components/ChatBot"

import { BottomNav } from "@/components/layout/bottom-nav"

export default function CitizenLayout(props: {
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
      router.push("/login?role=citizen")
    } else if (!isUserDataLoading && userData && userData.role !== "citizen") {
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

  if (userData?.role !== "citizen") return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar role="citizen" />
        <main className="flex-1 relative pb-16 md:pb-0">
          <div className="md:hidden absolute top-4 left-4 z-40">
            <SidebarTrigger className="bg-white/90 backdrop-blur-md shadow-sm rounded-xl" />
          </div>
          {children}
          <div className="md:hidden">
            <BottomNav role="citizen" />
          </div>
          <ChatBot />
        </main>
      </div>
    </SidebarProvider>
  )
}
